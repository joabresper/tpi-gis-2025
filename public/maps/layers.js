import gs from "../gsconfig.js";

export const base_layer = new ol.layer.Tile({
	title: 'Base Layer',
	source: new ol.source.TileWMS({
		url: 'https://wms.ign.gob.ar/geoserver/ows',
		params: {
			'LAYERS': 'ign:provincia',
			'TILED': true
		}
	})
});

export const capas = {
  gs_agricultura: new ol.layer.Tile({
    title: 'Actividades Agropecuarias',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:actividades_agropecuarias` }
    })
  }),

  gs_actividades_economicas: new ol.layer.Tile({
    title: 'Actividades Económicas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:actividades_economicas` }
    })
  }),

  gs_complejo_energia: new ol.layer.Tile({
    title: 'Complejos de Energía',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:complejo_de_energia_ene` }
    })
  }),

  gs_cursos_agua: new ol.layer.Tile({
    title: 'Cursos de Agua',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:curso_de_agua_hid` }
    })
  }),

  gs_curvas_nivel: new ol.layer.Tile({
    title: 'Curvas de Nivel',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:curvas_de_nivel` }
    })
  }),

  gs_edif_turisticas: new ol.layer.Tile({
    title: 'Edificios/Construcciones Turísticas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edif_construcciones_turisticas` }
    })
  }),

  gs_edif_deporte: new ol.layer.Tile({
    title: 'Edificios Deportivos y Esparcimiento',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edif_depor_y_esparcimiento` }
    })
  }),

  gs_edif_educacion: new ol.layer.Tile({
    title: 'Edificios de Educación',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edif_educacion` }
    })
  }),

  gs_edif_publicos_ips: new ol.layer.Tile({
    title: 'Edificios Públicos (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edificio_publico_ips` }
    })
  }),

  gs_edif_salud_ips: new ol.layer.Tile({
    title: 'Edificios de Salud (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edificio_de_salud_ips` }
    })
  }),

  gs_edif_seguridad_ips: new ol.layer.Tile({
    title: 'Edificios de Seguridad (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edificio_de_seguridad_ips` }
    })
  }),

  gs_edif_religiosos: new ol.layer.Tile({
    title: 'Edificios Religiosos',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
          params: { 'LAYERS': `${gs.workspace}:edif_religiosos` }
    })
  }),

  gs_edif_ferroviarios: new ol.layer.Tile({
    title: 'Edificios Ferroviarios',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:edificios_ferroviarios` }
    })
  }),

  gs_ejido: new ol.layer.Tile({
    title: 'Ejido',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:ejido` }
    })
  }),

  gs_espejos_agua: new ol.layer.Tile({
    title: 'Espejos de Agua',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:espejo_de_agua_hid` }
    })
  }),

  gs_estructuras_portuarias: new ol.layer.Tile({
    title: 'Estructuras Portuarias',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:estructuras_portuarias` }
    })
  }),

  gs_infra_aero: new ol.layer.Tile({
    title: 'Infraestructura Aeroportuaria',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:infraestructura_aeroportuaria_punto` }
    })
  }),

  gs_infra_hidro: new ol.layer.Tile({
    title: 'Infraestructura Hidrológica',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:infraestructura_hidro` }
    })
  }),

  gs_islas: new ol.layer.Tile({
    title: 'Islas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:isla` }
    })
  }),

  gs_limites: new ol.layer.Tile({
    title: 'Límites Políticos Administrativos',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:limite_politico_administrativo_lim` }
    })
  }),

  gs_localidades: new ol.layer.Tile({
    title: 'Localidades',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:localidades` }
    })
  }),

  gs_lineas_energia: new ol.layer.Tile({
    title: 'Líneas de Conducción Energética',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:lineas_de_conduccion_ene` }
    })
  }),

  gs_marcas_senales: new ol.layer.Tile({
    title: 'Marcas y Señales',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:marcas_y_senales` }
    })
  }),

  gs_muros_embalses: new ol.layer.Tile({
    title: 'Muros y Embalses',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:muro_embalse` }
    })
  }),

  gs_obra_portuaria: new ol.layer.Tile({
    title: 'Obra Portuaria',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:obra_portuaria` }
    })
  })
};

