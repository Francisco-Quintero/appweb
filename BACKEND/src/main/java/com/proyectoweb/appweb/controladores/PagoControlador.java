package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Pago;
import com.proyectoweb.appweb.servicios.PagoServicio;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoControlador {

    @Autowired
    private PagoServicio pagoServicio;

    @GetMapping
    public List<Pago> listarTodos() {
        return pagoServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Pago obtenerPorId(@PathVariable Long id) {
        return pagoServicio.obtenerPorId(id);
    }

    @PostMapping
    public Pago guardar(@RequestBody Pago pago) {
        return pagoServicio.guardar(pago);
    }

    @PutMapping("/{id}")
    public Pago actualizar(@PathVariable Long id, @RequestBody Pago pago) {
        pago.setIdPago(id);
        return pagoServicio.guardar(pago);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        pagoServicio.eliminar(id);
    }
}

