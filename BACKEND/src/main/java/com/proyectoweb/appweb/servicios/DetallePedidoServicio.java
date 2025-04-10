package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.DetallePedido;

import com.proyectoweb.appweb.repositorio.DetallePedidoRepositorio;



@Service
public class DetallePedidoServicio {

    @Autowired
    private DetallePedidoRepositorio detalleProductoRepositorio;

    public List<DetallePedido> listarTodos() {
        return detalleProductoRepositorio.findAll();
    }

    public DetallePedido obtenerPorId(Long id) {
        return detalleProductoRepositorio.findById(id).orElse(null);
    }

    public DetallePedido guardar(DetallePedido detallePedido) {
        return detalleProductoRepositorio.save(detallePedido);
    }

    public void eliminar(Long id) {
        detalleProductoRepositorio.deleteById(id);
    }
}
