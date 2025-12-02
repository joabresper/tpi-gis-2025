import {base_map, INITIAL_CENTER, INITIAL_ZOOM} from './maps.js';
import { Z_INDEX_BASE } from '../const.js';
import { capas } from './layers.js';
import gs from '../gsconfig.js';

let globalCounter = 0;

export function activar_desactivar_capa(capas) {
	const check_boxes = document.querySelectorAll('.layers-panel input[type="checkbox"]');

	check_boxes.forEach((c) => {
		c.addEventListener('change', (e) => {
			const name = e.target.id;
			const layer = capas[name];
            const isChecked = e.target.checked;

			if (!layer) return;
            
            if (isChecked) {
                globalCounter ++;
                const newZIndex = Z_INDEX_BASE[layer.get('type')] + globalCounter;
                layer.setZIndex(newZIndex);

                layer.setVisible(true);
            } else {
                layer.setVisible(false);
            }

            // Logica del boton de leyenda
            // Buscamos el elemento padre <li> donde está este checkbox
            const liPadre = e.target.closest('li');
            
            // Definimos un ID único para este botón para poder encontrarlo luego
            const btnId = `btn-legend-${name}`;
            const botonExistente = document.getElementById(btnId);

            if (isChecked) {
                // SI ACTIVÓ LA CAPA Y EL BOTÓN NO EXISTE, LO CREAMOS
                if (!botonExistente) {
                    const btn = document.createElement('button');
                    btn.id = btnId;
                    btn.innerText = '📖 Ver Leyenda';
                    btn.className = 'btn-ver-leyenda'; // Clase del CSS
                    
                    // Al hacer click, llamamos a la función que muestra el cuadro flotante
                    btn.onclick = () => {
                        mostrarLeyenda(name, layer.get('title'));
                    };

                    // Lo insertamos dentro del LI, al final
                    liPadre.appendChild(btn);
                }
            } else {
                // SI DESACTIVÓ LA CAPA, BORRAMOS EL BOTÓN
                if (botonExistente) {
                    botonExistente.remove();
                }
                
                // Opcional: Si justo estábamos viendo ESA leyenda, cerrar el cuadro flotante
                const legendContainer = document.getElementById('legend-container');
                const legendTitle = document.getElementById('legend-title');
                
                // Si el cuadro está abierto Y el título coincide con esta capa... cerramos
                if (legendContainer.style.display !== 'none' && legendTitle.innerText === layer.get('title')) {
                    legendContainer.style.display = 'none';
                }
            }
            
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

// Función para mostrar la leyenda
export function mostrarLeyenda(layerKey, layerTitle) {
    const container = document.getElementById('legend-container');
    const img = document.getElementById('legend-image');
    const title = document.getElementById('legend-title');
    
    const layerObj = capas[layerKey];
    let layerName = ''
    
    if (!layerObj) return;

    // Extraemos el nombre de la capa de la fuente WMS
    // Esto saca "workspace:capa" de los params
    const source = layerObj.getSource();

    if (typeof source.getParams == 'function') {
        layerName = layerObj.getSource().getParams()['LAYERS'];
    } else {
        layerName = `${gs.workspace}:capa_usuario`;
    }
    

    // 3. CONSTRUIMOS LA URL DINÁMICA
    const legendUrl = `${gs.wms}?REQUEST=GetLegendGraphic` + 
                      `&VERSION=1.1.0` +
                      `&FORMAT=image/png` +
                      `&WIDTH=20&HEIGHT=20` + 
                      `&LAYER=${layerName}` +
                      `&LEGEND_OPTIONS=forceLabels:on`;

    // Actualizamos el DOM
    img.src = legendUrl;
    title.innerText = layerTitle || "Leyenda";
    container.style.display = 'block';
}

// Función para cerrar leyenda
window.cerrarLeyenda = function() {
    document.getElementById('legend-container').style.display = 'none';
}