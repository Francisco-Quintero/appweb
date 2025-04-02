package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Rol;
import com.proyectoweb.appweb.repositorio.RolRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RolServicio {

    @Autowired
    private RolRepositorio rolRepositorio;

    public Rol obtenerPorNombre(String nombre) {
        return rolRepositorio.findByNombre(nombre).orElse(null);
    }
}