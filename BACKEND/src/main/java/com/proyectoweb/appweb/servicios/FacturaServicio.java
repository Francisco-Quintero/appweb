package com.proyectoweb.appweb.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Factura;
import com.proyectoweb.appweb.repositorio.FacturaRepositorio;

import java.util.List;

@Service
public class FacturaServicio {
    
    @Autowired
    private FacturaRepositorio facturaRepositorio;

    public List<Factura> listarTodos() {
        return facturaRepositorio.findAll();
    }

    public Factura obtenerPorId(Long id) {
        return facturaRepositorio.findById(id).orElse(null);
    }

    public Factura guardar(Factura factura) {
        // Calcular impuestos antes de guardar
        factura.calcularImpuestos();
        return facturaRepositorio.save(factura);
    }
    public void eliminar(Long id) {
        facturaRepositorio.deleteById(id);
    }
}
