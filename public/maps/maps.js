import { base_layer, capas } from "./layers.js";

export const base_map = new ol.Map({
	target: 'map',
	layers: [base_layer, ...Object.values(capas)],
	view: new ol.View({
		projection: 'EPSG:4326',
		center: [-59, -27.5],
		zoom: 4
	})
})