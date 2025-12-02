// Mapeo de tipos de capa a iconos
const LAYER_ICONS = {
  PUNTO: '📍',
  LINEA: '〰️',
  POLIGONO: '⬛',
  BASE: '🗺️'
};

export function generar_lista_capas(capas) {
  const contenedor = document.querySelector('.layers-panel ul');

  contenedor.innerHTML = ''; // limpia la lista

  Object.entries(capas).forEach(([nombre, layer]) => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = 'checkbox';
    input.id = nombre;

    // Obtener el tipo de capa y su icono correspondiente
    const layerType = layer.get('type') || 'BASE';
    const icon = LAYER_ICONS[layerType] || '🗺️';

    // Crear el icono
    const iconSpan = document.createElement('span');
    iconSpan.className = 'layer-icon';
    iconSpan.textContent = icon;

    // Crear el texto
    const textSpan = document.createElement('span');
    textSpan.className = 'layer-text';
    textSpan.textContent = layer.get('title');

    label.appendChild(input);
    label.appendChild(iconSpan);
    label.appendChild(textSpan);

    li.appendChild(label);
    contenedor.appendChild(li);
  });
}