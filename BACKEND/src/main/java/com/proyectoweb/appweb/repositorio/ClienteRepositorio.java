package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectoweb.appweb.entidades.Cliente;

public interface ClienteRepositorio extends JpaRepository <Cliente, Long> {

}
