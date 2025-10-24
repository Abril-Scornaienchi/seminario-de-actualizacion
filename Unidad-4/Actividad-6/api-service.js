// api-service.js - Módulo de Servicio de Datos

export class UserService {
    // Definimos las URLs en un solo lugar.
    static BASE_URL = 'https://jsonplaceholder.typicode.com/users';

    /**
     * Obtiene la lista completa de usuarios.
     * @returns {Promise<Array>} Lista de usuarios.
     */
    static async fetchAllUsers() {
        try {
            const response = await fetch(UserService.BASE_URL);
            if (!response.ok) {
                // Lanzar un error específico si la respuesta HTTP no es 2xx
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            // Re-lanzar un error más amigable para la interfaz
            throw new Error(`Error al cargar la lista de usuarios: ${error.message}`);
        }
    }

    /**
     * Obtiene los detalles de un solo usuario.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Object>} Detalles del usuario.
     */
    static async fetchUserDetails(userId) {
        try {
            const response = await fetch(`${UserService.BASE_URL}/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error al cargar detalles del usuario ${userId}: ${error.message}`);
        }
    }
}