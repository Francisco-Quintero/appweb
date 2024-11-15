package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Pedido;

public interface PedidoRepositorio extends JpaRepository <Pedido, Long> {
    
}
