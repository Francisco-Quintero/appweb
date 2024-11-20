package com.proyectoweb.appweb.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "proveedor")
@Getter
@Setter
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_proveedor")
    private Long idProveedor;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "numero_contacto")
    private String numeroContacto;

    @Column(name = "productos_abastece")
    private String productosAbastece;

    @Column(name = "precio_acuerdo")
    private double precioAcuerdo;

    @Column(name = "frecuencia_abastecimiento")
    private int frecuenciaAbastecimiento;
}