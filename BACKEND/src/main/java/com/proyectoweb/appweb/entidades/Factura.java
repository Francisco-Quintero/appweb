package com.proyectoweb.appweb.entidades;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "factura")
@Getter
@Setter
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Long idFactura;

    @Column(name = "fecha_emision", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date fechaEmision;

    @Column(name = "sub_total", nullable = false)
    private Double subTotal;

    @Column(name = "impuestos", nullable = false)
    private Double impuestos;

    @Column(name = "monto_total", nullable = false)
    private Double total;

    @Column(name = "estado_factura", nullable = false)
    private String estadoFactura;

    @OneToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Pago> pagos;

    // Métodos adicionales
    public void generarFactura() {
        System.out.println("Generando factura...");
        // Lógica para generar la factura
    }

    public void cambiarEstado(String nuevoEstado) {
        this.estadoFactura = nuevoEstado;
    }

    public void generarPDF() {
        System.out.println("Generando PDF de la factura...");
        // Lógica para generar un PDF
    }

    public void calcularImpuestos() {
        this.impuestos = this.subTotal * 0.19; // Ejemplo: 19% de impuestos
        this.total = this.subTotal + this.impuestos;
    }
}
