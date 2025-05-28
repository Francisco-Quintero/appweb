package com.proyectoweb.appweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(@SuppressWarnings("null") MessageBrokerRegistry config) {
        // Prefijo para canales de salida (del servidor al cliente)
        config.enableSimpleBroker("/topic");
        
        // Prefijo para canales de entrada (del cliente al servidor)
        config.setApplicationDestinationPrefixes("/app");
    }

    @SuppressWarnings("null")
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint para la conexión WebSocket con fallback a SockJS
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*") // En producción, especifica los orígenes permitidos
                .withSockJS();
    }
}