import {base_map, INITIAL_CENTER, INITIAL_ZOOM} from './maps.js';
import { Z_INDEX_BASE } from '../const.js';

let globalCounter = 0;

export function activar_desactivar_capa(capas) {
	const check_boxes = document.querySelectorAll('.layers-panel input[type="checkbox"]');

	check_boxes.forEach((c) => {
		c.addEventListener('change', (e) => {
			const name = e.target.id;
			const layer = capas[name];

			if (!layer) return;

            globalCounter ++;
            const newZIndex = Z_INDEX_BASE[layer.get('type')] + globalCounter;
            layer.setZIndex(newZIndex);
            
			layer.setVisible(e.target.checked);
		});
	});
}

export function inicializar_boton_centrar() {
    // 1. Obtener una referencia al botón por su ID
    const botonCentrar = document.getElementById('btn-centrar');

    if (botonCentrar) {
        // 2. Agregar el escuchador de eventos 'click'
        botonCentrar.addEventListener('click', () => {
            // 3. Ejecutar la función de centrado con las variables importadas
            centrar_mapa_inicial(base_map, INITIAL_CENTER, INITIAL_ZOOM);
            
            // Opcional: Mostrar un mensaje en la consola
            console.log("Mapa centrado en:", INITIAL_CENTER);
        });
    } else {
        console.warn("El botón con ID 'btn-centrar' no fue encontrado en el DOM.");
    }
}

function centrar_mapa_inicial(base_map, INITIAL_CENTER, INITIAL_ZOOM) {
    if (!base_map) {
        console.error("El objeto 'mapa' de OpenLayers no está definido.");
        return;
    }

    // Accede a la vista del mapa
    const view = base_map.getView();

    // Usa la función 'animate' para una transición suave.
    view.animate({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        duration: 500 // 500ms para una animación suave
    });
}
