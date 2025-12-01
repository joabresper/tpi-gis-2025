import gs from "../gsconfig.js";
import { Z_INDEX_BASE } from "../const.js";

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
  gs_actividades_agropecuarias: new ol.layer.Tile({
    title: 'Actividades Agropecuarias',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:actividades_agropecuarias` }
    })
  }),

  gs_actividades_economicas: new ol.layer.Tile({
    title: 'Actividades Económicas',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:actividades_economicas` }
    })
  }),

  gs_complejo_de_energia_ene: new ol.layer.Tile({
    title: 'Complejos de Energía',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:complejo_de_energia_ene` }
    })
  }),

  gs_veg_cultivos: new ol.layer.Tile({
    title: 'Cultivos',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:veg_cultivos` }
    })
  }),

  gs_curso_de_agua_hid: new ol.layer.Tile({
    title: 'Cursos de Agua',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:curso_de_agua_hid` }
    })
  }),

  gs_curvas_de_nivel: new ol.layer.Tile({
    title: 'Curvas de Nivel',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:curvas_de_nivel` }
    })
  }),

  gs_edif_educacion: new ol.layer.Tile({
    title: 'Edificios de Educación',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edif_educacion` }
    })
  }),

  gs_edificio_de_salud_ips: new ol.layer.Tile({
    title: 'Edificios de Salud (IPS)',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edificio_de_salud_ips` }
    })
  }),

  gs_edificio_de_seguridad_ips: new ol.layer.Tile({
    title: 'Edificios de Seguridad (IPS)',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edificio_de_seguridad_ips` }
    })
  }),

  gs_edif_depor_y_esparcim: new ol.layer.Tile({
    title: 'Edificios Deportivos y Esparcimiento',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edif_depor_y_esparcimiento` }
    })
  }),

  gs_edificios_ferroviarios: new ol.layer.Tile({
    title: 'Edificios Ferroviarios',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edificios_ferroviarios` }
    })
  }),

  gs_edificio_publico_ips: new ol.layer.Tile({
    title: 'Edificios Públicos (IPS)',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edificio_publico_ips` }
    })
  }),

  gs_edif_religiosos: new ol.layer.Tile({
    title: 'Edificios Religiosos',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edif_religiosos` }
    })
  }),

  gs_edif_construcciones_turisticas: new ol.layer.Tile({
    title: 'Edificios/Construcciones Turísticas',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:edif_construcciones_turisticas` }
    })
  }),

  gs_ejido: new ol.layer.Tile({
    title: 'Ejido',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:ejido` }
    })
  }),

  gs_espejo_de_agua_hid: new ol.layer.Tile({
    title: 'Espejos de Agua',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:espejo_de_agua_hid` }
    })
  }),

  gs_estructuras_portuarias: new ol.layer.Tile({
    title: 'Estructuras Portuarias',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:estructuras_portuarias` }
    })
  }),

  gs_infraestructura_aeroportuaria_punto: new ol.layer.Tile({
    title: 'Infraestructura Aeroportuaria',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:infraestructura_aeroportuaria_punto` }
    })
  }),

  gs_infraestructura_hidro: new ol.layer.Tile({
    title: 'Infraestructura Hidrológica',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:infraestructura_hidro` }
    })
  }),

  gs_isla: new ol.layer.Tile({
    title: 'Islas',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:isla` }
    })
  }),

  gs_pais_lim: new ol.layer.Tile({
    title: 'Límites del País',
    visible: false,
    type: 'BASE',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:pais_lim` }
    })
  }),

  gs_limite_politico_administrativo_lim: new ol.layer.Tile({
    title: 'Límites Político-Administrativos',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:limite_politico_administrativo_lim` }
    })
  }),

  gs_lineas_de_conduccion_ene: new ol.layer.Tile({
    title: 'Líneas de Conducción Energética',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:lineas_de_conduccion_ene` }
    })
  }),

  gs_localidades: new ol.layer.Tile({
    title: 'Localidades',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:localidades` }
    })
  }),

  gs_marcas_y_senales: new ol.layer.Tile({
    title: 'Marcas y Señales',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:marcas_y_senales` }
    })
  }),

  gs_muro_embalse: new ol.layer.Tile({
    title: 'Muros y Embalses',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:muro_embalse` }
    })
  }),

  gs_obra_de_comunicacion: new ol.layer.Tile({
    title: 'Obra de Comunicación',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:obra_de_comunicación` }
    })
  }),

  gs_obra_portuaria: new ol.layer.Tile({
    title: 'Obra Portuaria',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:obra_portuaria` }
    })
  }),

  gs_otras_edificaciones: new ol.layer.Tile({
    title: 'Otras Edificaciones',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:otras_edificaciones` }
    })
  }),

  gs_provincias: new ol.layer.Tile({
    title: 'Provincias',
    visible: false,
    type: 'BASE',
    zIndex: -1,
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:provincias` }
    })
  }),

  gs_puente_red_vial_puntos: new ol.layer.Tile({
    title: 'Puentes Red Vial',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:puente_red_vial_puntos` }
    })
  }),

  gs_puntos_de_alturas_topograficas: new ol.layer.Tile({
    title: 'Puntos de Alturas Topográficas',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:puntos_de_alturas_topograficas` }
    })
  }),

  gs_puntos_del_terreno: new ol.layer.Tile({
    title: 'Puntos del Terreno',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:puntos_del_terreno` }
    })
  }),

  gs_red_ferroviaria: new ol.layer.Tile({
    title: 'Red Ferroviaria',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:red_ferroviaria` }
    })
  }),

  gs_red_vial: new ol.layer.Tile({
    title: 'Red Vial',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:red_vial` }
    })
  }),

  gs_salvado_de_obstaculo: new ol.layer.Tile({
    title: 'Salvado de Obstáculo',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:salvado_de_obstaculo` }
    })
  }),

  gs_senalizaciones: new ol.layer.Tile({
    title: 'Señalizaciones',
    visible: false,
    type: 'PUNTO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:senalizaciones` }
    })
  }),

  gs_sue_congelado: new ol.layer.Tile({
    title: 'Suelo Congelado',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:sue_congelado` }
    })
  }),

  gs_sue_consolidado: new ol.layer.Tile({
    title: 'Suelo Consolidado',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:sue_consolidado` }
    })
  }),

  gs_sue_costero: new ol.layer.Tile({
    title: 'Suelo Costero',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:sue_costero` }
    })
  }),

  gs_veg_suelo_desnudo: new ol.layer.Tile({
    title: 'Suelo Desnudo',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:veg_suelo_desnudo` }
    })
  }),

  gs_sue_hidromorfologico: new ol.layer.Tile({
    title: 'Suelo Hidromorfológico',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:sue_hidromorfologico` }
    })
  }),

  gs_sue_no_consolidado: new ol.layer.Tile({
    title: 'Suelo No Consolidado',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:sue_no_consolidado` }
    })
  }),

  gs_veg_arborea: new ol.layer.Tile({
    title: 'Vegetación Arbórea',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:veg_arborea` }
    })
  }),

  gs_veg_arbustiva: new ol.layer.Tile({
    title: 'Vegetación Arbustiva',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:veg_arbustiva` }
    })
  }),

  gs_veg_hidrofila: new ol.layer.Tile({
    title: 'Vegetación Hidrófila',
    visible: false,
    type: 'POLIGONO',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:veg_hidrofila` }
    })
  }),

  gs_vias_secundarias: new ol.layer.Tile({
    title: 'Vías Secundarias',
    visible: false,
    type: 'LINEA',
    zIndex: Z_INDEX_BASE[self.type],
    source: new ol.source.TileWMS({
      url: gs.url,
      params: { LAYERS: `${gs.workspace}:vias_secundarias` }
    })
  })
};