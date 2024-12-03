(function () {
    console.log('Iniciando carga del módulo de stock con API');

    let inventario = [];

    async function cargarDatosDesdeAPI() {
        try {
            const response = await fetch('http://localhost:26209/api/inventarios');
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            inventario = await response.json();
            console.log('Datos de inventario cargados desde la API:', inventario);
        } catch (error) {
            console.error('Error al cargar datos desde la API:', error);
        }
    }

    function cargarInventarioEnTabla() {
        console.log('Cargando inventario en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaStock');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaStock');
            return;
        }

        const contenidoTabla = inventario.length === 0
            ? '<tr><td colspan="7" class="text-center">No hay inventario registrado.</td></tr>'
            : inventario.map(item => `
            <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                <td>${item.id}</td>
                <td>${item.producto.nombre}</td>
                <td>${item.stock}</td>
                <td>${item.puntoReorden}</td>
                <td>${item.producto.precioUnitario}</td>
                <td>${item.fechaActualizacion}</td>
                <td>${item.estado}</td>
                <td>
                    <button onclick="window.moduloStock.editarInventario(${item.id})" class="btn-icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
            </tr>
            `).join('');
        cuerpoTabla.innerHTML = contenidoTabla;
    }

    function editarInventario(id) {
        console.log('Editando inventario para ID:', id);

        const item = inventario.find(i => i.id === id);
        if (!item) {
            console.error('No se encontró el ítem de inventario');
            return;
        }

        document.getElementById('idInventario').value = item.id;
        document.getElementById('nombreProducto').value = item.producto.nombre;
        document.getElementById('stockActual').value = item.stock;
        document.getElementById('stockActual').disabled = true;
        document.getElementById('puntoReorden').value = item.puntoReorden;
        document.getElementById('precioUnitario').value = item.producto.precioUnitario;
        document.getElementById('modalStock').style.display = 'block';
    }

    function buscarInventario() {
        console.log('Buscando en inventario');
        const termino = document.getElementById('busquedaStock').value.toLowerCase();
        const resultados = inventario.filter(item =>
            item.producto.nombre.toLowerCase().includes(termino) ||
            item.producto.categoria.toLowerCase().includes(termino)
        );

        const cuerpoTabla = document.getElementById('cuerpoTablaStock');
        cuerpoTabla.innerHTML = resultados.map(item => `
            <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                <td>${item.id}</td>
                <td>${item.producto.nombre}</td>
                <td>${item.stock}</td>
                <td>${item.puntoReorden}</td>
                <td>${item.producto.precioUnitario}</td>
                <td>
                    <button onclick="window.moduloStock.editarInventario(${item.id})" class="btn-icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');

        document.getElementById('busquedaStock')?.addEventListener('input', buscarInventario);
        document.getElementById('btnBuscar')?.addEventListener('click', buscarInventario);
        document.getElementById('formularioStock')?.addEventListener('submit', guardarInventario);

        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);

        // Update or add this function
        function cerrarModal() {
            document.getElementById('modalStock').style.display = 'none';
        }
        
    }
    async function guardarInventario(e) {
        e.preventDefault();
        const idInventario = parseInt(document.getElementById("idInventario").value);
        const stock = parseInt(document.getElementById("stockActual").value);
        const puntoReorden = parseInt(document.getElementById("puntoReorden").value);
        const precioUnitario = parseFloat(document.getElementById("precioUnitario").value);

        const producto = inventario.find((item) => item.id === idInventario)?.producto || {};

        const data = {
            id: idInventario,
            stock,
            puntoReorden,
            producto: {
                ...producto,
                precioUnitario,
            },
        };

        try {
            const response = await fetch(`/api/inventario/${idInventario || ''}`, {
                method: idInventario ? "PUT" : "POST", // PUT para actualizar, POST para nuevo
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error al guardar inventario: ${response.statusText}`);
            }

            const actualizado = await response.json();
            console.log("Inventario guardado:", actualizado);

            // Actualizamos localmente la lista
            if (idInventario) {
                const index = inventario.findIndex((item) => item.id === idInventario);
                inventario[index] = actualizado;
            } else {
                inventario.push(actualizado);
            }

            cargarInventarioEnTabla();
            cerrarModal();
        } catch (error) {
            console.error("Error al guardar inventario:", error);
        }
    }


    async function iniciarStock() {
        console.log('Inicializando módulo de stock');
        await cargarDatosDesdeAPI();
        cargarInventarioEnTabla();
        configurarEventListeners();
        console.log('Módulo de stock cargado completamente');
    }

    window.moduloStock = {
        init: iniciarStock,
        editarInventario: editarInventario,
        buscarInventario: buscarInventario
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarStock);
    } else {
        iniciarStock();
    }
})();
