import { activar_desactivar_capa } from './maps/functions.js';
import { inicializar_boton_centrar } from './maps/functions.js';
import { base_map } from './maps/maps.js';
import { capas } from './maps/layers.js';
import { generar_lista_capas } from './ui.js';
import { escala } from './maps/controls.js';
import { inicializarHerramientas } from './maps/tools.js';

window.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Verificar que el elemento del mapa existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('ERROR: No se encontró el elemento #map en el DOM');
      return;
    }

    // 2. Verificar que el mapa se haya creado correctamente
    if (!base_map) {
      console.error('ERROR: base_map no está definido');
      return;
    }

    console.log('Mapa inicializado correctamente:', base_map);
    console.log('Capas cargadas:', Object.keys(capas).length);

    // 3. Agregar controles al mapa
    base_map.addControl(escala);

    // 4. Generacion dinamica de elementos
    generar_lista_capas(capas);
    inicializar_boton_centrar();

    // 5. Agregar listeners o inicializar herramientas
    activar_desactivar_capa(capas);
    inicializarHerramientas();
    
    console.log('Inicialización completada exitosamente');
  } catch (error) {
    console.error('ERROR durante la inicialización:', error);
    console.error('Stack trace:', error.stack);
  }
});