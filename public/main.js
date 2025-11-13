import { activar_desactivar_capa } from './maps/functions.js';
import { base_map } from './maps/maps.js';
import { capas } from './maps/layers.js';
import { generar_lista_capas } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
  // 1. Asegurarte de que el mapa se renderice
  console.log('Mapas listos:', base_map);

  // 2. Generacion dinamica de elementos
  generar_lista_capas(capas);

  // 3. Agregar listeners o inicializar herramientas
  activar_desactivar_capa(capas);
  
});