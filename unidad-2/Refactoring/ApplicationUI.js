class ApplicationUI {
    constructor(model) {
        this.model = model;
        this.mensajeElemento = document.getElementById("mensaje");
        if (!this.mensajeElemento) {
            console.error("Error: El elemento con ID 'mensaje' no se encontró en el DOM.");
            this.mensajeElemento = document.createElement('p');
            this.mensajeElemento.id = 'mensaje';
            document.body.appendChild(this.mensajeElemento);
        }
    }

    displayMessage(message) {
        this.mensajeElemento.textContent = message;
    }

    showAlert(message) {
        alert(message);
    }

    getInput(promptText) {
        return prompt(promptText);
    }

    confirmAction(confirmText) {
        return confirm(confirmText);
    }

    async handleLogin() {
        const username = this.getInput("Ingrese su usuario:");
        if (username === null) {
            this.displayMessage("Inicio de sesión cancelado.");
            return false;
        }

        const password = this.getInput("Ingrese su contraseña:");
        if (password === null) {
            this.displayMessage("Inicio de sesión cancelado.");
            return false;
        }

        const result = this.model.login(username, password);
        this.displayMessage(result.message);
        return result.success;
    }

    async handleCreateAccount() {
        const permisoCheck = this.model.verificarPermiso("crearCuenta");
        if (!permisoCheck.autorizado) {
            this.displayMessage(permisoCheck.message);
            return;
        }

        let nuevoUsuario = this.getInput("Ingrese el nombre de usuario para la nueva cuenta:");
        if (!nuevoUsuario) {
            this.displayMessage("Creación de cuenta cancelada. El usuario no puede estar vacío.");
            return;
        }

        const tempUserCheck = this.model.login(nuevoUsuario, "tempPassword123");
        if (tempUserCheck.usuario || (tempUserCheck.type === "AUTH_FAILED" && this.model._usuariosRegistrados[nuevoUsuario])) {
             this.displayMessage(`El usuario '${nuevoUsuario}' ya existe. Por favor, elija otro.`);
             return;
        }
        
        let nuevaContrasena;
        let contrasenaValida = false;
        while (!contrasenaValida) {
            nuevaContrasena = this.getInput("Ingrese la contraseña para la nueva cuenta (8-16 caracteres, 1 mayúscula, 2+ símbolos):");
            if (nuevaContrasena === null) {
                this.displayMessage("Creación de cuenta cancelada.");
                return;
            }
            if (nuevaContrasena.trim() === "") {
                this.showAlert("La contraseña no puede estar vacía. Intente de nuevo.");
                continue;
            }
            if (this.model._esContrasenaSegura(nuevaContrasena)) {
                contrasenaValida = true;
            } else {
                this.showAlert("La contraseña no cumple con los requisitos de seguridad. Intente de nuevo.");
            }
        }

        let nuevaCategoria = this.getInput("Ingrese la categoría del nuevo usuario (Administrador, Cliente, Vendedor, Trabajador de depósito):");
        if (nuevaCategoria === null) {
            this.displayMessage("Creación de cuenta cancelada.");
            return;
        }
        if (nuevaCategoria.trim() === "") {
            this.displayMessage("Creación de cuenta cancelada. La categoría no puede estar vacía.");
            return;
        }

        const result = this.model.crearCuenta(nuevoUsuario, nuevaContrasena, nuevaCategoria);
        this.displayMessage(result.message);
    }

    async handleListArticles() {
        const result = this.model.listarArticulos();
        if (result.success) {
            if (result.articulos.length === 0) {
                this.displayMessage(result.message);
            } else {
                this.showAlert(result.formattedList);
                this.displayMessage("Listado de artículos mostrado.");
            }
        } else {
            this.displayMessage(result.message);
        }
    }

    async handleNewArticle() {
        const permisoCheck = this.model.verificarPermiso("nuevoArticulo");
        if (!permisoCheck.autorizado) {
            this.displayMessage(permisoCheck.message);
            return;
        }

        const idStr = this.getInput("Ingrese el ID del nuevo artículo:");
        if (idStr === null) { return; }
        const id = parseInt(idStr);

        const nombre = this.getInput("Ingrese el nombre del artículo:");
        if (nombre === null) { return; }

        const precioStr = this.getInput("Ingrese el precio del artículo:");
        if (precioStr === null) { return; }
        const precio = parseFloat(precioStr);

        const stockStr = this.getInput("Ingrese el stock inicial del artículo:");
        if (stockStr === null) { return; }
        const stock = parseInt(stockStr);

        const result = this.model.nuevoArticulo(id, nombre, precio, stock);
        this.displayMessage(result.message);
    }

    async handleEditArticle() {
        const permisoCheck = this.model.verificarPermiso("editarArticulo");
        if (!permisoCheck.autorizado) {
            this.displayMessage(permisoCheck.message);
            return;
        }

        const idEditarStr = this.getInput("Ingrese el ID del artículo a editar:");
        if (idEditarStr === null) { return; }
        const idEditar = parseInt(idEditarStr);

        if (isNaN(idEditar)) {
            this.displayMessage("ID inválido.");
            return;
        }

        const currentArticle = this.model.getArticuloById(idEditar);
        if (!currentArticle) {
            this.displayMessage(`No se encontró un artículo con ID ${idEditar}.`);
            return;
        }
        this.displayMessage(`Editando: ${currentArticle.nombre} (ID: ${currentArticle.id}).`);

        const nuevoNombre = this.getInput(`Nuevo nombre (actual: ${currentArticle.nombre}):`);
        const nuevoPrecioStr = this.getInput(`Nuevo precio (actual: ${currentArticle.precio}):`);
        const nuevoStockStr = this.getInput(`Nuevo stock (actual: ${currentArticle.stock}):`);

        const nuevoPrecio = nuevoPrecioStr !== null && nuevoPrecioStr.trim() !== '' ? parseFloat(nuevoPrecioStr) : null;
        const nuevoStock = nuevoStockStr !== null && nuevoStockStr.trim() !== '' ? parseInt(nuevoStockStr) : null;

        const result = this.model.editarArticulo(idEditar, nuevoNombre, nuevoPrecio, nuevoStock);
        this.displayMessage(result.message);
    }

    async handleDeleteArticle() {
        const permisoCheck = this.model.verificarPermiso("eliminarArticulo");
        if (!permisoCheck.autorizado) {
            this.displayMessage(permisoCheck.message);
            return;
        }

        const idEliminarStr = this.getInput("Ingrese el ID del artículo a eliminar:");
        if (idEliminarStr === null) { return; }
        const idEliminar = parseInt(idEliminarStr);

        if (isNaN(idEliminar)) {
            this.displayMessage("ID inválido.");
            return;
        }

        const articleToDelete = this.model.getArticuloById(idEliminar);
        if (!articleToDelete) {
            this.displayMessage(`No se encontró un artículo con ID ${idEliminar}.`);
            return;
        }

        const confirmacion = this.confirmAction(`¿Confirma eliminar el artículo '${articleToDelete.nombre}' (ID: ${idEliminar})?`);

        if (confirmacion) {
            const result = this.model.eliminarArticulo(idEliminar);
            this.displayMessage(result.message);
        } else {
            this.displayMessage("Eliminación cancelada.");
        }
    }

    async handleBuyArticle() {
        const permisoCheck = this.model.verificarPermiso("comprarArticulo");
        if (!permisoCheck.autorizado) {
            this.displayMessage(permisoCheck.message);
            return;
        }

        const idComprarStr = this.getInput("Ingrese el ID del artículo que desea comprar:");
        if (idComprarStr === null) { return; }
        const idComprar = parseInt(idComprarStr);

        if (isNaN(idComprar)) {
            this.displayMessage("ID inválido.");
            return;
        }

        const articleToBuy = this.model.getArticuloById(idComprar);
        if (!articleToBuy) {
            this.displayMessage(`No se encontró un artículo con ID ${idComprar}.`);
            return;
        }

        if (articleToBuy.stock === 0) {
            this.displayMessage(`El artículo '${articleToBuy.nombre}' no tiene stock disponible.`);
            return;
        }

        const cantidadComprarStr = this.getInput(`¿Cuántas unidades de '${articleToBuy.nombre}' desea comprar? (Stock actual: ${articleToBuy.stock})`);
        if (cantidadComprarStr === null) { return; }
        const cantidadComprar = parseInt(cantidadComprarStr);

        if (isNaN(cantidadComprar) || cantidadComprar <= 0 || cantidadComprar > articleToBuy.stock) {
            this.displayMessage("Cantidad a comprar inválida o excede el stock disponible.");
            return;
        }

        const confirmacion = this.confirmAction(`¿Confirma la compra de ${cantidadComprar} unidades de '${articleToBuy.nombre}' por un total de $${(articleToBuy.precio * cantidadComprar).toFixed(2)}?`);

        if (confirmacion) {
            const result = this.model.comprarArticulo(idComprar, cantidadComprar);
            this.displayMessage(result.message);
        } else {
            this.displayMessage("Compra cancelada.");
        }
    }

    async handleLogout() {
        const result = this.model.logout();
        this.displayMessage(result.message);
    }

    async start() {
        while (true) {
            const currentUser = this.model.getUsuarioActual();
            let option;

            if (!currentUser) {
                // Menú para usuario no logueado
                option = this.getInput(
                    "Menú Principal:\n" +
                    "1. Iniciar sesión\n" +
                    "2. Crear cuenta de usuario\n" +
                    "Ingrese el número de su opción (o 'cancelar' para salir):"
                );

                if (option === null || option.toLowerCase() === 'cancelar') {
                    this.displayMessage("Aplicación cerrada.");
                    break;
                }

                switch (option) {
                    case "1":
                        await this.handleLogin();
                        break;
                    case "2":
                        await this.handleCreateAccount();
                        break;
                    default:
                        this.displayMessage("Opción no válida. Por favor, elija 1 o 2.");
                }
            } else {
                option = this.getInput(
                    `Menú Principal (${currentUser.categoria}):\n` +
                    "1. Iniciar sesión (Ya iniciaste sesión)\n" +
                    "2. Crear cuenta de usuario\n" +
                    "------------------------------\n" +
                    "Gestión de Artículos:\n" +
                    "3. Listar artículos\n" +
                    "4. Nuevo artículo\n" +
                    "5. Editar artículo\n" +
                    "6. Eliminar artículo\n" +
                    "7. Comprar artículo\n" +
                    "8. Cerrar sesión\n" +
                    "Ingrese el número de su opción:"
                );

                if (option === null) {
                    this.displayMessage("Operación cancelada. El menú principal se mantendrá abierto.");
                    continue;
                }

                switch (option) {
                    case "1":
                        this.displayMessage(`Ya has iniciado sesión como ${currentUser.categoria}.`);
                        break;
                    case "2":
                        await this.handleCreateAccount();
                        break;
                    case "3":
                        await this.handleListArticles();
                        break;
                    case "4":
                        await this.handleNewArticle();
                        break;
                    case "5":
                        await this.handleEditArticle();
                        break;
                    case "6":
                        await this.handleDeleteArticle();
                        break;
                    case "7":
                        await this.handleBuyArticle();
                        break;
                    case "8":
                        await this.handleLogout();
                        break;
                    default:
                        this.displayMessage("Opción no válida. Por favor, elija un número del 1 al 8.");
                }
            }
        }
    }
}

export { ApplicationUI };
