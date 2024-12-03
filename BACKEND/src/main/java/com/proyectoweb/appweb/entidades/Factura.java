package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;


import java.util.List;

@Entity
@Table(name = "factura")
@Getter
@Setter
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_factura")
    private Long id_factura;

    @Column(name = "fecha_emision")
    private Date fecha_emision;

    @Column(name = "monto_total")
    private double total;


    @Column(name = "estado_Factura")
    private String estadoFactura;

    @OneToMany
    @Column(name = "detalle")
    private List<DetalleProducto> detalles;

    @OneToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;
}
