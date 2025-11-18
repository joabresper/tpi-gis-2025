import { activar_desactivar_capa } from './maps/functions.js';
import { base_map } from './maps/maps.js';
import { capas } from './maps/layers.js';
import { generar_lista_capas } from './ui.js';
import { escala } from './maps/controls.js';
import { inicializarHerramientas } from './maps/tools.js';

window.addEventListener('DOMContentLoaded', () => {
  // 1. Asegurarte de que el mapa se renderice
  console.log('Mapas listos:', base_map);

  // Agregar controles al mapa
  base_map.addControl(escala);

  // 2. Generacion dinamica de elementos
  generar_lista_capas(capas);

  // 3. Agregar listeners o inicializar herramientas
  activar_desactivar_capa(capas);
  inicializarHerramientas();
  
});