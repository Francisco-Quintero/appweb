package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Pago;
import com.proyectoweb.appweb.repositorio.PagoRepositorio;

@Service
public class PagoServicio {

    @Autowired
    private PagoRepositorio pagoRepositorio;

    public List<Pago> listarTodos() {
        return pagoRepositorio.findAll();
    }

    public Pago obtenerPorId(Long id) {
        return pagoRepositorio.findById(id).orElse(null);
    }

    public Pago guardar(Pago pago) {
        return pagoRepositorio.save(pago);
    }

    public void eliminar(Long id) {
        pagoRepositorio.deleteById(id);
    }
}
