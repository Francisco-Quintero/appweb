package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.entidades.Usuario;

import java.util.List;


public interface PedidoRepositorio extends JpaRepository <Pedido, Long> {
    
    List<Pedido> findByUsuario(Usuario usuario);
}
