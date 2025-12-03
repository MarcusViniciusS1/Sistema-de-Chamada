package com.senac.AulaFullStack.application.services;

import com.senac.AulaFullStack.application.dto.login.LoginRequestDto;
import com.senac.AulaFullStack.application.dto.login.RecuperarSenhaDto;
import com.senac.AulaFullStack.application.dto.usuario.*;
import com.senac.AulaFullStack.domain.entity.Onibus;
import com.senac.AulaFullStack.domain.entity.Usuario;
import com.senac.AulaFullStack.domain.interfaces.IEnvioEmail;
import com.senac.AulaFullStack.domain.repository.OnibusRepository;
import com.senac.AulaFullStack.domain.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private IEnvioEmail iEnvioEmail;
    @Autowired private OnibusRepository onibusRepository;
    @Autowired private TokenService tokenService;

    public boolean validarSenha(LoginRequestDto login){
        return usuarioRepository.existsUsuarioByEmailContainingAndSenha(login.email(), login.senha());
    }

    public UsuarioResponseDto consultarPorId(Long id){
        return usuarioRepository.findById(id).map(Usuario::toDtoResponse).orElse(null);
    }

    public List<UsuarioResponseDto> consultarTodosSemFiltro(){
        return usuarioRepository.findAll().stream().map(Usuario::toDtoResponse).collect(Collectors.toList());
    }

    // Listagem inteligente
    public List<UsuarioResponseDto> listarEquipe(UsuarioPrincipalDto principal) {
        Usuario usuarioLogado = usuarioRepository.findById(principal.id()).orElseThrow();
        String role = usuarioLogado.getRole();

        // ADMIN vê todos (busca todos do banco)
        if ("ADMIN".equals(role)) {
            return usuarioRepository.findAll().stream()
                    .map(Usuario::toDtoResponse)
                    .collect(Collectors.toList());
        }

        // COORDENADORA vê sua equipe do ônibus
        if ("COORDENADORA".equals(role) && usuarioLogado.getOnibus() != null) {
            return usuarioRepository.findByOnibusId(usuarioLogado.getOnibus().getId()).stream()
                    .map(Usuario::toDtoResponse)
                    .collect(Collectors.toList());
        }

        // Outros perfis veem apenas a si mesmos
        return List.of(usuarioLogado.toDtoResponse());
    }

    @Transactional
    public UsuarioResponseDto salvarUsuario(UsuarioRequestDto usuarioRequest, UsuarioPrincipalDto userLogadoDto) {
        var existente = usuarioRepository.findByEmail(usuarioRequest.email()).orElse(null);
        if (existente != null && (usuarioRequest.id() == null || !existente.getId().equals(existente.getId()))) {
            if (!existente.getCpf().equals(usuarioRequest.cpf())) {
                throw new RuntimeException("Email já cadastrado!");
            }
        }

        Usuario criador = null;
        boolean isCriadorAdmin = false;

        if (userLogadoDto != null) {
            criador = usuarioRepository.findById(userLogadoDto.id()).orElse(null);
            if (criador != null && "ADMIN".equals(criador.getRole())) {
                isCriadorAdmin = true;
            }
        }

        Onibus onibusVinculo = null;
        String roleVinculo = usuarioRequest.role();

        if (!isCriadorAdmin) {
            if ("ADMIN".equals(roleVinculo)) {
                throw new RuntimeException("Permissão negada: Você não pode criar usuários Administradores.");
            }
            if (roleVinculo == null || roleVinculo.isEmpty()) {
                roleVinculo = "USER";
            }
        }

        if (usuarioRequest.onibusId() != null) {
            onibusVinculo = onibusRepository.findById(usuarioRequest.onibusId()).orElseThrow(() -> new RuntimeException("Ônibus não encontrado."));
        }

        Onibus finalOnibus = onibusVinculo;
        String finalRole = roleVinculo;

        Usuario usuario = usuarioRepository.findByCpf(usuarioRequest.cpf())
                .map(u -> {
                    u.setNome(usuarioRequest.nome());
                    if(usuarioRequest.senha() != null && !usuarioRequest.senha().isEmpty()) u.setSenha(usuarioRequest.senha());
                    u.setEmail(usuarioRequest.email());
                    u.setTelefone(usuarioRequest.telefone());
                    if(finalOnibus != null) u.setOnibus(finalOnibus);
                    u.setRole(finalRole);
                    return u;
                })
                .orElse(new Usuario(usuarioRequest, finalOnibus));

        if (isCriadorAdmin && usuarioRequest.role() != null) {
            usuario.setRole(usuarioRequest.role());
        } else {
            usuario.setRole(finalRole);
        }

        usuarioRepository.save(usuario);
        return usuario.toDtoResponse();
    }

    /**
     * Gera um token de recuperação (código) e envia por e-mail.
     */
    public void recuperarSenha(RecuperarSenhaDto dto) {
        var usuario = usuarioRepository.findByEmail(dto.email()).orElse(null);
        if (usuario != null){
            // Gera um código de 6 dígitos
            String codigo = String.format("%06d", new Random().nextInt(999999));
            usuario.setTokenSenha(codigo);
            usuarioRepository.save(usuario);
            iEnvioEmail.enviarEmailComTemplate(usuario.getEmail(), "Recuperação de Senha - Sistema BOLT", codigo);
        }
    }

    /**
     * Valida o token e registra a nova senha do usuário.
     */
    @Transactional
    public void registrarNovaSenha(RegistrarNovaSenhaDto dto) {
        var usuario = usuarioRepository.findByEmailAndTokenSenha(dto.email(), dto.token())
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado."));

        usuario.setSenha(dto.senha());
        usuario.setTokenSenha(null);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public UsuarioResponseDto editarUsuario(UsuarioRequestEdicao dto, UsuarioPrincipalDto principal) {
        boolean isAdmin = principal.autorizacao().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long idAlvo = (isAdmin && dto.id() != null) ? dto.id() : principal.id();

        Usuario usuario = usuarioRepository.findById(idAlvo)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.nome());
        usuario.setTelefone(dto.telefone());
        usuario.setEmail(dto.email());

        // Apenas Admin pode alterar Permissões e Onibus
        if (isAdmin) {
            if (dto.role() != null && !dto.role().isEmpty()) usuario.setRole(dto.role());
            if (dto.onibusId() != null) {
                Onibus onibus = onibusRepository.findById(dto.onibusId()).orElseThrow();
                usuario.setOnibus(onibus);
            } else if (dto.onibusId() == null && usuario.getOnibus() != null) {
                // Se o ID for null, remove o vínculo
                usuario.setOnibus(null);
            }
        }

        usuarioRepository.save(usuario);
        return usuario.toDtoResponse();
    }

    public UsuarioResponseDto buscarUsuarioLogado(UsuarioPrincipalDto principal) {
        return usuarioRepository.findById(principal.id()).map(Usuario::toDtoResponse).orElseThrow();
    }

    public void deletar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuário não encontrado");
        }
    }
}