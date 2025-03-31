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

    public Proveedor actualizarParcial(Long id, Proveedor proveedorParcial) {
        return proveedorRepositorio.findById(id).map(proveedorExistente -> {
            // Actualizar solo los campos no nulos del proveedor parcial
            if (proveedorParcial.getNombreEmpresa() != null) {
                proveedorExistente.setNombreEmpresa(proveedorParcial.getNombreEmpresa());
            }
            if (proveedorParcial.getNombreContacto() != null) {
                proveedorExistente.setNombreContacto(proveedorParcial.getNombreContacto());
            }
            if (proveedorParcial.getCorreo() != null) {
                proveedorExistente.setCorreo(proveedorParcial.getCorreo());
            }
            if (proveedorParcial.getNumeroContacto() != null) {
                proveedorExistente.setNumeroContacto(proveedorParcial.getNumeroContacto());
            }
            if (proveedorParcial.getFrecuenciaAbastecimiento() != null) {
                proveedorExistente.setFrecuenciaAbastecimiento(proveedorParcial.getFrecuenciaAbastecimiento());
            }
    
            // Guardar y devolver el proveedor actualizado
            return proveedorRepositorio.save(proveedorExistente);
        }).orElse(null); // Si no se encuentra el proveedor, devolver null
    }
}
