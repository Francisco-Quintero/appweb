package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.Cliente;
import com.proyectoweb.appweb.entidades.DetalleProducto;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.repositorio.ClienteRepositorio;
import com.proyectoweb.appweb.repositorio.PedidoRepositorio;
import com.proyectoweb.appweb.repositorio.ProductoRepositorio;

@Service
public class PedidoServicio {

    @Autowired
    private ClienteRepositorio clienteRepositorio;

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

    public List<Pedido> listarPorCliente(Long id) {
        Cliente cliente = clienteRepositorio.findById(id).orElse(null);
        return pedidoRepositorio.findByCliente(cliente);
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
