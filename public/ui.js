export function generar_lista_capas(capas) {
  const contenedor = document.querySelector('#layers-list') || document.querySelector('.layers-panel ul');

  contenedor.innerHTML = ''; // limpia la lista

  Object.entries(capas).forEach(([nombre, layer]) => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = 'checkbox';
    input.id = nombre;

    label.appendChild(input);
    label.appendChild(document.createTextNode(layer.get('title')));

    li.appendChild(label);
    contenedor.appendChild(li);
  });
}

export function pedirNombrePunto() {
  return new Promise((resolve) => {
    const dialog = document.getElementById('modal-nombre');
    const input = document.getElementById('input-nombre-punto');
    
    // 1. Limpiamos el input anterior
    input.value = '';
    
    // 2. Mostramos el modal (esto bloquea el fondo y activa ESC para cerrar)
    dialog.showModal();
    input.focus(); // Ponemos el cursor listo para escribir

    // 3. Manejamos el cierre (Se dispara al pulsar ESC o botones del form)
    // El evento 'close' ocurre cuando el dialog se cierra por cualquier razón
    const alCerrar = () => {
      // returnValue es 'confirm' si dio al botón guardar, o vacio/cancel si dio ESC
      const motivo = dialog.returnValue; 
      
      if (motivo === 'confirm' && input.value.trim() !== '') {
        resolve(input.value.trim());
      } else {
        resolve(null); // Canceló o cerró con ESC
      }
      
      // Limpiamos el evento para no acumular listeners
      dialog.removeEventListener('close', alCerrar);
    };

    dialog.addEventListener('close', alCerrar);
    
    // Opcional: Manejo manual del Enter para asegurar el submit
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Evitar doble submit
        dialog.close('confirm'); // Cerramos manualmente enviando señal de éxito
      }
    };
  });
}