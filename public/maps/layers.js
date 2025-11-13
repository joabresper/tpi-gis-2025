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
      params: { 'LAYERS': `${gs.workspace}:Actividades_Agropecuarias` }
    })
  }),

  gs_actividades_economicas: new ol.layer.Tile({
    title: 'Actividades Económicas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Actividades_Economicas` }
    })
  }),

  gs_complejo_energia: new ol.layer.Tile({
    title: 'Complejos de Energía',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Complejo_de_Energia_Ene` }
    })
  }),

  gs_cursos_agua: new ol.layer.Tile({
    title: 'Cursos de Agua',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Curso_de_Agua_Hid` }
    })
  }),

  gs_curvas_nivel: new ol.layer.Tile({
    title: 'Curvas de Nivel',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Curvas_de_Nivel` }
    })
  }),

  gs_edif_turisticas: new ol.layer.Tile({
    title: 'Edificios/Construcciones Turísticas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edif_Construcciones_Turisticas` }
    })
  }),

  gs_edif_deporte: new ol.layer.Tile({
    title: 'Edificios Deportivos y Esparcimiento',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edif_Depor_y_Esparcimiento` }
    })
  }),

  gs_edif_educacion: new ol.layer.Tile({
    title: 'Edificios de Educación',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edif_Educacion` }
    })
  }),

  gs_edif_publicos_ips: new ol.layer.Tile({
    title: 'Edificios Públicos (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edificio_Publico_IPS` }
    })
  }),

  gs_edif_salud_ips: new ol.layer.Tile({
    title: 'Edificios de Salud (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edificio_de_Salud_IPS` }
    })
  }),

  gs_edif_seguridad_ips: new ol.layer.Tile({
    title: 'Edificios de Seguridad (IPS)',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edificio_de_Seguridad_IPS` }
    })
  }),

  gs_edif_religiosos: new ol.layer.Tile({
    title: 'Edificios Religiosos',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edificios_Religiosos` }
    })
  }),

  gs_edif_ferroviarios: new ol.layer.Tile({
    title: 'Edificios Ferroviarios',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Edificios_Ferroviarios` }
    })
  }),

  gs_ejido: new ol.layer.Tile({
    title: 'Ejido',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Ejido` }
    })
  }),

  gs_espejos_agua: new ol.layer.Tile({
    title: 'Espejos de Agua',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Espejo_de_Agua_Hid` }
    })
  }),

  gs_estructuras_portuarias: new ol.layer.Tile({
    title: 'Estructuras Portuarias',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Estructuras_portuarias` }
    })
  }),

  gs_infra_aero: new ol.layer.Tile({
    title: 'Infraestructura Aeroportuaria',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Infraestructura_Aeroportuaria_Punto` }
    })
  }),

  gs_infra_hidro: new ol.layer.Tile({
    title: 'Infraestructura Hidrológica',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Infraestructura_Hidro` }
    })
  }),

  gs_islas: new ol.layer.Tile({
    title: 'Islas',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Isla` }
    })
  }),

  gs_limites: new ol.layer.Tile({
    title: 'Límites Políticos Administrativos',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Limite_Politico_Administrativo_Lim` }
    })
  }),

  gs_localidades: new ol.layer.Tile({
    title: 'Localidades',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Localidades` }
    })
  }),

  gs_lineas_energia: new ol.layer.Tile({
    title: 'Líneas de Conducción Energética',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Lineas_de_Conduccion_Ene` }
    })
  }),

  gs_marcas_senales: new ol.layer.Tile({
    title: 'Marcas y Señales',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Marcas_y_Senales` }
    })
  }),

  gs_muros_embalses: new ol.layer.Tile({
    title: 'Muros y Embalses',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Muro_Embalse` }
    })
  }),

  gs_obra_portuaria: new ol.layer.Tile({
    title: 'Obra Portuaria',
    visible: false,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { 'LAYERS': `${gs.workspace}:Obra_Portuaria` }
    })
  })
};

