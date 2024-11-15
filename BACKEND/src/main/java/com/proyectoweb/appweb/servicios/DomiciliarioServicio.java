package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.Domiciliario;
import com.proyectoweb.appweb.repositorio.DomiciliarioRepositorio;

@Service
public class DomiciliarioServicio  {

    @Autowired
    private DomiciliarioRepositorio domiciliarioRepositorio;

    public List<Domiciliario> listarTodos() {
        return domiciliarioRepositorio.findAll();
    }

    public Domiciliario obtenerPorId(Long id) {
        return domiciliarioRepositorio.findById(id).orElse(null);
    }

    public Domiciliario guardar(Domiciliario domiciliario) {
        return domiciliarioRepositorio.save(domiciliario);
    }

    public void eliminar(Long id) {
        domiciliarioRepositorio.deleteById(id);
    }
}
