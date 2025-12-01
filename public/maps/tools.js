import { base_map } from './maps.js';
import gs from '../gsconfig.js';

// =========================
// CAPA Y LÓGICA DE MEDICIÓN
// =========================

const measureLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.7)'
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      })
    })
  })
});

base_map.addLayer(measureLayer);

let measureInteraction = null;
let measureTooltip = null;
let measureOverlay = null;
let measureListener = null;
let measureStaticOverlays = [];

function limpiarMedicion() {
  if (measureInteraction) {
    base_map.removeInteraction(measureInteraction);
    measureInteraction = null;
  }
  if (measureOverlay) {
    base_map.removeOverlay(measureOverlay);
    measureOverlay = null;
  }
  if (measureListener) {
    ol.Observable.unByKey(measureListener);
    measureListener = null;
  }

  // Limpiar tooltips estáticos (los de los vértices)
  measureStaticOverlays.forEach(overlay => base_map.removeOverlay(overlay));
  measureStaticOverlays = [];

  measureTooltip = null;
  measureLayer.getSource().clear();
}

export function activarMedirDistancia() {
  limpiarMedicion();

  measureInteraction = new ol.interaction.Draw({
    source: measureLayer.getSource(),
    type: 'LineString'
  });

  measureOverlay = new ol.Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
  });

  base_map.addOverlay(measureOverlay);

  let sketch;

  function actualizarMedida(geometry) {
    if (!measureTooltip || !geometry) return;

    const length = ol.sphere.getLength(geometry, { projection: 'EPSG:4326' });
    const output = length > 1000
      ? (length / 1000).toFixed(2) + ' km'
      : length.toFixed(2) + ' m';

    measureTooltip.innerHTML = output;

    const coordinates = geometry.getCoordinates();
    if (coordinates.length > 0) {
      const lastPoint = coordinates[coordinates.length - 1];
      measureOverlay.setPosition(lastPoint);
    }
  }

  measureInteraction.on('drawstart', e => {
    sketch = e.feature;
    measureTooltip = document.createElement('div');
    measureTooltip.className = 'ol-tooltip ol-tooltip-measure';
    measureOverlay.setElement(measureTooltip);

    let count = 0;

    const geometry = sketch.getGeometry();
    measureListener = geometry.on('change', evt => {
      const geom = evt.target;
      const coords = geom.getCoordinates();

      // Detectar si se agregó un nuevo vértice
      if (coords.length > count) {
        if (count > 0) {
          const index = coords.length - 2;
          if (index >= 0) {
            const point = coords[index];
            // Calcular distancia hasta ese punto
            const line = new ol.geom.LineString(coords.slice(0, index + 1));
            const length = ol.sphere.getLength(line, { projection: 'EPSG:4326' });

            const output = length > 1000
              ? (length / 1000).toFixed(2) + ' km'
              : length.toFixed(2) + ' m';

            const el = document.createElement('div');
            el.className = 'ol-tooltip ol-tooltip-static';
            el.innerHTML = output;

            const overlay = new ol.Overlay({
              element: el,
              position: point,
              positioning: 'bottom-center',
              offset: [0, -7]
            });
            base_map.addOverlay(overlay);
            measureStaticOverlays.push(overlay);
          }
        }
        count = coords.length;
      }
      actualizarMedida(geometry);
    });
  });

  measureInteraction.on('drawend', e => {
    const geometry = e.feature.getGeometry();

    if (measureTooltip) {
      measureTooltip.className = 'ol-tooltip ol-tooltip-static';
      actualizarMedida(geometry);
      measureOverlay.setOffset([0, -7]);
    }

    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }

    sketch = null;
  });

  measureInteraction.on('drawabort', () => {
    if (measureOverlay) {
      measureOverlay.setElement(null);
    }
    measureTooltip = null;

    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }

    sketch = null;
  });

  base_map.addInteraction(measureInteraction);
}

export function activarMedirArea() {
  limpiarMedicion();

  measureInteraction = new ol.interaction.Draw({
    source: measureLayer.getSource(),
    type: 'Polygon'
  });

  measureOverlay = new ol.Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
  });

  base_map.addOverlay(measureOverlay);

  let sketch;

  function actualizarArea(geometry) {
    if (!measureTooltip || !geometry) return;

    const area = ol.sphere.getArea(geometry, { projection: 'EPSG:4326' });
    let output;
    if (area > 1000000) {
      output = (area / 1000000).toFixed(2) + ' km²';
    } else {
      output = area.toFixed(2) + ' m²';
    }

    measureTooltip.innerHTML = output;

    const coordinates = geometry.getInteriorPoint().getCoordinates();
    measureOverlay.setPosition(coordinates);
  }

  measureInteraction.on('drawstart', e => {
    sketch = e.feature;
    measureTooltip = document.createElement('div');
    measureTooltip.className = 'ol-tooltip ol-tooltip-measure';
    measureOverlay.setElement(measureTooltip);

    const geometry = sketch.getGeometry();
    measureListener = geometry.on('change', () => {
      actualizarArea(geometry);
    });
  });

  measureInteraction.on('drawend', e => {
    const geometry = e.feature.getGeometry();

    if (measureTooltip) {
      measureTooltip.className = 'ol-tooltip ol-tooltip-static';
      actualizarArea(geometry);
      measureOverlay.setOffset([0, -7]);
    }

    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }

    sketch = null;
  });

  measureInteraction.on('drawabort', () => {
    if (measureOverlay) {
      measureOverlay.setElement(null);
    }
    measureTooltip = null;

    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }

    sketch = null;
  });

  base_map.addInteraction(measureInteraction);
}

