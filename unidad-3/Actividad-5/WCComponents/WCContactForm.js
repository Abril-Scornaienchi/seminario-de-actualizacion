class WCContactForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // crear los elementos
    const container = document.createElement('div');
    const form = document.createElement('form');
    const h3 = document.createElement('h3');
    const style = document.createElement('style');

    const elementsData = [
      { tag: 'label', textContent: 'Nombre Completo', for: 'fname', type: null },
      { tag: 'input', placeholder: 'Tu nombre...', type: 'text', name: 'firstname', id: 'fname' },
      { tag: 'label', textContent: 'Email', for: 'email', type: null },
      { tag: 'input', placeholder: 'Tu email...', type: 'email', name: 'email', id: 'email' },
      { tag: 'label', textContent: 'Asunto', for: 'subject', type: null },
      { tag: 'textarea', placeholder: 'Escribe tu mensaje...', name: 'subject', id: 'subject' }
    ];

    //clases y contenido
    container.className = 'container';
    h3.textContent = 'Formulario de Contacto';
    form.id = 'contact-form';

    //CSS
    style.textContent = `
      .container {
        padding: 16px;
      }
      input[type=text], input[type=email], textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        margin-top: 6px;
        margin-bottom: 16px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      textarea {
        height: 200px;
      }
    `;

    //formulario
    elementsData.forEach(elementData => {
      const element = document.createElement(elementData.tag);
      for (const key in elementData) {
        if (key !== 'tag') {
          element[key] = elementData[key];
        }
      }
      form.appendChild(element);
    });

    // unir
    container.appendChild(h3);
    container.appendChild(form);

    // 6. Agregar al shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

customElements.define('wc-contact-form', WCContactForm);