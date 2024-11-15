package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.repositorio.PedidoRepositorio;

@Service
public class PedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    public List<Pedido> listarTodos() {
        return pedidoRepositorio.findAll();
    }

    public Pedido obtenerPorId(Long id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    public Pedido guardar(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }

    public void eliminar(Long id) {
        pedidoRepositorio.deleteById(id);
    }
}
