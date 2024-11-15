package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Factura;
import com.proyectoweb.appweb.servicios.FacturaServicio;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaControlador {

    @Autowired
    private FacturaServicio facturaServicio;

    @GetMapping
    public List<Factura> listarTodas() {
        return facturaServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Factura obtenerPorId(@PathVariable Long id) {
        return facturaServicio.obtenerPorId(id);
    }

    @PostMapping
    public Factura guardar(@RequestBody Factura factura) {
        return facturaServicio.guardar(factura);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        facturaServicio.eliminar(id);
    }
}

