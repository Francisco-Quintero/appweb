package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "envio")
@Getter
@Setter
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_envio")
    private Long idEnvio;

    @Column(name = "hora_envio")
    private Date horaEnvio;

    @Column(name = "estado_envio")
    private String estadoEnvio;

    @Column(name = "tiempo_estimado")
    private int tiempoEstimado;

    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;
}

