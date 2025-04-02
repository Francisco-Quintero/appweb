package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.proyectoweb.appweb.entidades.DetalleProducto;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.entidades.Usuario;

import com.proyectoweb.appweb.repositorio.PedidoRepositorio;
import com.proyectoweb.appweb.repositorio.ProductoRepositorio;
import com.proyectoweb.appweb.repositorio.UsuarioRepositorio;

@Service
public class PedidoServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

      @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private PedidoRepositorio pedidoRepositorio;
    
    public List<Pedido> listarTodos() {
        return pedidoRepositorio.findAll();
    }

    public Pedido obtenerPorId(Long id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    public Pedido guardar(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }

    public void eliminar(Long id) {
        pedidoRepositorio.deleteById(id);
    }

    public List<Pedido> listarPorUsuario(Long id) {
        Usuario usuario = usuarioRepositorio.findById(id).orElse(null);
        return pedidoRepositorio.findByUsuario(usuario);
    }

        public Pedido agregarProductoAPedido(Long pedidoId, Long productoId, int cantidad, Double descuento) {
        Pedido pedido = pedidoRepositorio.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Producto producto = productoRepositorio.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        DetalleProducto detalle = new DetalleProducto();
        //detalle.setPedido(pedido);
        detalle.setProducto(producto);
        detalle.setCantidad(cantidad);
        detalle.setDescuento(descuento);

        pedido.getDetalles().add(detalle);
        return pedidoRepositorio.save(pedido);
    }
}
