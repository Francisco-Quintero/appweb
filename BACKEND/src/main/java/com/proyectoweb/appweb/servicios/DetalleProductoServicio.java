package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.DetalleProducto;
import com.proyectoweb.appweb.repositorio.DetalleProductoRepositorio;



@Service
public class DetalleProductoServicio {

    @Autowired
    private DetalleProductoRepositorio detalleProductoRepositorio;

    public List<DetalleProducto> listarTodos() {
        return detalleProductoRepositorio.findAll();
    }

    public DetalleProducto obtenerPorId(Long id) {
        return detalleProductoRepositorio.findById(id).orElse(null);
    }

    public DetalleProducto guardar(DetalleProducto detalleProducto) {
        return detalleProductoRepositorio.save(detalleProducto);
    }

    public void eliminar(Long id) {
        detalleProductoRepositorio.deleteById(id);
    }
}
