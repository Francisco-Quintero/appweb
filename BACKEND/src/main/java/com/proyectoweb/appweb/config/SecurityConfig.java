package com.proyectoweb.appweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Nueva forma de deshabilitar CSRF
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/usuarios/login", "/api/**").permitAll() // Permitir acceso al login
                .anyRequest().authenticated() // Proteger todas las demás rutas
            );

        return http.build();
    }
}