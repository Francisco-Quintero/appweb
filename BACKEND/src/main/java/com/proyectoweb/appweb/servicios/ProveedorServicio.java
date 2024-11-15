package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Proveedor;
import com.proyectoweb.appweb.repositorio.ProveedorRepositorio;

@Service
public class ProveedorServicio {

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    public List<Proveedor> listarTodos() {
        return proveedorRepositorio.findAll();
    }

    public Proveedor obtenerPorId(Long id) {
        return proveedorRepositorio.findById(id).orElse(null);
    }

    public Proveedor guardar(Proveedor proveedor) {
        return proveedorRepositorio.save(proveedor);
    }

    public void eliminar(Long id) {
        proveedorRepositorio.deleteById(id);
    }
}
