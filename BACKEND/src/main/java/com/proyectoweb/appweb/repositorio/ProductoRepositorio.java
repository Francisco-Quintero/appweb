package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoweb.appweb.entidades.Producto;

public interface ProductoRepositorio extends JpaRepository <Producto, Long> {

}