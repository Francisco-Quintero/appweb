
/*const ModuleManager = {
    activeModule: null,
    moduleStates: {},
    
    cleanupModule(moduleName) {
        if (this.moduleStates[moduleName]) {
            if (typeof this.moduleStates[moduleName].cleanup === 'function') {
                this.moduleStates[moduleName].cleanup();
            }
            this.moduleStates[moduleName].initialized = false;
        }
    },
    
    loadModule(moduleName) {
        console.log(`Cargando módulo: ${moduleName}`);
        
        if (this.activeModule) {
            this.cleanupModule(this.activeModule);
        }
        
        const mainContainer = document.getElementById('main-container');
        if (!mainContainer) {
            console.error('No se encontró el contenedor principal');
            return;
        }
        
        if (!this.moduleStates[moduleName]) {
            this.moduleStates[moduleName] = {
                initialized: false,
                cleanup: null
            };
        }
        
        this.loadModuleFiles(moduleName, mainContainer);
        this.activeModule = moduleName;
    },
    
    loadModuleFiles(moduleName, mainContainer) {
        // Cargar HTML
        fetch(`modules/${moduleName}/${moduleName}.html`)
            .then(response => response.text())
            .then(html => {
                mainContainer.innerHTML = html;
                
                // Cargar CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `modules/${moduleName}/${moduleName}.css`;
                link.setAttribute('data-module', moduleName);
                document.head.appendChild(link);
                
                // Cargar JavaScript
                const script = document.createElement('script');
                script.src = `modules/${moduleName}/${moduleName}.js`;
                script.setAttribute('data-module', moduleName);
                script.onload = () => {
                    const initFunctionName = `inicializarModulo${moduleName.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
                    
                    if (typeof window[initFunctionName] === 'function') {
                        try {
                            window[initFunctionName]();
                            this.moduleStates[moduleName].initialized = true;
                        } catch (error) {
                            console.error(`Error al inicializar el módulo ${moduleName}:`, error);
                        }
                    } else {
                        console.error(`No se encontró la función de inicialización ${initFunctionName}`);
                    }
                };
                document.body.appendChild(script);
            })
            .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
    }
};  */

const ModuleManager = {
    activeModule: null,
    moduleStates: {},
    
    cleanupModule(moduleName) {
        console.log(`Limpiando módulo: ${moduleName}`);
        if (this.moduleStates[moduleName]) {
            if (typeof this.moduleStates[moduleName].cleanup === 'function') {
                this.moduleStates[moduleName].cleanup();
            }
        }
        
        // Remover scripts y estilos del módulo anterior
        document.querySelectorAll(`script[data-module="${moduleName}"]`).forEach(el => el.remove());
        document.querySelectorAll(`link[data-module="${moduleName}"]`).forEach(el => el.remove());
        
        // Limpiar variables globales específicas del módulo
        if (window[`${moduleName}State`]) {
            delete window[`${moduleName}State`];
        }
    },
    
    loadModule(moduleName) {
        console.log(`Cargando módulo: ${moduleName}`);
        
        // Limpiar módulo anterior si existe
        if (this.activeModule) {
            this.cleanupModule(this.activeModule);
        }
        
        const mainContainer = document.getElementById('main-container');
        if (!mainContainer) {
            console.error('No se encontró el contenedor principal');
            return;
        }
        
        // Inicializar estado del módulo si no existe
        if (!this.moduleStates[moduleName]) {
            this.moduleStates[moduleName] = {
                initialized: false,
                cleanup: null
            };
        }
        
        // Cargar HTML primero
        fetch(`modules/${moduleName}/${moduleName}.html`)
            .then(response => response.text())
            .then(html => {
                mainContainer.innerHTML = html;
                
                // Cargar CSS después del HTML
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `modules/${moduleName}/${moduleName}.css`;
                link.setAttribute('data-module', moduleName);
                document.head.appendChild(link);
                
                // Cargar JavaScript después del CSS
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = `modules/${moduleName}/${moduleName}.js`;
                    script.setAttribute('data-module', moduleName);
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            })
            .then(() => {
                // Esperar un momento para asegurar que el DOM esté listo
                setTimeout(() => {
                    const initFunctionName = `inicializarModulo${moduleName.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
                    
                    if (typeof window[initFunctionName] === 'function') {
                        try {
                            window[initFunctionName]();
                            this.moduleStates[moduleName].initialized = true;
                            this.activeModule = moduleName;
                        } catch (error) {
                            console.error(`Error al inicializar el módulo ${moduleName}:`, error);
                        }
                    } else {
                        console.error(`No se encontró la función de inicialización ${initFunctionName}`);
                    }
                }, 100);
            })
            .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
    }
};

// Exponer el ModuleManager globalmente
window.ModuleManager = ModuleManager;

// Configurar event listeners para la navegación
document.addEventListener('DOMContentLoaded', function() {
    // Manejar clics en los enlaces de navegación
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.getAttribute('data-module');
            ModuleManager.loadModule(moduleName);
        });
    });
    
    // Cargar el módulo inicial
    ModuleManager.loadModule('pedidos-asignados');
});

// Configuración del menú de usuario
document.addEventListener('DOMContentLoaded', function() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
});


// Exponer el ModuleManager globalmente
window.ModuleManager = ModuleManager;

// Configurar event listeners para la navegación
document.addEventListener('DOMContentLoaded', function() {
    // Manejar clics en los enlaces de navegación
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.getAttribute('data-module');
            ModuleManager.loadModule(moduleName);
        });
    });
    
    // Cargar el módulo inicial
    ModuleManager.loadModule('pedidos-asignados');
});

// Configuración del menú de usuario
document.addEventListener('DOMContentLoaded', function() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
});