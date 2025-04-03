package com.proyectoweb.appweb.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Inventario;
import com.proyectoweb.appweb.entidades.Producto;

public interface InventarioRepositorio extends JpaRepository <Inventario, Long> {
    Optional<Inventario> findByProducto(Producto producto);
}
