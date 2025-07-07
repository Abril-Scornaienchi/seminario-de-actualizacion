class ApplicationModel {
    constructor() {
        this._usuariosRegistrados = {
            "usuario1": { password: "pass123", categoria: "Cliente" },
            "admin": { password: "ClaveSegura!@#", categoria: "Administrador" },
            "cliente1": { password: "passCliente1", categoria: "Cliente" },
            "vendedor1": { password: "passVendedor1", categoria: "Vendedor" },
            "deposito1": { password: "passDeposito1", categoria: "Trabajador de depósito" }
        };

        this._productos = [
            { id: 1, nombre: "Lavandina x 1L", precio: 875.25, stock: 3000 },
            { id: 4, nombre: "Detergente x 500mL", precio: 1102.45, stock: 2010 },
            { id: 22, nombre: "Jabón en polvo x 250g", precio: 650.22, stock: 407 }
        ];

        this._intentosFallidosLogin = 0;
        this._MAX_INTENTOS_LOGIN = 3; 
        this._usuarioActual = null;
        this._permisosPorCategoria = {
            "Administrador": {
                crearCuenta: true, listarArticulo: true, nuevoArticulo: true,
                editarArticulo: true, eliminarArticulo: true, comprarArticulo: true
            },
            "Cliente": {
                crearCuenta: false, listarArticulo: true, nuevoArticulo: false,
                editarArticulo: false, eliminarArticulo: false, comprarArticulo: true
            },
            "Vendedor": {
                crearCuenta: false, listarArticulo: true, nuevoArticulo: true,
                editarArticulo: true, eliminarArticulo: false, comprarArticulo: true
            },
            "Trabajador de depósito": {
                crearCuenta: false, listarArticulo: true, nuevoArticulo: true,
                editarArticulo: true, eliminarArticulo: false, comprarArticulo: true
            }
        };
    }

    _esContrasenaSegura(password) {
        if (password.length < 8 || password.length > 16) return false;
        if (!/[A-Z]/.test(password)) return false;
        const simbolos = (password.match(/[^a-zA-Z0-9]/g) || []).length;
        if (simbolos < 2) return false;
        return true;
    }

    login(username, password) {
        if (this._intentosFallidosLogin >= this._MAX_INTENTOS_LOGIN) {
            return { success: false, message: "Usuario bloqueado. Contacte al administrador.", type: "BLOCKED_GLOBAL" };
        }

        const userData = this._usuariosRegistrados[username];

        if (userData && userData.password === password) {
            this._usuarioActual = { username: username, ...userData };
            this._intentosFallidosLogin = 0;
            let message = `¡Bienvenido/a ${username} (${this._usuarioActual.categoria})!`;
            if (!this._esContrasenaSegura(password)) {
                message += " Sin embargo, su contraseña no es segura. Le recomendamos cambiarla.";
            }
            return { success: true, message: message, usuario: this._usuarioActual };
        } else {
            this._intentosFallidosLogin++;
            let message = "Usuario y/o contraseña incorrecta.";
            if (this._intentosFallidosLogin >= this._MAX_INTENTOS_LOGIN) {
                message = "Demasiados intentos fallidos. Usuario bloqueado globalmente.";
                return { success: false, message: message, type: "BLOCKED_GLOBAL_AFTER_ATTEMPTS" };
            }
            return { success: false, message: message, type: "AUTH_FAILED" };
        }
    }

    logout() {
        this._usuarioActual = null;
        this._intentosFallidosLogin = 0;
        return { success: true, message: "Sesión cerrada exitosamente." };
    }

    crearCuenta(nuevoUsuario, nuevaContrasena, nuevaCategoria) {
        const permisoCheck = this.verificarPermiso("crearCuenta");
        if (!permisoCheck.autorizado) {
            return { success: false, message: permisoCheck.message };
        }

        if (!nuevoUsuario || nuevoUsuario.trim() === "") {
            return { success: false, message: "El usuario no puede estar vacío." };
        }
        if (this._usuariosRegistrados[nuevoUsuario]) {
            return { success: false, message: `El usuario '${nuevoUsuario}' ya existe. Por favor, elija otro.` };
        }
        if (!this._esContrasenaSegura(nuevaContrasena)) {
            return { success: false, message: "La contraseña no cumple con los requisitos de seguridad (8-16 caracteres, 1 mayúscula, 2+ símbolos)." };
        }

        const categoriasValidas = Object.keys(this._permisosPorCategoria);
        if (!categoriasValidas.includes(nuevaCategoria)) {
            return { success: false, message: `Categoría '${nuevaCategoria}' no válida. Elija entre: ${categoriasValidas.join(", ")}.` };
        }

        this._usuariosRegistrados[nuevoUsuario] = { password: nuevaContrasena, categoria: nuevaCategoria };
        console.log("Usuarios actuales:", this._usuariosRegistrados);
        return { success: true, message: `¡Cuenta '${nuevoUsuario}' (${nuevaCategoria}) creada exitosamente!` };
    }

    verificarPermiso(accion) {
        if (!this._usuarioActual) {
            return { autorizado: false, message: "Debe iniciar sesión para realizar esta acción." };
        }
        const categoria = this._usuarioActual.categoria;
        if (this._permisosPorCategoria[categoria] && this._permisosPorCategoria[categoria][accion]) {
            return { autorizado: true };
        } else {
            return { autorizado: false, message: `Su rol de ${categoria} no tiene permiso para '${accion}'.` };
        }
    }

    listarArticulos() {
        if (!this.verificarPermiso("listarArticulo").autorizado) {
            return { success: false, message: this.verificarPermiso("listarArticulo").message };
        }

        if (this._productos.length === 0) {
            return { success: true, message: "No hay artículos registrados.", articulos: [] };
        }

        let lista = "--- Listado de Artículos ---\n";
        this._productos.forEach(p => {
            lista += `ID: ${p.id}, Nombre: ${p.nombre}, Precio: $${p.precio}, Stock: ${p.stock}\n`;
        });
        return { success: true, message: "Listado de artículos obtenido.", articulos: this._productos, formattedList: lista };
    }

    nuevoArticulo(id, nombre, precio, stock) {
        if (!this.verificarPermiso("nuevoArticulo").autorizado) {
            return { success: false, message: this.verificarPermiso("nuevoArticulo").message };
        }

        if (!id || id <= 0 || isNaN(id)) {
            return { success: false, message: "ID inválido. Debe ser un número positivo." };
        }
        if (this._productos.some(p => p.id === id)) {
            return { success: false, message: `Ya existe un artículo con ID ${id}.` };
        }
        if (!nombre || nombre.trim() === "") {
            return { success: false, message: "Nombre del artículo no puede estar vacío." };
        }
        if (!precio || precio <= 0 || isNaN(precio)) {
            return { success: false, message: "Precio inválido. Debe ser un número positivo." };
        }
        if (stock < 0 || isNaN(stock)) {
            return { success: false, message: "Stock inválido. Debe ser un número no negativo." };
        }

        this._productos.push({ id: id, nombre: nombre, precio: precio, stock: stock });
        console.log("Artículos actuales:", this._productos);
        return { success: true, message: `Artículo '${nombre}' (ID: ${id}) creado exitosamente.` };
    }

    editarArticulo(idEditar, nuevoNombre, nuevoPrecio, nuevoStock) {
        if (!this.verificarPermiso("editarArticulo").autorizado) {
            return { success: false, message: this.verificarPermiso("editarArticulo").message };
        }

        const articulo = this._productos.find(p => p.id === idEditar);
        if (!articulo) {
            return { success: false, message: `No se encontró un artículo con ID ${idEditar}.` };
        }

        let changesMade = false;
        if (nuevoNombre !== null && nuevoNombre !== undefined && nuevoNombre.trim() !== "" && nuevoNombre !== articulo.nombre) {
            articulo.nombre = nuevoNombre;
            changesMade = true;
        }

        if (nuevoPrecio !== null && nuevoPrecio !== undefined) {
            if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
                if (nuevoPrecio !== articulo.precio) {
                    articulo.precio = nuevoPrecio;
                    changesMade = true;
                }
            } else {
                return { success: false, message: "Precio no válido." };
            }
        }

        if (nuevoStock !== null && nuevoStock !== undefined) {
            if (!isNaN(nuevoStock) && nuevoStock >= 0) {
                if (nuevoStock !== articulo.stock) {
                    articulo.stock = nuevoStock;
                    changesMade = true;
                }
            } else {
                return { success: false, message: "Stock no válido." };
            }
        }

        if (!changesMade) {
            return { success: false, message: "No se realizaron cambios o los valores ingresados eran iguales a los actuales." };
        }

        console.log("Artículos actualizados:", this._productos);
        return { success: true, message: `Artículo ID ${articulo.id} actualizado exitosamente.`, articulo: articulo };
    }

    eliminarArticulo(idEliminar) {
        if (!this.verificarPermiso("eliminarArticulo").autorizado) {
            return { success: false, message: this.verificarPermiso("eliminarArticulo").message };
        }

        const indiceAEliminar = this._productos.findIndex(p => p.id === idEliminar);

        if (indiceAEliminar === -1) {
            return { success: false, message: `No se encontró un artículo con ID ${idEliminar}.` };
        }

        const nombreEliminado = this._productos[indiceAEliminar].nombre;
        this._productos.splice(indiceAEliminar, 1);
        console.log("Artículos restantes:", this._productos);
        return { success: true, message: `Artículo '${nombreEliminado}' (ID: ${idEliminar}) eliminado exitosamente.` };
    }

    comprarArticulo(idComprar, cantidadComprar) {
        if (!this.verificarPermiso("comprarArticulo").autorizado) {
            return { success: false, message: this.verificarPermiso("comprarArticulo").message };
        }

        const articuloEncontrado = this._productos.find(p => p.id === idComprar);
        if (!articuloEncontrado) {
            return { success: false, message: `No se encontró un artículo con ID ${idComprar}.` };
        }
        if (articuloEncontrado.stock === 0) {
            return { success: false, message: `El artículo '${articuloEncontrado.nombre}' no tiene stock disponible.` };
        }
        if (!cantidadComprar || cantidadComprar <= 0 || isNaN(cantidadComprar)) {
            return { success: false, message: "Cantidad a comprar inválida. Debe ser un número positivo." };
        }
        if (cantidadComprar > articuloEncontrado.stock) {
            return { success: false, message: `Cantidad a comprar excede el stock disponible (${articuloEncontrado.stock}).` };
        }

        articuloEncontrado.stock -= cantidadComprar;
        console.log("Stock actualizado:", this._productos);
        const totalCompra = (articuloEncontrado.precio * cantidadComprar).toFixed(2);
        return {
            success: true,
            message: `¡Compra realizada! Ha adquirido ${cantidadComprar} unidades de '${articuloEncontrado.nombre}'. Nuevo stock: ${articuloEncontrado.stock}.`,
            total: totalCompra,
            articulo: articuloEncontrado
        };
    }

    getUsuarioActual() {
        return this._usuarioActual;
    }

    getArticuloById(id) {
        return this._productos.find(p => p.id === id);
    }
}

export { ApplicationModel };
