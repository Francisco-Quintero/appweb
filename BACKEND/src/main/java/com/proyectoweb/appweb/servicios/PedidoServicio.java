package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.Cliente;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.repositorio.ClienteRepositorio;
import com.proyectoweb.appweb.repositorio.PedidoRepositorio;

@Service
public class PedidoServicio {

    @Autowired
    private ClienteRepositorio clienteRepositorio;

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

    public List<Pedido> listarPorCliente(Long id) {
        Cliente cliente = clienteRepositorio.findById(id).orElse(null);
        return pedidoRepositorio.findByCliente(cliente);
    }
}
