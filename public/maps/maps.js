import { base_layer, capas } from "./layers.js";

const base_map = new ol.Map({
	target: 'map',
	layers: [base_layer, ...Object.values(capas)],
	view: new ol.View({
		projection: 'EPSG:4326',
		center: [-59, -27.5],
		zoom: 4
	})
})

export const INITIAL_CENTER = base_map.getView().getCenter();
export const INITIAL_ZOOM = base_map.getView().getZoom();
export { base_map };

// Brujula

(function addCompassControl(map) {

  // Contenedor
  const compassDiv = document.createElement('div');
  compassDiv.className = 'ol-compass ol-unselectable ol-control';

  const arrowDiv = document.createElement('div');
  arrowDiv.className = 'ol-compass-arrow';
  arrowDiv.textContent = '▲';  // Flecha hacia el norte

  // Letra N
  const letterDiv = document.createElement('div');
  letterDiv.className = 'ol-compass-letter';
  letterDiv.textContent = 'N';

  compassDiv.appendChild(arrowDiv);
  compassDiv.appendChild(letterDiv);

  const compassControl = new ol.control.Control({
    element: compassDiv
  });

  // Posicionarlo arriba a la derecha
  compassDiv.classList.add('ol-compass-control');

  map.addControl(compassControl);

  const view = map.getView();
  view.on('change:rotation', () => {
    const rotation = view.getRotation() || 0;
    compassDiv.style.transform = `rotate(${rotation}rad)`;
  });

})(base_map);
