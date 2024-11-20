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
@Table(name = "suministro")
@Getter
@Setter
public class Suministro {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_suministro")
    private Long idSuministro;

    @Column(name = "fecha_suministro")
    private Date fechaSuministro;

    @Column(name = "cantidad")
    private int cantidad;

    @Column(name = "precio_compra")
    private Double precioCompra;

    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
}
