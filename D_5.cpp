#include <iostream>
#include <string>
#include <vector>
#include <regex>
#include <map> // Incluimos la librería map

using namespace std;

struct Usuario {
    string usuario;
    string contrasena;
    bool bloqueado;
};

// Estructura para almacenar información de los artículos de limpieza
struct Articulo {
    string nombre;
    double precio;
    int stock;
};

// Utilizamos un mapa para almacenar los artículos de limpieza, con el ID como clave
map<int, Articulo> articulos = {
    {1, {"Lavandina x 1L", 875.25, 3000}},
    {4, {"Detergente x 500mL", 1102.45, 2010}},
    {22, {"Jabon en polvo x 250g", 650.22, 407}}
};

vector<Usuario> usuarios = {
    {"luis", "Contrasena!1!", false},
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

Usuario* usuarioActual = nullptr; // Puntero a Usuario

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
            usuarioActual = &usuarios[index]; // Correcto
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

    cout << "Ingrese el nombre de usuario: ";
    cin >> nuevoUsuario;

    while (!contrasenaValida) {
        cout << "Ingrese la contrasena: ";
        cin >> nuevaContrasena;

        if (validarContrasena(nuevaContrasena)) {
            usuarios.push_back({nuevoUsuario, nuevaContrasena, false});
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

void mostrarArticulos() {
    cout << "\nArticulos de Limpieza Disponibles:" << endl;
    for (const auto& par : articulos) {
        cout << "ID: " << par.first << endl;
        cout << "Nombre: " << par.second.nombre << endl;
        cout << "Precio: $" << par.second.precio << endl;
        cout << "Stock: " << par.second.stock << endl;
        cout << "--------------------" << endl;
    }
}

int main() {
    int opcion;

    do {
        cout << "\nMenu Principal" << endl;
        cout << "1. Iniciar sesion" << endl;
        cout << "2. Crear cuenta de usuario" << endl;
        cout << "3. Cambiar contrasena" << endl;
        cout << "4. Mostrar articulos de limpieza" << endl; // Nueva opción
        cout << "0. Salir" << endl;
        cout << "Seleccione una opcion: ";
        cin >> opcion;

        switch (opcion) {
            case 1:
                iniciarSesion(usuarios);
                break;
            case 2:
                crearCuenta(usuarios);
                break;
            case 3:
                if (usuarioActual != nullptr) {
                    cambiarContrasena(*usuarioActual);
                } else {
                    cout << "Debe iniciar sesión primero." << endl;
                }
                break;
            case 4: // Nueva opción
                mostrarArticulos();
                break;
            case 0:
                cout << "Saliendo del sistema." << endl;
                break;
            default:
                cout << "Opción invalida." << endl;
        }
    } while (opcion != 0);

    return 0;
}