package com.proyectoweb.appweb.servicios;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.ActualizacionDTO;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    /**
     * Envía una actualización a todos los clientes suscritos
     * @param tipo Tipo de actualización (inventario, pedidos, etc.)
     * @param datos Datos de la actualización
     */
    public void enviarActualizacion(String tipo, Object datos) {
        ActualizacionDTO actualizacion = new ActualizacionDTO(tipo, datos);
        messagingTemplate.convertAndSend("/topic/actualizaciones", actualizacion);
    }
    
    /**
     * Envía una actualización a un canal específico
     * @param canal Canal de destino
     * @param actualizacion Objeto de actualización
     */
    public void enviarActualizacionACanal(String canal, ActualizacionDTO actualizacion) {
        messagingTemplate.convertAndSend(canal, actualizacion);
    }
}