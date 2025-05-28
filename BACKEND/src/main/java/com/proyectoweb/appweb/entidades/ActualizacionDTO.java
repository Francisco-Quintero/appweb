package com.proyectoweb.appweb.entidades;


public class ActualizacionDTO {
    private String tipo;      // Tipo de actualización (inventario, pedidos, etc.)
    private Object datos;     // Datos de la actualización
    private String mensaje;   // Mensaje opcional
    
    // Constructor vacío
    public ActualizacionDTO() {}
    
    // Constructor con parámetros
    public ActualizacionDTO(String tipo, Object datos) {
        this.tipo = tipo;
        this.datos = datos;
    }
    
    public ActualizacionDTO(String tipo, Object datos, String mensaje) {
        this.tipo = tipo;
        this.datos = datos;
        this.mensaje = mensaje;
    }
    
    // Getters y setters
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Object getDatos() {
        return datos;
    }
    
    public void setDatos(Object datos) {
        this.datos = datos;
    }
    
    public String getMensaje() {
        return mensaje;
    }
    
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}