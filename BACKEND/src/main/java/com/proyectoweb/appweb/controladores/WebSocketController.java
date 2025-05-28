package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.proyectoweb.appweb.entidades.ActualizacionDTO;
import com.proyectoweb.appweb.servicios.WebSocketService;

@Controller
public class WebSocketController {

    private final WebSocketService webSocketService;
    
    @Autowired
    public WebSocketController(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }
    
    /**
     * Maneja mensajes enviados a /app/actualizacion
     * y los reenvía a /topic/actualizaciones
     */
    @MessageMapping("/actualizacion")
    @SendTo("/topic/actualizaciones")
    public ActualizacionDTO procesarActualizacion(ActualizacionDTO actualizacion) {
        // Aquí puedes procesar el mensaje si es necesario
        return actualizacion;
    }
}
