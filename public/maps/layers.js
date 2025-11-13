import gs from "../gsconfig.js";

export const ign_provincias = new ol.layer.Tile({
	title: 'Base Map',
	source: new ol.source.TileWMS({
		url: 'https://wms.ign.gob.ar/geoserver/ows',
		params: {
			'LAYERS': 'ign:provincia',
			'TILED': true
		}
	})
});

export const gs_agricultura = new ol.layer.Layer({
	
})