// ============================
// CONSULTA GRÁFICA (PUNTO/BOX)
// ============================

let infoOverlay = null;
let infoElement = null;
let identifyClickKey = null;
let dragBoxInteraction = null;

function crearInfoOverlay() {
  if (!infoElement) {
    infoElement = document.createElement('div');
    infoElement.className = 'info-popup';
  }
  if (!infoOverlay) {
    infoOverlay = new ol.Overlay({
      element: infoElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: true
    });
    base_map.addOverlay(infoOverlay);
  }
}

function limpiarConsulta() {
  if (identifyClickKey) {
    ol.Observable.unByKey(identifyClickKey);
    identifyClickKey = null;
  }
  if (dragBoxInteraction) {
    base_map.removeInteraction(dragBoxInteraction);
    dragBoxInteraction = null;
  }
  if (infoOverlay) {
    base_map.removeOverlay(infoOverlay);
    infoOverlay = null;
    infoElement = null;
  }
  document.getElementById('popup-central').style.display = 'none';
}

function obtenerCapasWMSVisibles() {
  const visibles = [];

  base_map.getLayers().forEach(layer => {
    if (!(layer instanceof ol.layer.Tile)) return;
    if (!layer.getVisible || !layer.getVisible()) return;

    const source = layer.getSource && layer.getSource();
    if (!(source instanceof ol.source.TileWMS)) return;

    const params = source.getParams ? source.getParams() : null;
    if (!params || !params.LAYERS) return;

    // Solo capas de TU workspace (tpigis)
    if (!params.LAYERS.startsWith(`${gs.workspace}:`)) return;

    visibles.push(layer);
  });

  return visibles;
}

function mostrarResultadoPopup(features) {
  const popup = document.getElementById('popup-central');

  if (!features || features.length === 0) {
    popup.style.display = 'none';
    return;
  }

  const props = features[0].properties ?? features[0];

  // Campos a ocultar
  const HIDDEN_FIELDS = ['gid', 'geom', 'prov', 'prov_1', 'id', 'gid_1', 'igds_color', 'igds_level', 'igds_weigh', 'coord', 'group', 't_act', 'igds_type', 'signo'];

  const dataHtml = Object.entries(props)
    .filter(([k]) => !HIDDEN_FIELDS.includes(k))
    .map(([k, v]) => `<div><strong>${k}</strong>: ${v}</div>`)
    .join('');

  // HTML con botón de cierre
  popup.innerHTML = `
    <button class="popup-close-btn" onclick="document.getElementById('popup-central').style.display='none'">✕</button>
    <div class="popup-content">
      ${dataHtml}
    </div>
  `;

  popup.style.display = 'block';
}


function obtenerCapaYTablaActiva() {
  const capasVisibles = obtenerCapasWMSVisibles();
  if (capasVisibles.length === 0) return null;

  const layer = capasVisibles[0];
  const source = layer.getSource();
  const params = source.getParams();

  const fullName = params.LAYERS || '';
  const parts = fullName.split(':');
  const layerTable = parts.length === 2 ? parts[1] : fullName;

  return { layer, layerTable };
}



export function activarConsultaPunto() {
  limpiarConsulta();

  identifyClickKey = base_map.on('singleclick', async evt => {
    const coordinate = evt.coordinate;  // el mapa está en EPSG:4326
    const info = obtenerCapaYTablaActiva();
    if (!info) return;

    const { layer, layerTable } = info;

    const lon = coordinate[0];
    const lat = coordinate[1];

    try {
      const resp = await fetch('/api/query/point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layerTable,
          lon,
          lat,
          radius: 0.001 // aca se configura el radio al hacer la consulta por punto 0.001 = 111 metro
        })
      });

      const geojson = await resp.json();
      const features = geojson.features || [];
      mostrarResultadoPopup(features, coordinate);
      // Si después querés highlight, acá podés llamar a una función similar a resaltarFeaturesFromGeoJSON
    } catch (err) {
      console.error('Error consulta punto BDD:', err);
    }
  });
}


