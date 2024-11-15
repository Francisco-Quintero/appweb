package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Factura;

public interface FacturaRepositorio extends JpaRepository <Factura, Long> {

}
