package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idPedido;
    private Date fechaPedido;
    private String estadoPedido;
    private Double costoEnvio;
    private Date horaEntrega;

    @ManyToOne
    private Cliente cliente;

    @OneToMany
    private List<DetalleProducto> detalles;
}

