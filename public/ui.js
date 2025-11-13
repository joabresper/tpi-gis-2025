export function generar_lista_capas(capas) {
  const contenedor = document.querySelector('.layers-panel ul');

  contenedor.innerHTML = ''; // limpia por las dudas

  Object.entries(capas).forEach(([nombre, layer]) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <input type="checkbox" id="${nombre}">
      <label for="${nombre}">${layer.get('title')}</label>
    `;

    contenedor.appendChild(li);
  });
};