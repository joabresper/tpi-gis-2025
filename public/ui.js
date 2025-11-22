export function generar_lista_capas(capas) {
  const contenedor = document.querySelector('.layers-panel ul');

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