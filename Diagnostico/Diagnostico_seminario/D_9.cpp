#include <iostream>
#include <string>
#include <vector>
#include <regex>
#include <map>

using namespace std;

enum class Rol {
    Administrador,
    Cliente,
    Vendedor,
    TrabajadorDeposito
};

struct Usuario {
    string usuario;
    string contrasena;
    bool bloqueado;
    Rol rol;
};

struct Articulo {
    string nombre;
    double precio;
    int stock;
};

map<int, Articulo> articulos = {
    {1, {"Lavandina x 1L", 875.25, 3000}},
    {4, {"Detergente x 500mL", 1102.45, 2010}},
    {22, {"Jabon en polvo x 250g", 650.22, 407}}
};

vector<Usuario> usuarios = {
    {"admin", "Admin!1!", false, Rol::Administrador},
    {"cliente1", "Cliente!1!", false, Rol::Cliente},
    {"vendedor1", "Vendedor!1!", false, Rol::Vendedor},
    {"deposito1", "Deposito!1!", false, Rol::TrabajadorDeposito}
};

bool verificar(const string& usuarioIngresado, const string& contrasenaIngresada, Usuario& usuarioEncontrado, int &index) {
    for (int i = 0; i < usuarios.size(); i++) {
        if (usuarios[i].usuario == usuarioIngresado && usuarios[i].contrasena == contrasenaIngresada && !usuarios[i].bloqueado) {
            usuarioEncontrado = usuarios[i];
            index = i;
            return true;
        }
    }
    return false;
}

bool validarContrasena(const string& contrasena) {
    regex regex("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,16}$");
    return regex_match(contrasena, regex);
}

Usuario* usuarioActual = nullptr;

void iniciarSesion(vector<Usuario>& usuarios) {
    string usuarioIng;
    string contrasenaIng;
    int intentosFallidos = 0;
    const int max_intentos = 3;
    Usuario usuarioEncontrado;
    int index;

    while (intentosFallidos < max_intentos) {
        cout << "Ingrese usuario: ";
        cin >> usuarioIng;

        cout << "Ingrese contrasena: ";
        cin >> contrasenaIng;

        if (verificar(usuarioIng, contrasenaIng, usuarioEncontrado, index)) {
            cout << "Bienvenido " << usuarioEncontrado.usuario << "!" << endl;
            usuarioActual = &usuarios[index];
            return;
        } else {
            intentosFallidos++;
            cout << "Usuario y/o contrasena incorrecta." << endl;
            if (intentosFallidos == max_intentos) {
                cout << "Usuario bloqueado. Contacte al administrador." << endl;
                for (auto& usu : usuarios) {
                    if (usu.usuario == usuarioIng) {
                        usu.bloqueado = true;
                        break;
                    }
                }
            }
        }
    }
}

void crearCuenta(vector<Usuario>& usuarios) {
    string nuevoUsuario;
    string nuevaContrasena;
    bool contrasenaValida = false;
    int rolSeleccionado;

    cout << "Ingrese el nombre de usuario: ";
    cin >> nuevoUsuario;

    cout << "Seleccione el rol del usuario:" << endl;
    cout << "0. Administrador" << endl;
    cout << "1. Cliente" << endl;
    cout << "2. Vendedor" << endl;
    cout << "3. Trabajador de Depósito" << endl;
    cout << "Ingrese el número de rol: ";
    cin >> rolSeleccionado;

    Rol nuevoRol;
    switch (rolSeleccionado) {
        case 0: nuevoRol = Rol::Administrador; break;
        case 1: nuevoRol = Rol::Cliente; break;
        case 2: nuevoRol = Rol::Vendedor; break;
        case 3: nuevoRol = Rol::TrabajadorDeposito; break;
        default:
            cout << "Rol inválido. Se asignará rol de Cliente por defecto." << endl;
            nuevoRol = Rol::Cliente;
            break;
    }

    while (!contrasenaValida) {
        cout << "Ingrese la contrasena: ";
        cin >> nuevaContrasena;

        if (validarContrasena(nuevaContrasena)) {
            usuarios.push_back({nuevoUsuario, nuevaContrasena, false, nuevoRol});
            cout << "Cuenta creada exitosamente." << endl;
            contrasenaValida = true;
        } else {
            cout << "Contrasena invalida. Intente de nuevo." << endl;
        }
    }
}

void cambiarContrasena(Usuario& usuario) {
    string nuevaContrasena;
    bool contrasenaValida = false;

    while (!contrasenaValida) {
        cout << "Ingrese la nueva contrasena: ";
        cin >> nuevaContrasena;

        if (validarContrasena(nuevaContrasena)) {
            usuario.contrasena = nuevaContrasena;
            cout << "Contrasena cambiada exitosamente." << endl;
            contrasenaValida = true;
        } else {
            cout << "Contrasena invalida. Intente de nuevo." << endl;
        }
    }
}

void listarArticulos() {
    cout << "\nArticulos de Limpieza Disponibles:" << endl;
    for (const auto& par : articulos) {
        cout << "ID: " << par.first << endl;
        cout << "Nombre: " << par.second.nombre << endl;
        cout << "Precio: $" << par.second.precio << endl;
        cout << "Stock: " << par.second.stock << endl;
        cout << "--------------------" << endl;
    }
}

