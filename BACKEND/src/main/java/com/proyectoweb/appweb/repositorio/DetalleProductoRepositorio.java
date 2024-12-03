package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.DetalleProducto;

public interface DetalleProductoRepositorio extends JpaRepository <DetalleProducto, Long> {

}
