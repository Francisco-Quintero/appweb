// Inicializar el módulo de compras
// import { API_URL } from "../../JS/estadoGlobal";

export async function initCompras(estadoGlobal) {
    console.log("Inicializando módulo de compras...")
  
    // Mostrar estado de carga
    mostrarEstadoCarga(true)
  
    try {
      // Verificar si los datos necesarios están disponibles en el estado global
      if (
        estadoGlobal.proveedores.length === 0 ||
        estadoGlobal.inventario.length === 0 ||
        estadoGlobal.productos.length === 0
      ) {
        console.warn("Algunos datos no están disponibles en el estado global. Intentando cargar desde la API...")
        await cargarDatosNecesarios(estadoGlobal)
      }
  
      // Cargar compras desde la API
     // await cargarComprasDesdeAPI(estadoGlobal)
  
      // Renderizar las compras
      renderizarCompras(estadoGlobal)
  
      // Configurar eventos del módulo
      configurarEventListeners(estadoGlobal)
  
      // Ocultar estado de carga
      mostrarEstadoCarga(false)
    } catch (error) {
      console.error("Error al inicializar el módulo de compras:", error)
      mostrarError("Ocurrió un error al cargar el módulo de compras.")
    }
  }
  
  // Mostrar u ocultar el estado de carga
  function mostrarEstadoCarga(mostrar) {
    const estadoCarga = document.getElementById("estado-carga")
    const tablaContainer = document.querySelector(".tabla-container")
  
    if (estadoCarga) {
      estadoCarga.style.display = mostrar ? "flex" : "none"
    }
  
    if (tablaContainer) {
      tablaContainer.style.display = mostrar ? "none" : "block"
    }
  }
  
  // Mostrar mensaje de error
  function mostrarError(mensaje) {
    mostrarEstadoCarga(false)
  
    const mensajeError = document.getElementById("mensaje-error")
    if (mensajeError) {
      const mensajeTexto = mensajeError.querySelector("p")
      if (mensajeTexto) {
        mensajeTexto.textContent = mensaje
      }
      mensajeError.style.display = "flex"
    }
  
    // Configurar botón de reintentar
    const btnReintentar = document.getElementById("btn-reintentar")
    if (btnReintentar) {
      btnReintentar.addEventListener("click", () => {
        location.reload()
      })
    }
  }
  
  // Cargar datos necesarios desde la API
  async function cargarDatosNecesarios(estadoGlobal) {
    try {
      // Cargar proveedores si no están disponibles
      if (estadoGlobal.proveedores.length === 0) {
        const responseProveedores = await fetch(`${API_URL}/Proveedores`)
        if (responseProveedores.ok) {
          const proveedores = await responseProveedores.json()
          estadoGlobal.actualizarProveedores(proveedores)
          console.log("Proveedores cargados:", proveedores.length)
        } else {
          console.error("Error al cargar proveedores:", responseProveedores.statusText)
        }
      }
  
      // Cargar productos si no están disponibles
      if (estadoGlobal.productos.length === 0) {
        const responseProductos = await fetch(`${API_URL}/productos`)
        if (responseProductos.ok) {
          const productos = await responseProductos.json()
          estadoGlobal.actualizarProductos(productos)
          console.log("Productos cargados:", productos.length)
        } else {
          console.error("Error al cargar productos:", responseProductos.statusText)
        }
      }
  
      // Cargar inventario si no está disponible
      if (estadoGlobal.inventario.length === 0) {
        const responseInventario = await fetch(`${API_URL}/inventarios`)
        if (responseInventario.ok) {
          const inventario = await responseInventario.json()
          estadoGlobal.actualizarInventario(inventario)
          console.log("Inventario cargado:", inventario.length)
        } else {
          console.error("Error al cargar inventario:", responseInventario.statusText)
        }
      }
    } catch (error) {
      console.error("Error al cargar datos necesarios:", error)
      throw new Error("No se pudieron cargar los datos necesarios para el módulo de compras.")
    }
  }
  
  // Cargar compras desde la API
  async function cargarComprasDesdeAPI(estadoGlobal) {
    try {
      const response = await fetch(`${API_URL}/suministros`)
      if (!response.ok) {
        throw new Error(`Error al cargar suministros: ${response.status} ${response.statusText}`)
      }
  
      const suministros = await response.json()
      estadoGlobal.actualizarSuministros(suministros)
      console.log("Suministros cargados:", suministros.length)
    } catch (error) {
      console.error("Error al cargar compras desde la API:", error)
      throw new Error("No se pudieron cargar las compras desde el servidor.")
    }
  }
  
  // Renderizar las compras en la tabla
  function renderizarCompras(estadoGlobal) {
    console.log("Renderizando compras en la tabla")
    const cuerpoTabla = document.getElementById("cuerpoTablaCompras")
    const comprasEmpty = document.getElementById("compras-empty")
    const tablaContainer = document.querySelector(".tabla-container")
  
    if (!cuerpoTabla) {
      console.error("No se encontró el elemento cuerpoTablaCompras")
      return
    }
  
    const suministros = estadoGlobal.suministros || []
  
    if (suministros.length === 0) {
      cuerpoTabla.innerHTML = ""
      if (comprasEmpty) {
        comprasEmpty.style.display = "flex"
      }
      if (tablaContainer) {
        tablaContainer.style.display = "none"
      }
      return
    }
  
    if (comprasEmpty) {
      comprasEmpty.style.display = "none"
    }
  
    if (tablaContainer) {
      tablaContainer.style.display = "block"
    }
  
    cuerpoTabla.innerHTML = suministros
      .map((suministro) => {
        // Formatear fecha
        const fecha = new Date(suministro.fechaSuministro)
        const fechaFormateada = fecha.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
  
        // Calcular total si no existe
        const total =
          suministro.precioCompra ||
          (suministro.productos ? suministro.productos.reduce((sum, p) => sum + p.precioCompraTotal, 0) : 0)
  
        return `
              <tr>
                  <td>${suministro.idSuministro}</td>
                  <td>${fechaFormateada}</td>
                  <td>${suministro.proveedor ? suministro.proveedor.nombreContacto : "No especificado"}</td>
                  <td>$${total.toFixed(2)}</td>
                  <td>
                      <span class="estado-compra estado-${suministro.estado || "completado"}">
                          ${suministro.estado || "Completado"}
                      </span>
                  </td>
                  <td>
                      <button class="btn-icono" title="Ver detalles" data-id="${suministro.idSuministro}" data-action="ver">
                          <i data-lucide="eye"></i>
                      </button>
                  </td>
              </tr>
          `
      })
      .join("")
  
    // Inicializar iconos de Lucide
    if (window.lucide) {
      window.lucide.createIcons()
    }
  
    console.log("Compras renderizadas en la tabla")
  }
  
  // Configurar eventos del módulo
  function configurarEventListeners(estadoGlobal) {
    // Botón de nueva compra
    const btnNuevaCompra = document.getElementById("btnNuevaCompra")
    if (btnNuevaCompra) {
      btnNuevaCompra.addEventListener("click", () => mostrarFormularioCompra())
    }
  
    // Botón de crear primera compra
    const btnCrearPrimeraCompra = document.getElementById("btnCrearPrimeraCompra")
    if (btnCrearPrimeraCompra) {
      btnCrearPrimeraCompra.addEventListener("click", () => mostrarFormularioCompra())
    }
  
    // Botones de cerrar modales
    const btnCerrarModal = document.getElementById("btnCerrarModal")
    if (btnCerrarModal) {
      btnCerrarModal.addEventListener("click", cerrarModal)
    }
  
    const btnCerrarFormulario = document.getElementById("btnCerrarFormulario")
    if (btnCerrarFormulario) {
      btnCerrarFormulario.addEventListener("click", cerrarFormularioCompra)
    }
  
    // Botón de cancelar compra
    const btnCancelarCompra = document.getElementById("btnCancelarCompra")
    if (btnCancelarCompra) {
      btnCancelarCompra.addEventListener("click", cerrarFormularioCompra)
    }
  
    // Botón de agregar producto
    const btnAgregarProducto = document.getElementById("btnAgregarProducto")
    if (btnAgregarProducto) {
      btnAgregarProducto.addEventListener("click", () => agregarProducto(estadoGlobal))
    }
  
    // Botón de guardar compra
    const btnGuardarCompra = document.getElementById("btnGuardarCompra")
    if (btnGuardarCompra) {
      btnGuardarCompra.addEventListener("click", () => guardarCompra(estadoGlobal))
    }
  
    // Campo de búsqueda de productos
    const busquedaProducto = document.getElementById("busquedaProducto")
    if (busquedaProducto) {
      busquedaProducto.addEventListener("input", (e) => {
        const resultados = buscarProductos(e.target.value, estadoGlobal)
        mostrarResultadosBusqueda(resultados, estadoGlobal)
      })
  
      busquedaProducto.addEventListener("focus", () => {
        const resultados = buscarProductos(busquedaProducto.value, estadoGlobal)
        mostrarResultadosBusqueda(resultados, estadoGlobal)
      })
  
      busquedaProducto.addEventListener("blur", () => {
        // Retraso para permitir que se haga clic en los resultados
        setTimeout(() => {
          const resultadosBusqueda = document.getElementById("resultadosBusqueda")
          if (resultadosBusqueda) {
            resultadosBusqueda.style.display = "none"
          }
        }, 200)
      })
    }
  
    // Campo de proveedor
    const proveedorInput = document.getElementById("proveedor")
    if (proveedorInput) {
      proveedorInput.addEventListener("focus", () => mostrarListaProveedores(estadoGlobal))
      proveedorInput.addEventListener("input", () => mostrarListaProveedores(estadoGlobal))
    }
  
    // Eventos de la tabla de compras
    const cuerpoTablaCompras = document.getElementById("cuerpoTablaCompras")
    if (cuerpoTablaCompras) {
      cuerpoTablaCompras.addEventListener("click", (e) => {
        const boton = e.target.closest("button")
        if (boton) {
          const idSuministro = Number.parseInt(boton.dataset.id)
          const accion = boton.dataset.action
  
          if (accion === "ver") {
            verDetallesCompra(idSuministro, estadoGlobal)
          }
        }
      })
    }
  
    // Búsqueda de compras
    const busquedaCompra = document.getElementById("busquedaCompra")
    const btnBuscar = document.getElementById("btnBuscar")
  
    if (busquedaCompra && btnBuscar) {
      btnBuscar.addEventListener("click", () => {
        filtrarCompras(busquedaCompra.value, estadoGlobal)
      })
  
      busquedaCompra.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          filtrarCompras(busquedaCompra.value, estadoGlobal)
        }
      })
    }
  }
  
  // Filtrar compras por término de búsqueda
  function filtrarCompras(termino, estadoGlobal) {
    if (!termino) {
      renderizarCompras(estadoGlobal)
      return
    }
  
    termino = termino.toLowerCase()
  
    const suministrosFiltrados = estadoGlobal.suministros.filter((suministro) => {
      return (
        suministro.idSuministro.toString().includes(termino) ||
        (suministro.proveedor && suministro.proveedor.nombreContacto.toLowerCase().includes(termino)) ||
        (suministro.proveedor && suministro.proveedor.nombreEmpresa.toLowerCase().includes(termino)) ||
        (suministro.estado && suministro.estado.toLowerCase().includes(termino))
      )
    })
  
    const estadoGlobalTemporal = {
      ...estadoGlobal,
      suministros: suministrosFiltrados,
    }
  
    renderizarCompras(estadoGlobalTemporal)
  
    // Mostrar mensaje si no hay resultados
    const comprasEmpty = document.getElementById("compras-empty")
    const tablaContainer = document.querySelector(".tabla-container")
  
    if (suministrosFiltrados.length === 0) {
      if (comprasEmpty) {
        comprasEmpty.querySelector("p").textContent = "No se encontraron compras que coincidan con tu búsqueda."
        comprasEmpty.querySelector("button").textContent = "Limpiar filtros"
        comprasEmpty.style.display = "flex"
      }
      if (tablaContainer) {
        tablaContainer.style.display = "none"
      }
    }
  }
  
  // Mostrar lista de proveedores
  function mostrarListaProveedores(estadoGlobal) {
    const datalistProveedores = document.getElementById("listaProveedores")
    if (datalistProveedores) {
      datalistProveedores.innerHTML = estadoGlobal.proveedores
        .map(
          (proveedor) =>
            `<option value="${proveedor.nombreEmpresa} - ${proveedor.nombreContacto}" data-id="${proveedor.idProveedor}"></option>`,
        )
        .join("")
    }
  }
  
  // Buscar productos por término
  function buscarProductos(termino, estadoGlobal) {
    if (!termino || termino.length < 2) return []
  
    termino = termino.toLowerCase()
  
    return estadoGlobal.productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(termino)),
    )
  }
  
  // Mostrar resultados de búsqueda de productos
  function mostrarResultadosBusqueda(resultados, estadoGlobal) {
    const divResultados = document.getElementById("resultadosBusqueda")
    if (!divResultados) return
  
    if (resultados.length === 0) {
      divResultados.style.display = "none"
      return
    }
  
    divResultados.innerHTML = ""
    resultados.forEach((producto) => {
      const div = document.createElement("div")
      div.textContent = `${producto.nombre} - ${producto.descripcion || "Sin descripción"}`
      div.dataset.id = producto.idProducto
      div.onclick = () => seleccionarProducto(producto, estadoGlobal)
      divResultados.appendChild(div)
    })
  
    divResultados.style.display = "block"
  }
  
  // Seleccionar un producto de los resultados
  function seleccionarProducto(producto, estadoGlobal) {
    const busquedaProducto = document.getElementById("busquedaProducto")
    const resultadosBusqueda = document.getElementById("resultadosBusqueda")
  
    if (busquedaProducto) {
      busquedaProducto.value = producto.nombre
      busquedaProducto.dataset.id = producto.idProducto
    }
  
    if (resultadosBusqueda) {
      resultadosBusqueda.style.display = "none"
    }
  
    // Buscar el inventario para este producto
    const inventarioItem = estadoGlobal.inventario.find(
      (item) => item.producto && item.producto.idProducto === producto.idProducto,
    )
  
    // Mostrar notificación con el stock actual
    if (inventarioItem) {
      mostrarNotificacion(`Stock actual: ${inventarioItem.stock} unidades`, "info")
    }
  }
  
  // Variable para almacenar los productos de la compra actual
  let productosCompraActual = []
  
  // Agregar un producto a la compra
  function agregarProducto(estadoGlobal) {
    const busquedaProducto = document.getElementById("busquedaProducto")
    const cantidad = document.getElementById("cantidad")
    const precioCompraTotal = document.getElementById("precioCompraTotal")
  
    if (!busquedaProducto || !cantidad || !precioCompraTotal) {
      console.error("No se encontraron los campos del formulario")
      return
    }
  
    const idProducto = Number.parseInt(busquedaProducto.dataset.id)
    const cantidadValor = Number.parseInt(cantidad.value)
    const precioValor = Number.parseFloat(precioCompraTotal.value)
  
    // Validar campos
    if (!idProducto || isNaN(cantidadValor) || isNaN(precioValor)) {
      mostrarNotificacion("Por favor, complete todos los campos correctamente", "error")
      return
    }
  
    if (cantidadValor <= 0 || precioValor <= 0) {
      mostrarNotificacion("La cantidad y el precio deben ser mayores a cero", "error")
      return
    }
  
    // Buscar el producto
    const producto = estadoGlobal.productos.find((p) => p.idProducto === idProducto)
    if (!producto) {
      mostrarNotificacion("Producto no encontrado", "error")
      return
    }
  
    // Crear objeto de producto para la compra
    const productoCompra = {
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      cantidadMedida: producto.cantidadMedida,
      unidadMedida: producto.unidadMedida,
      cantidad: cantidadValor,
      precioCompraTotal: precioValor,
    }
  
    // Verificar si ya existe el producto en la lista
    const productoExistente = productosCompraActual.findIndex((p) => p.idProducto === idProducto)
  
    if (productoExistente >= 0) {
      // Actualizar producto existente
      productosCompraActual[productoExistente] = productoCompra
      mostrarNotificacion(`Se actualizó ${producto.nombre} en la lista`, "info")
    } else {
      // Agregar nuevo producto
      productosCompraActual.push(productoCompra)
      mostrarNotificacion(`Se agregó ${producto.nombre} a la lista`, "success")
    }
  
    // Actualizar tabla de productos
    actualizarTablaProductos()
  
    // Actualizar totales
    actualizarTotales()
  
    // Limpiar formulario
    limpiarFormularioProducto()
  }
  
  // Actualizar tabla de productos
  function actualizarTablaProductos() {
    const tbody = document.querySelector("#tablaProductos tbody")
    const productosEmpty = document.getElementById("productos-empty")
  
    if (!tbody) return
  
    if (productosCompraActual.length === 0) {
      tbody.innerHTML = ""
      if (productosEmpty) {
        productosEmpty.style.display = "table-row"
      }
      return
    }
  
    if (productosEmpty) {
      productosEmpty.style.display = "none"
    }
  
    tbody.innerHTML = productosCompraActual
      .map(
        (producto, indice) => `
          <tr>
              <td>${producto.cantidad}</td>
              <td>${producto.unidadMedida || "Unidad"}</td>
              <td>${producto.nombre}</td>
              <td>$${producto.precioCompraTotal.toFixed(2)}</td>
              <td>
                  <button class="btn-icono" data-indice="${indice}" data-action="eliminar" title="Eliminar">
                      <i data-lucide="trash-2"></i>
                  </button>
              </td>
          </tr>
      `,
      )
      .join("")
  
    // Agregar eventos a los botones de eliminar
    tbody.querySelectorAll('button[data-action="eliminar"]').forEach((boton) => {
      boton.addEventListener("click", () => {
        const indice = Number.parseInt(boton.dataset.indice)
        eliminarProducto(indice)
      })
    })
  
    // Inicializar iconos de Lucide
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
  
  // Eliminar un producto de la compra
  function eliminarProducto(indice) {
    if (indice < 0 || indice >= productosCompraActual.length) {
      return
    }
  
    const producto = productosCompraActual[indice]
    productosCompraActual.splice(indice, 1)
  
    mostrarNotificacion(`Se eliminó ${producto.nombre} de la lista`, "info")
  
    // Actualizar tabla y totales
    actualizarTablaProductos()
    actualizarTotales()
  }
  
  // Actualizar totales de la compra
  function actualizarTotales() {
    const subtotalElement = document.getElementById("subtotal")
    const gananciaElement = document.getElementById("ganancia")
    const totalElement = document.getElementById("total")
  
    if (!subtotalElement || !gananciaElement || !totalElement) return
  
    if (productosCompraActual.length === 0) {
      subtotalElement.textContent = "$0.00"
      gananciaElement.textContent = "$0.00"
      totalElement.textContent = "$0.00"
      return
    }
  
    const subtotal = productosCompraActual.reduce((sum, p) => sum + p.precioCompraTotal, 0)
    const ganancia = subtotal * 0.2 // 20% de ganancia
    const total = subtotal + ganancia
  
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`
    gananciaElement.textContent = `$${ganancia.toFixed(2)}`
    totalElement.textContent = `$${total.toFixed(2)}`
  }
  
  // Limpiar formulario de producto
  function limpiarFormularioProducto() {
    const busquedaProducto = document.getElementById("busquedaProducto")
    const cantidad = document.getElementById("cantidad")
    const precioCompraTotal = document.getElementById("precioCompraTotal")
    const resultadosBusqueda = document.getElementById("resultadosBusqueda")
  
    if (busquedaProducto) {
      busquedaProducto.value = ""
      busquedaProducto.dataset.id = ""
    }
  
    if (cantidad) cantidad.value = ""
    if (precioCompraTotal) precioCompraTotal.value = ""
    if (resultadosBusqueda) resultadosBusqueda.style.display = "none"
  }
  
  // Guardar una compra
  async function guardarCompra(estadoGlobal) {
    const proveedorInput = document.getElementById("proveedor")
    const observaciones = document.getElementById("observaciones")
  
    if (!proveedorInput) {
      mostrarNotificacion("Error en el formulario", "error")
      return
    }
  
    const proveedorSeleccionado = proveedorInput.value
  
    // Validar que haya un proveedor seleccionado y productos agregados
    if (!proveedorSeleccionado) {
      mostrarNotificacion("Por favor, seleccione un proveedor", "error")
      return
    }
  
    if (productosCompraActual.length === 0) {
      mostrarNotificacion("Agregue al menos un producto a la compra", "error")
      return
    }
  
    // Buscar el proveedor en el estado global
    const proveedor = estadoGlobal.proveedores.find(
      (p) => `${p.nombreEmpresa} - ${p.nombreContacto}` === proveedorSeleccionado,
    )
  
    if (!proveedor) {
      mostrarNotificacion("Proveedor no encontrado", "error")
      return
    }
  
    // Mostrar indicador de carga
    const btnGuardarCompra = document.getElementById("btnGuardarCompra")
    if (btnGuardarCompra) {
      btnGuardarCompra.disabled = true
      btnGuardarCompra.innerHTML = '<i data-lucide="loader"></i><span>Guardando...</span>'
      if (window.lucide) window.lucide.createIcons()
    }
  
    try {
      // Construir el objeto de la compra con la estructura exacta que espera la API
      const suministro = {
        idSuministro: 0, // La API asignará el ID real
        fechaSuministro: new Date().toISOString(),
        idProveedor: proveedor.idProveedor,
        proveedor: proveedor,
        productos: productosCompraActual.map((producto) => ({
          idProducto: producto.idProducto,
          cantidad: producto.cantidad,
          precioCompraTotal: producto.precioCompraTotal,
          nombre: producto.nombre, // Mantener el nombre para la UI
        })),
        observaciones: observaciones ? observaciones.value : "",
        estado: "completado",
      }

      console.log("Suministro a guardar:", suministro)
  
      // Enviar la compra al backend
      const response = await fetch(`${API_URL}/suministros/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(suministro),
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Error al guardar la compra: ${error.message || response.statusText}`)
      }
  
      const suministroGuardado = await response.json()
      console.log("Suministro guardado:", suministroGuardado)
  
      // Actualizar el estado global
      estadoGlobal.suministros.push(suministroGuardado)
      estadoGlobal.actualizarSuministros([...estadoGlobal.suministros])
  
      // Actualizar el inventario para cada producto de la compra
      productosCompraActual.forEach((producto) => {
        const inventarioExistente = estadoGlobal.inventario.find(
          (i) => i.producto && i.producto.idProducto === producto.idProducto,
        )
  
        if (inventarioExistente) {
          // Si el inventario ya existe, actualizar el stock
          inventarioExistente.stock += producto.cantidad
        } else {
          // Si no existe, crear un nuevo inventario
          estadoGlobal.inventario.push({
            producto: estadoGlobal.productos.find((p) => p.idProducto === producto.idProducto),
            stock: producto.cantidad,
          })
        }
      })
  
      // Notificar cambios en el inventario
      estadoGlobal.actualizarInventario([...estadoGlobal.inventario])
  
      mostrarNotificacion("Compra guardada exitosamente", "success")
  
      // Cerrar el formulario
      cerrarFormularioCompra()
  
      // Renderizar las compras actualizadas
      renderizarCompras(estadoGlobal)
    } catch (error) {
      console.error("Error al guardar la compra:", error)
      mostrarNotificacion(`Error: ${error.message}`, "error")
    } finally {
      // Restaurar botón
      if (btnGuardarCompra) {
        btnGuardarCompra.disabled = false
        btnGuardarCompra.innerHTML = '<i data-lucide="save"></i><span>Guardar Compra</span>'
        if (window.lucide) window.lucide.createIcons()
      }
    }
  }
  
  // Ver detalles de una compra
  function verDetallesCompra(idSuministro, estadoGlobal) {
    const suministro = estadoGlobal.suministros.find((s) => s.idSuministro === idSuministro)
    if (!suministro) {
      mostrarNotificacion("Compra no encontrada", "error")
      return
    }
  
    const detallesCompra = document.getElementById("detallesCompra")
    const modalCompra = document.getElementById("modalCompra")
  
    if (!detallesCompra || !modalCompra) {
      console.error("No se encontraron los elementos del modal")
      return
    }
  
    // Formatear fecha
    const fecha = new Date(suministro.fechaSuministro)
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  
    // Calcular total
    const total =
      suministro.precioCompra ||
      (suministro.productos ? suministro.productos.reduce((sum, p) => sum + p.precioCompraTotal, 0) : 0)
  
    // Construir HTML de detalles
    detallesCompra.innerHTML = `
          <div class="detalles-seccion">
              <h4>Información General</h4>
              <div class="detalles-grid">
                  <div class="detalles-item">
                      <div class="detalles-label">ID de Compra</div>
                      <div class="detalles-valor">${suministro.idSuministro}</div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Fecha</div>
                      <div class="detalles-valor">${fechaFormateada}</div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Estado</div>
                      <div class="detalles-valor">
                          <span class="estado-compra estado-${suministro.estado || "completado"}">
                              ${suministro.estado || "Completado"}
                          </span>
                      </div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Total</div>
                      <div class="detalles-valor">$${total.toFixed(2)}</div>
                  </div>
              </div>
          </div>
          
          <div class="detalles-seccion">
              <h4>Proveedor</h4>
              <div class="detalles-grid">
                  <div class="detalles-item">
                      <div class="detalles-label">Empresa</div>
                      <div class="detalles-valor">${suministro.proveedor ? suministro.proveedor.nombreEmpresa : "No especificado"}</div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Contacto</div>
                      <div class="detalles-valor">${suministro.proveedor ? suministro.proveedor.nombreContacto : "No especificado"}</div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Teléfono</div>
                      <div class="detalles-valor">${suministro.proveedor && suministro.proveedor.telefono ? suministro.proveedor.telefono : "No especificado"}</div>
                  </div>
                  <div class="detalles-item">
                      <div class="detalles-label">Email</div>
                      <div class="detalles-valor">${suministro.proveedor && suministro.proveedor.email ? suministro.proveedor.email : "No especificado"}</div>
                  </div>
              </div>
          </div>
          
          <div class="detalles-seccion">
              <h4>Productos</h4>
              <div class="tabla-container">
                  <table class="tabla-productos">
                      <thead>
                          <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${
                            suministro.productos && suministro.productos.length > 0
                              ? suministro.productos
                                  .map(
                                    (producto) => `
                                  <tr>
                                      <td>${producto.nombre || "Producto #" + producto.idProducto}</td>
                                      <td>${producto.cantidad} ${producto.unidadMedida || "unidades"}</td>
                                      <td>$${producto.precioCompraTotal ? producto.precioCompraTotal.toFixed(2) : "0.00"}</td>
                                  </tr>
                              `,
                                  )
                                  .join("")
                              : '<tr><td colspan="3" class="text-center">No hay productos registrados</td></tr>'
                          }
                      </tbody>
                  </table>
              </div>
          </div>
          
          ${
            suministro.observaciones
              ? `
              <div class="detalles-seccion">
                  <h4>Observaciones</h4>
                  <p>${suministro.observaciones}</p>
              </div>
          `
              : ""
          }
      `
  
    // Mostrar modal
    modalCompra.style.display = "block"
  
    // Inicializar iconos de Lucide
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
  
  // Mostrar el formulario para agregar una nueva compra
  function mostrarFormularioCompra() {
    const modal = document.getElementById("modalNuevaCompra")
    if (!modal) {
      console.error("No se encontró el modal para nueva compra")
      return
    }
  
    // Inicializar productos de compra
    productosCompraActual = []
  
    // Limpiar formulario
    const proveedorInput = document.getElementById("proveedor")
    const observaciones = document.getElementById("observaciones")
  
    if (proveedorInput) proveedorInput.value = ""
    if (observaciones) observaciones.value = ""
  
    // Limpiar tabla de productos
    actualizarTablaProductos()
  
    // Actualizar totales
    actualizarTotales()
  
    // Mostrar modal
    modal.style.display = "block"
  
    // Inicializar iconos de Lucide
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
  
  // Cerrar el modal de detalles
  function cerrarModal() {
    const modal = document.getElementById("modalCompra")
    if (modal) {
      modal.style.display = "none"
    }
  }
  
  // Cerrar el formulario de nueva compra
  function cerrarFormularioCompra() {
    const modal = document.getElementById("modalNuevaCompra")
    if (modal) {
      modal.style.display = "none"
    }
  }
  
  // Mostrar notificación
  function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement("div")
    notificacion.className = `notificacion ${tipo}`
    notificacion.innerHTML = `
          <div class="notificacion-contenido">
              <i data-lucide="${tipo === "success" ? "check-circle" : tipo === "warning" ? "alert-triangle" : tipo === "info" ? "info" : "alert-circle"}"></i>
              <span>${mensaje}</span>
          </div>
      `
  
    // Agregar al DOM
    document.body.appendChild(notificacion)
  
    // Inicializar iconos
    if (window.lucide) {
      window.lucide.createIcons()
    }
  
    // Mostrar con animación
    setTimeout(() => {
      notificacion.classList.add("visible")
    }, 10)
  
    // Eliminar después de un tiempo
    setTimeout(() => {
      notificacion.classList.remove("visible")
      setTimeout(() => {
        document.body.removeChild(notificacion)
      }, 300)
    }, 3000)
  }
  
  