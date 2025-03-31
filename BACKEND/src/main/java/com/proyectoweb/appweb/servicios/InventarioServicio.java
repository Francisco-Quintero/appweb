package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Inventario;
import com.proyectoweb.appweb.repositorio.InventarioRepositorio;

@Service
public class InventarioServicio {

    @Autowired
    private InventarioRepositorio inventarioRepositorio;

    public List<Inventario> listarTodos() {
        return inventarioRepositorio.findAll();
    }

    public Inventario obtenerPorId(Long id) {
        return inventarioRepositorio.findById(id).orElse(null);
    }

    public Inventario guardar(Inventario inventario) {
        return inventarioRepositorio.save(inventario);
    }

    public void eliminar(Long id) {
        inventarioRepositorio.deleteById(id);
    }

    public Inventario actualizarParcial(Long id, Inventario inventarioParcial) {
        // Buscar el inventario existente por ID
        Inventario inventarioExistente = inventarioRepositorio.findById(id).orElse(null);
        if (inventarioExistente == null) {
            return null; // Si no se encuentra, devolver null
        }
    
        // Actualizar solo los campos no nulos del inventario parcial
        if (inventarioParcial.getStock() != null) {
            inventarioExistente.setStock(inventarioParcial.getStock());
        }
    
        // Guardar y devolver el inventario actualizado
        return inventarioRepositorio.save(inventarioExistente);
    }
}