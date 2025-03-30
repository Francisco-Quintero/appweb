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

@Entity
@Table(name = "detalle_producto")
@Getter
@Setter
public class DetalleProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @Column(name = "cantidad")
    private int cantidad;

    @Column(name = "descuento")
    private Double descuento;

    @JoinColumn(name = "id_producto")
    @ManyToOne
    private Producto producto;
}

