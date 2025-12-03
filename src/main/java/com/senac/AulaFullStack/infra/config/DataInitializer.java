package com.senac.AulaFullStack.infra.config;

import com.senac.AulaFullStack.domain.entity.Usuario;
import com.senac.AulaFullStack.domain.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner loadData(
            UsuarioRepository usuarioRepository) {
        return args -> {
            // Verifica se existe algum usuário no banco. Se não, cria o ADMIN.
            if (usuarioRepository.count() == 0) {
                System.out.println("--- Inicializando Usuário ADMIN Padrão ---");

                // Usuário ADMIN padrão: Email: admin@bolt.com, Senha: 123456
                Usuario admin = new Usuario(
                        null, // 1. id
                        "Admin Sistema", // 2. nome
                        "00000000000", // 3. cpf
                        "123456", // 4. senha
                        "admin@bolt.com", // 5. email
                        "999999999", // 6. telefone
                        LocalDateTime.now(), // 7. dataCadastro
                        "ADMIN", // 8. role
                        null, // 9. tokenSenha
                        null, // 10. onibus
                        new ArrayList<>() // 11. tokens
                );

                usuarioRepository.save(admin);
                System.out.println("--- Usuário ADMIN criado com sucesso! ---");

            } else {
                System.out.println("--- Usuários já existentes. Pulando inicialização. ---");
            }
        };
    }
}