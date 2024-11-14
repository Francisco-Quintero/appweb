package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Inventario;

public interface InventarioRepositorio extends JpaRepository <Inventario, Long> {
    
}
