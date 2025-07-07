// login-form.js

class LoginForm extends HTMLElement {
    constructor() {
        super();

        // 1. Crear los elementos del formulario de login
        // Basado en el ejemplo de W3Schools:
        // https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_examples_login&authuser=0

        // Contenedor principal del modal (oculto por defecto)
        this.modal = document.createElement('div');
        this.modal.classList.add('w3-modal'); // Clase de W3.CSS
        this.modal.style.display = 'none'; // Inicialmente oculto

        // Contenido del modal
        this.modalContent = document.createElement('div');
        this.modalContent.classList.add('w3-modal-content', 'w3-card-4', 'w3-animate-zoom'); // Clases de W3.CSS

        // Encabezado (para el botón de cerrar)
        this.modalHeader = document.createElement('div');
        this.modalHeader.classList.add('w3-container', 'w3-teal'); // Clases de W3.CSS

        this.closeButton = document.createElement('span');
        this.closeButton.classList.add('w3-button', 'w3-display-topright'); // Clases de W3.CSS
        this.closeButton.innerText = 'x'; // Texto del botón de cerrar

        // Título del modal
        this.modalTitle = document.createElement('h2');
        this.modalTitle.innerText = 'Login';

        // Contenedor del formulario
        this.formContainer = document.createElement('div');
        this.formContainer.classList.add('w3-container'); // Clase de W3.CSS

        // Formulario en sí
        this.form = document.createElement('form');
        this.form.classList.add('w3-container'); // Clase de W3.CSS
        // Evitar que el formulario se envíe realmente para este ejemplo
        this.form.onsubmit = (event) => event.preventDefault();

        // Input para el nombre de usuario
        this.labelUsername = document.createElement('label');
        this.labelUsername.innerText = 'Username';
        this.inputUsername = document.createElement('input');
        this.inputUsername.classList.add('w3-input', 'w3-border', 'w3-margin-bottom'); // Clases de W3.CSS
        this.inputUsername.type = 'text';
        this.inputUsername.placeholder = 'Enter Username';
        this.inputUsername.name = 'usrname';
        this.inputUsername.required = true;

        // Input para la contraseña
        this.labelPassword = document.createElement('label');
        this.labelPassword.innerText = 'Password';
        this.inputPassword = document.createElement('input');
        this.inputPassword.classList.add('w3-input', 'w3-border'); // Clases de W3.CSS
        this.inputPassword.type = 'password';
        this.inputPassword.placeholder = 'Enter Password';
        this.inputPassword.name = 'psw';
        this.inputPassword.required = true;

        // Botón de login
        this.loginButton = document.createElement('button');
        this.loginButton.classList.add('w3-button', 'w3-block', 'w3-green', 'w3-section', 'w3-padding'); // Clases de W3.CSS
        this.loginButton.type = 'submit'; // Para que funcione con el formulario
        this.loginButton.innerText = 'Login';

        // Checkbox "Remember me"
        this.rememberMeCheckbox = document.createElement('input');
        this.rememberMeCheckbox.type = 'checkbox';
        this.rememberMeCheckbox.checked = true; // Por defecto marcado
        this.rememberMeCheckbox.classList.add('w3-check', 'w3-margin-top'); // Clases de W3.CSS
        this.labelRememberMe = document.createElement('label');
        this.labelRememberMe.innerText = 'Remember me';
        this.rememberMeContainer = document.createElement('p'); // Usamos un <p> para agrupar

        // Contenedor del footer del modal (botón Cancelar y texto Forgot password)
        this.modalFooter = document.createElement('div');
        this.modalFooter.classList.add('w3-container', 'w3-border-top', 'w3-padding-16', 'w3-light-grey'); // Clases de W3.CSS

        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('w3-button', 'w3-red'); // Clases de W3.CSS
        this.cancelButton.type = 'button'; // No es un submit
        this.cancelButton.innerText = 'Cancel';

        this.forgotPasswordSpan = document.createElement('span');
        this.forgotPasswordSpan.classList.add('w3-right', 'w3-padding', 'w3-hide-small'); // Clases de W3.CSS
        this.forgotPasswordLink = document.createElement('a');
        this.forgotPasswordLink.href = '#'; // En un ejemplo real, apuntaría a una página
        this.forgotPasswordLink.innerText = 'Forgot password?';
    }

    // Métodos para controlar el modal
    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
        // Opcional: limpiar campos al cerrar
        this.inputUsername.value = '';
        this.inputPassword.value = '';
    }

    onLoginAttempt() {
        alert('Intento de Login:\nUsuario: ' + this.inputUsername.value + '\nContraseña: ' + this.inputPassword.value);
        this.hideModal(); // Cerrar el modal después del intento
    }

    connectedCallback() {
        // 2. Ensamblar la estructura en connectedCallback
        this.appendChild(this.modal); // Añadir el modal principal al componente

        this.modal.appendChild(this.modalContent);

        this.modalContent.appendChild(this.modalHeader);
        this.modalHeader.appendChild(this.closeButton);
        this.modalHeader.appendChild(this.modalTitle);

        this.modalContent.appendChild(this.formContainer);
        this.formContainer.appendChild(this.form);

        // Añadir elementos al formulario
        this.form.appendChild(this.labelUsername);
        this.form.appendChild(document.createElement('br')); // Salto de línea simple
        this.form.appendChild(this.inputUsername);
        this.form.appendChild(this.labelPassword);
        this.form.appendChild(document.createElement('br')); // Salto de línea simple
        this.form.appendChild(this.inputPassword);
        this.form.appendChild(this.loginButton);

        this.rememberMeContainer.appendChild(this.rememberMeCheckbox);
        this.rememberMeContainer.appendChild(this.labelRememberMe);
        this.form.appendChild(this.rememberMeContainer);

        this.modalContent.appendChild(this.modalFooter);
        this.modalFooter.appendChild(this.cancelButton);
        this.forgotPasswordSpan.appendChild(this.forgotPasswordLink);
        this.modalFooter.appendChild(this.forgotPasswordSpan);

        // 3. Asignar Event Listeners
        this.closeButton.onclick = this.hideModal.bind(this);
        this.cancelButton.onclick = this.hideModal.bind(this);
        this.loginButton.onclick = this.onLoginAttempt.bind(this);

        // Cerrar modal si se hace clic fuera del contenido
        this.modal.onclick = (event) => {
            if (event.target == this.modal) {
                this.hideModal();
            }
        };

        // Para propósito de demostración, añadimos un botón al DOM
        // que mostrará el modal. En una aplicación real, este botón
        // podría estar en otro componente o directamente en index.html.
        const showLoginBtn = document.createElement('button');
        showLoginBtn.classList.add('w3-button', 'w3-blue', 'w3-large', 'w3-margin-bottom');
        showLoginBtn.innerText = 'Mostrar Login';
        showLoginBtn.onclick = this.showModal.bind(this);
        this.appendChild(showLoginBtn); // Añadir el botón "Mostrar Login"
    }

    disconnectedCallback() {
        // Se ejecuta cuando el elemento es removido del DOM.
        // Vacío según la consigna.
    }

    // Los demás métodos deben estar presentes pero vacíos.
    adoptedCallback() {}
    connectedMoveCallback() {}
    static get observableAttributes() { return []; }
    attributeChangedCallback(attr, newvalue, oldvalue) {}
}

export { LoginForm };