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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Long idProveedor;

    @Column(name = "nombre_Contacto")
    private String nombreContacto;

    @Column(name = "nombre_Empresa")
    private String nombreEmpresa;

    @Column(name = "numero_contacto")
    private String numeroContacto;

    @Column(name = "correo")
    private String correo;

    @Column(name = "frecuencia_abastecimiento")
    private int frecuenciaAbastecimiento;
}