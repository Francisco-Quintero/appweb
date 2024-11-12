package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idEnvio;
    private Date horaInicio;
    private Date horaEntrega;
    private int tiempoEstimado;

    @ManyToOne
    private Pedido pedido;
}

