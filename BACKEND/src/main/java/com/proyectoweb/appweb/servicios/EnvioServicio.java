package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.Envio;
import com.proyectoweb.appweb.repositorio.EnvioRepositorio;

@Service
public class EnvioServicio {

    @Autowired
    private EnvioRepositorio envioRepositorio;

    public List<Envio> listarTodos() {
        return envioRepositorio.findAll();
    }

    public Envio obtenerPorId(Long id) {
        return envioRepositorio.findById(id).orElse(null);
    }

    public Envio guardar(Envio envio) {
        return envioRepositorio.save(envio);
    }

    public void eliminar(Long id) {
        envioRepositorio.deleteById(id);
    }
}