export function activarConsultaRectangulo() {
  limpiarConsulta();

  dragBoxInteraction = new ol.interaction.DragBox();
  base_map.addInteraction(dragBoxInteraction);

  dragBoxInteraction.on('boxend', async () => {
    const info = obtenerCapaYTablaActiva();
    if (!info) return;

    const { layer, layerTable } = info;

    const extent = dragBoxInteraction.getGeometry().getExtent();
    const [minx, miny, maxx, maxy] = extent;
    const center = ol.extent.getCenter(extent);

    try {
      const resp = await fetch('/api/query/rect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layerTable,
          minx,
          miny,
          maxx,
          maxy
        })
      });

      const geojson = await resp.json();
      const features = geojson.features || [];
      mostrarResultadoPopup(features, center);
    } catch (err) {
      console.error('Error consulta rectángulo BDD:', err);
    }
  });
}


// ===============================
// ALTA DE NUEVOS ELEMENTOS
// ===============================

const editLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.6)' }),
      stroke: new ol.style.Stroke({ color: '#003366', width: 2 })
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 153, 255, 0.8)',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 153, 255, 0.2)'
    })
  })
});

base_map.addLayer(editLayer);

let editDrawInteraction = null;

function limpiarEdicion() {
  if (editDrawInteraction) {
    base_map.removeInteraction(editDrawInteraction);
    editDrawInteraction = null;
  }
}

export function activarAgregarElemento() {
  limpiarEdicion();

  editDrawInteraction = new ol.interaction.Draw({
    source: editLayer.getSource(),
    type: 'Point'
  });

  editDrawInteraction.on('drawend', evt => {
    const feature = evt.feature;
    const nombre = window.prompt('Ingrese el nombre del elemento:', '');
    if (nombre) {
      feature.set('nombre', nombre);
    }
    console.log('Nuevo feature agregado:', feature.getGeometry().getCoordinates(), feature.getProperties());
  });

  base_map.addInteraction(editDrawInteraction);
}

// ===============================
// CONTROLES DE BOTONES EN EL MAPA
// ===============================

function desactivarTodasLasHerramientas() {
  limpiarMedicion();
  limpiarConsulta();
  limpiarEdicion();
}

export function inicializarHerramientas() {
  // contenedor de controles
  const container = document.createElement('div');
  container.className = 'ol-control ol-custom-tools';

  let btnTrash = null;

  function crearBoton(texto, titulo, onClick, esAccion = false, mostrarBasura = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = texto;
    button.title = titulo;
    button.className = 'ol-custom-tool-btn';

    button.addEventListener('click', () => {
      if (esAccion) {
        onClick();
        return; // No activamos la clase active-tool
      }

      const yaActivo = button.classList.contains('active-tool');

      // desactivo todo
      desactivarTodasLasHerramientas();
      document
        .querySelectorAll('.ol-custom-tool-btn.active-tool')
        .forEach(b => b.classList.remove('active-tool'));

      // si ya estaba activo, lo apago; si no, lo activo
      if (!yaActivo) {
        button.classList.add('active-tool');
        onClick();

        // Mostrar basura si la herramienta lo requiere
        if (btnTrash && mostrarBasura) {
          btnTrash.style.display = 'flex';
          // Posicionar al lado del botón activo
          // offsetTop nos da la posición relativa al contenedor padre (que tiene position: absolute)
          btnTrash.style.top = button.offsetTop + 'px';
        } else if (btnTrash) {
          btnTrash.style.display = 'none';
        }
      } else {
        // Si se desactiva, ocultar basura
        if (btnTrash) {
          btnTrash.style.display = 'none';
        }
      }
    });

    return button;
  }

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('is-open');
      // Cambiar icono del botón
      const btn = document.querySelector('.ol-custom-tool-btn[title="Mostrar/Ocultar capas"]');
      if (btn) {
        btn.innerHTML = sidebar.classList.contains('is-open') ? '✕' : '☰';
      }
    }
  }

  // Botón de basura (lo creamos antes para poder referenciarlo, pero lo añadimos al final)
  btnTrash = crearBoton('🗑️', 'Borrar mediciones', () => {
    limpiarMedicion();
  }, true);
  btnTrash.classList.add('btn-trash');
  // Aseguramos que empiece oculto
  btnTrash.style.display = 'none';

  //Burguer menu
  const btnBurger = crearBoton('☰', 'Mostrar/Ocultar capas', toggleSidebar, true, false);

  // Herramientas de medición (mostrarBasura = true)
  const btnMeasure = crearBoton('📏', 'Medir distancia', activarMedirDistancia, false, true);
  const btnMeasureArea = crearBoton('📐', 'Medir área', activarMedirArea, false, true);

  // Otras herramientas (mostrarBasura = false)
  const btnPoint = crearBoton('📍', 'Consulta por punto', activarConsultaPunto);
  const btnRect = crearBoton('▭', 'Consulta por rectángulo', activarConsultaRectangulo);
  const btnAdd = crearBoton('+', 'Agregar elemento', activarAgregarElemento);

  container.appendChild(btnBurger);
  container.appendChild(btnMeasure);
  container.appendChild(btnMeasureArea);
  container.appendChild(btnPoint);
  container.appendChild(btnRect);
  container.appendChild(btnAdd);
  container.appendChild(btnTrash);

  const control = new ol.control.Control({ element: container });
  base_map.addControl(control);
}