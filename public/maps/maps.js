import { ign_provincias } from "./layers.js";

export const base_map = new ol.Map({
	target: 'map',
	layers: [ign_provincias],
	view: new ol.View({
		projection: 'EPSG:4326',
		center: [-59, -27.5],
		zoom: 4
	})
})