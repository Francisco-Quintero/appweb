package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class HistorialVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idHistorial;
    private Date fechaVenta;

    @OneToMany
    private List<Pedido> pedidos;
}

