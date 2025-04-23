#include <iostream>
#include <string>
#include <vector>

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

int main() {
    string usuarioIng;
    string contrasenaIng;
    int intentosFallidos = 0;
    const int max_intentos = 3;
    Usuario usuarioActual;

    cout << "Bienvenido al sistema de ventas al por mayor." << endl;

    while (intentosFallidos < max_intentos) {
        cout << "Ingrese usuario: ";
        cin >> usuarioIng;

        cout << "Ingrese contraseña: ";
        cin >> contrasenaIng;

        if (verificar(usuarioIng, contrasenaIng, usuarioActual)) {
            cout << "Bienvenido " << usuarioActual.usuario << "!" << endl;
            break;
        } else {
            intentosFallidos++;
            cout << "Usuario y/o contraseña incorrecta." << endl;
            if (intentosFallidos == max_intentos) {
                cout << "Usuario bloqueado. Contacte al administrador." << endl;
                for (auto& u : usuarios) {
                    if (u.usuario == usuarioIng) {
                        u.bloqueado = true;
                        break;
                    }
                }
            }
        }
    }

    return 0;
}