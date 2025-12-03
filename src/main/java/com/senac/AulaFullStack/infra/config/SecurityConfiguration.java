package com.senac.AulaFullStack.infra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity http) throws Exception{
        return http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests( auth -> auth
                        // --- PÚBLICAS ---
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/swagger-resources/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll() // Cadastro público

                        // --- PROTEGIDAS POR ROLE (BOLT) ---

                        // Rotas de Admin (CUD para entidades principais)
                        .requestMatchers(HttpMethod.POST, "/alunos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/alunos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/alunos/**").hasRole("ADMIN")

                        .requestMatchers("/onibus/cadastro").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/onibus/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/onibus/**").hasRole("ADMIN")

                        // Rotas de Consulta (Geral)
                        .requestMatchers(HttpMethod.GET, "/alunos").hasAnyRole("ADMIN", "COORDENADORA", "COORDENADOR_PORTA", "REFEITORIO")
                        .requestMatchers(HttpMethod.GET, "/onibus").hasAnyRole("ADMIN", "COORDENADORA")

                        // Rotas de Operação (Módulos)
                        .requestMatchers("/registros/**").authenticated()
                        .requestMatchers("/coordenadora/onibus").hasRole("COORDENADORA")

                        // Usuários
                        .requestMatchers(HttpMethod.GET , "/usuarios/equipe").authenticated()
                        .requestMatchers(HttpMethod.GET , "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/editar").authenticated()
                        .requestMatchers(HttpMethod.GET , "/usuarios").hasRole("ADMIN") // Só Admin lista todos
                        .requestMatchers(HttpMethod.DELETE , "/usuarios/**").hasRole("ADMIN") // Só Admin deleta

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}