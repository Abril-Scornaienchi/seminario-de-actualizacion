class WCModalDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.modalEl = null;

    this.handleAccept = this.handleAccept.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  connectedCallback() {
    //crear los elementos
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    const closeBtn = document.createElement('span');
    const footer = document.createElement('div');
    const cancelBtn = document.createElement('button');
    const acceptBtn = document.createElement('button');
    const style = document.createElement('style');
    const slot = document.createElement('slot');

    //clases y contenido
    modal.className = 'modal';
    modalContent.className = 'modal-content';
    closeBtn.className = 'close';
    closeBtn.textContent = '×';
    footer.className = 'modal-footer';
    cancelBtn.textContent = 'Cancelar';
    acceptBtn.textContent = 'Aceptar';

    //CSS
    style.textContent = `
      .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
        animation: fadeIn 0.5s;
      }
      .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        animation-name: animatetop;
        animation-duration: 0.4s;
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
      }
      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      }
      .close:hover,
      .close:focus {
        color: black;
        text-decoration: none;
      }
      @keyframes fadeIn {
        from {opacity: 0}
        to {opacity: 1}
      }
      @keyframes animatetop {
        from {top: -300px; opacity: 0}
        to {top: 0; opacity: 1}
      }
    `;

    //estructura del DOM
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(slot);
    footer.appendChild(cancelBtn);
    footer.appendChild(acceptBtn);
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);

    //agregar al shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(modal);
    this.modalEl = modal;

    //event listeners
    closeBtn.addEventListener('click', this.handleClose);
    cancelBtn.addEventListener('click', this.handleClose);
    acceptBtn.addEventListener('click', this.handleAccept);
  }

  //manejo de eventos
  handleAccept() {
    this.dispatchEvent(new CustomEvent('modal-accepted', { bubbles: true, composed: true }));
    this.close();
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('modal-closed', { bubbles: true, composed: true }));
    this.close();
  }

  open() {
    if (this.modalEl) {
      this.modalEl.style.display = 'block';
      this.isOpen = true;
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
      this.isOpen = false;
    }
  }
}

customElements.define('wc-modal-dialog', WCModalDialog);