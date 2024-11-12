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
public class Suministro {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idSuministro;
    private Date fechaSuministro;
    private int cantidad;
    private Double precioCompra;

    @ManyToOne
    private Proveedor proveedor;

    @ManyToOne
    private Producto producto;
}