void nuevoArticulo() {
    Articulo nuevoArticulo;
    int nuevoId;

    cout << "Ingrese el ID del nuevo artículo: ";
    cin >> nuevoId;

    if (articulos.find(nuevoId) != articulos.end()) {
        cout << "Error: El ID del artículo ya existe." << endl;
        return;
    }

    cout << "Ingrese el nombre del artículo: ";
    cin.ignore();
    getline(cin, nuevoArticulo.nombre);

    cout << "Ingrese el precio del artículo: ";
    cin >> nuevoArticulo.precio;

    cout << "Ingrese el stock del artículo: ";
    cin >> nuevoArticulo.stock;

    articulos[nuevoId] = nuevoArticulo;
    cout << "Artículo agregado exitosamente." << endl;
}

void editarArticulo() {
    int idEditar;
    cout << "Ingrese el ID del artículo que desea editar: ";
    cin >> idEditar;

    if (articulos.find(idEditar) == articulos.end()) {
        cout << "Error: El ID del artículo no existe." << endl;
        return;
    }

    Articulo& articuloEditar = articulos[idEditar];

    cout << "Ingrese el nuevo nombre del artículo: ";
    cin.ignore();
    getline(cin, articuloEditar.nombre);

    cout << "Ingrese el nuevo precio del artículo: ";
    cin >> articuloEditar.precio;

    cout << "Ingrese el nuevo stock del artículo: ";
    cin >> articuloEditar.stock;

    cout << "Artículo editado exitosamente." << endl;
}

void eliminarArticulo() {
    int idEliminar;
    cout << "Ingrese el ID del artículo que desea eliminar: ";
    cin >> idEliminar;

    if (articulos.find(idEliminar) == articulos.end()) {
        cout << "Error: El ID del artículo no existe." << endl;
        return;
    }

    articulos.erase(idEliminar);
    cout << "Artículo eliminado exitosamente." << endl;
}

void comprarArticulo() {
    int idCompra;
    int cantidadCompra;

    cout << "Ingrese el ID del artículo que desea comprar: ";
    cin >> idCompra;

    auto it = articulos.find(idCompra);
    if (it == articulos.end()) {
        cout << "Error: El ID del artículo no existe." << endl;
        return;
    }

    if (it->second.stock <= 0) {
        cout << "Error: El artículo no tiene stock disponible." << endl;
        return;
    }

    cout << "Ingrese la cantidad que desea comprar: ";
    cin >> cantidadCompra;

    if (cantidadCompra <= 0) {
        cout << "Error: La cantidad debe ser mayor que cero." << endl;
        return;
    }

    if (cantidadCompra > it->second.stock) {
        cout << "Error: No hay suficiente stock disponible." << endl;
        cout << "Stock disponible: " << it->second.stock << endl;
        return;
    }

    cout << "¿Confirmar la compra de " << cantidadCompra << " unidades de \"" << it->second.nombre << "\" por un total de $" << it->second.precio * cantidadCompra << "? (s/n): ";
    char confirmacion;
    cin >> confirmacion;

    if (confirmacion == 's' || confirmacion == 'S') {
        it->second.stock -= cantidadCompra;
        cout << "Compra realizada exitosamente." << endl;
        cout << "Nuevo stock de \"" << it->second.nombre << "\": " << it->second.stock << endl;
    } else {
        cout << "Compra cancelada." << endl;
    }
}

int main() {
    int opcion;

    do {
        cout << "\nMenu Principal" << endl;
        cout << "1. Iniciar sesion" << endl;
        cout << "2. Crear cuenta de usuario" << endl;
        cout << "3. Cambiar contrasena" << endl;
        cout << "5. Comprar artículo" << endl;
        cout << "6. Listar artículos" << endl;
        cout << "7. Nuevo artículo" << endl;
        cout << "8. Editar artículo" << endl;
        cout << "9. Eliminar artículo" << endl;
        cout << "0. Salir" << endl;
        cout << "Seleccione una opcion: ";
        cin >> opcion;

        if (usuarioActual != nullptr) {
            switch (opcion) {
                case 1: // Iniciar sesión ya se realizó
                    cout << "Ya has iniciado sesión." << endl;
                    break;
                case 2:
                    cout << "Solo los administradores pueden crear cuentas." << endl;
                    break;
                case 3:
                    cambiarContrasena(*usuarioActual);
                    break;
                case 5:
                    if (usuarioActual->rol == Rol::Cliente || usuarioActual->rol == Rol::Vendedor) {
                        comprarArticulo();
                    } else {
                        cout << "Solo los clientes y vendedores pueden comprar artículos." << endl;
                    }
                    break;
                case 6:
                    listarArticulos();
                    break;
                case 7:
                    if (usuarioActual->rol == Rol::Administrador || usuarioActual->rol == Rol::TrabajadorDeposito) {
                        nuevoArticulo();
                    } else {
                        cout << "Solo los administradores y trabajadores de depósito pueden agregar nuevos artículos." << endl;
                    }
                    break;
                case 8:
                    if (usuarioActual->rol == Rol::Administrador || usuarioActual->rol == Rol::TrabajadorDeposito) {
                        editarArticulo();
                    } else {
                        cout << "Solo los administradores y trabajadores de depósito pueden editar artículos." << endl;
                    }
                    break;
                case 9:
                    if (usuarioActual->rol == Rol::Administrador) {
                        eliminarArticulo();
                    } else {
                        cout << "Solo los administradores pueden eliminar artículos." << endl;
                    }
                    break;
                case 0:
                    cout << "Saliendo del sistema." << endl;
                    break;
                default:
                    cout << "Opción invalida." << endl;
            }
        } else if (opcion == 1) {
            iniciarSesion(usuarios);
        } else if (opcion == 2) {
            crearCuenta(usuarios);
        } else if (opcion == 0) {
            cout << "Saliendo del sistema." << endl;
        } else {
            cout << "Debe iniciar sesión para realizar esta acción." << endl;
        }
    } while (opcion != 0);

    return 0;
}