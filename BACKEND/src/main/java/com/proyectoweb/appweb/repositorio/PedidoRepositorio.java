package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Cliente;
import com.proyectoweb.appweb.entidades.Pedido;
import java.util.List;


public interface PedidoRepositorio extends JpaRepository <Pedido, Long> {
    
    List<Pedido> findByCliente(Cliente cliente);
}
