#include <iostream>
#include <string>
#include <vector>
#include <regex>

using namespace std;

struct Usuario {
    string usuario;
    string contrasena;
    bool bloqueado;
};

vector<Usuario> usuarios = {
    {"luis", "luis2020", false},
};

bool verificar(const string& usuarioIngresado, const string& contrasenaIngresada, Usuario& usuarioEncontrado) {
    for (auto& usu : usuarios) {
        if (usu.usuario == usuarioIngresado && usu.contrasena == contrasenaIngresada && !usu.bloqueado) {
            usuarioEncontrado = usu;
            return true;
        }
    }
    return false;
}

bool validarContraseña(const string& contraseña) {
    regex regex("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,16}$");
    return regex_match(contraseña, regex);
}

void cambiarContrasena(Usuario& usuario) {
    string nuevaContrasena;
    bool contraseñaValida = false;

    while (!contraseñaValida) {
        cout << "Ingrese la nueva contrasena: ";
        cin >> nuevaContrasena;

        if (validarContraseña(nuevaContrasena)) {
            usuario.contrasena = nuevaContrasena;
            cout << "Contrasena cambiada exitosamente." << endl;
            contraseñaValida = true;
        } else {
            cout << "Contrasena invalida. Intente de nuevo." << endl;
        }
    }
}

int main() {
    string usuarioIng;
    string contrasenaIng;
    int intentosFallidos = 0;
    const int max_intentos = 3;
    Usuario usuarioActual;
    char opcion;

    cout << "Bienvenido al sistema de ventas al por mayor." << endl;

    while (intentosFallidos < max_intentos) {
        cout << "Ingrese usuario: ";
        cin >> usuarioIng;

        cout << "Ingrese contrasena: ";
        cin >> contrasenaIng;

        if (verificar(usuarioIng, contrasenaIng, usuarioActual)) {
            cout << "Bienvenido " << usuarioActual.usuario << "!" << endl;
            do {
                cout << "\nMenu" << endl;
                cout << "1. Cambiar contraseña" << endl;
                cout << "X. Salir" << endl;
                cout << "Seleccione una opcion: ";
                cin >> opcion;

                switch (opcion) {
                    case '1':
                        cambiarContrasena(usuarioActual);
                        break;
                    case 'X':
                    case 'x':
                        cout << "Saliendo del sistema." << endl;
                        break;
                }
            } while (opcion != 'X' && opcion != 'x');
            break;
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

    return 0;
}