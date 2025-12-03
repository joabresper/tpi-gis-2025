import { base_map } from './maps.js';
import gs from '../gsconfig.js';
import { capas } from './layers.js';
import { enviarTransaccionWFS } from './services.js';
import { activar_desactivar_capa } from './functions.js';
import { pedirNombrePunto } from '../ui.js';

// =========================
// CAPA Y LÓGICA DE MEDICIÓN
// =========================

const measureLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(4, 40, 91, 0.5)',
      //lineDash: [10, 10],
      width: 2.5
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

  //mostrar resultado de las mediciones
  function actualizarMedida(geometry) {
    if (!measureTooltip || !geometry) return;

    const length = ol.sphere.getLength(geometry, { projection: 'EPSG:4326' });
    //motrar en km o metros
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
let currentFeatures = [];
let currentFeatureIndex = 0;

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
  currentFeatures = [];
  currentFeatureIndex = 0;
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

  currentFeatures = features;
  currentFeatureIndex = 0;

  actualizarContenidoPopup(popup);

  // Resetear posición al centro
  popup.style.left = '50%';
  popup.style.top = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.display = 'block';

  // Configurar drag and drop
  makeDraggable(popup);
}

function actualizarContenidoPopup(popup) {
  if (currentFeatures.length === 0) return;

  const feature = currentFeatures[currentFeatureIndex];
  const props = feature.properties ?? feature;

  // Campos a ocultar completamente
  const HIDDEN_FIELDS = ['gid', 'geom', 'prov', 'prov_1', 'id', 'gid_1', 'igds_color', 'igds_level', 'igds_weigh', 'coord', 'group', 't_act', 'igds_type', 'signo'];

  // Campos principales a mostrar inicialmente
  const PRIMARY_FIELDS = ['ac', 'sp', 'tipo', 'cargo', 'datum', 'provincia'];

  // Filtrar todos los campos visibles
  const allFields = Object.entries(props)
    .filter(([k]) => !HIDDEN_FIELDS.includes(k));

  // Separar en campos principales y detalles
  const primaryFieldsData = allFields.filter(([k]) => PRIMARY_FIELDS.includes(k));
  const detailFieldsData = allFields.filter(([k]) => !PRIMARY_FIELDS.includes(k));

  // Generar HTML para campos principales
  const primaryHtml = primaryFieldsData
    .map(([k, v]) => `<div class="popup-field"><strong>${k}:</strong> ${v}</div>`)
    .join('');

  // Generar HTML para campos de detalles
  const detailHtml = detailFieldsData
    .map(([k, v]) => `<div class="popup-field"><strong>${k}:</strong> ${v}</div>`)
    .join('');

  // Navegación
  let navHtml = '';
  if (currentFeatures.length > 1) {
    navHtml = `
      <div class="popup-nav">
        <button onclick="prevFeature()" class="popup-prev-btn" ${currentFeatureIndex === 0 ? 'disabled' : ''}>&lt;</button>
        <span>${currentFeatureIndex + 1} de ${currentFeatures.length}</span>
        <button onclick="nextFeature()" class="popup-next-btn" ${currentFeatureIndex === currentFeatures.length - 1 ? 'disabled' : ''}>&gt;</button>
      </div>
    `;
  }

  // HTML completo
  popup.innerHTML = `
    <div class="popup-header" id="popup-header">
      <span class="popup-title">📍 Información del Elemento</span>
      <button class="popup-close-btn" onclick="document.getElementById('popup-central').style.display='none'">✕</button>
    </div>
    <div class="popup-content">
      ${navHtml}
      <div class="popup-primary">
        ${primaryHtml}
      </div>
      
      <div id="popup-details" class="popup-details" style="display: none;">
        ${detailHtml}
      </div>
      
      <button id="popup-toggle-btn" class="popup-toggle-btn" onclick="togglePopupDetails()">
        <span id="popup-toggle-icon">▼</span> Más Información
      </button>
    </div>
  `;

  // Re-aplicar drag and drop porque el header se recreó
  makeDraggable(popup);
}

// Funciones globales para navegación
window.prevFeature = function () {
  if (currentFeatureIndex > 0) {
    currentFeatureIndex--;
    actualizarContenidoPopup(document.getElementById('popup-central'));
  }
};

window.nextFeature = function () {
  if (currentFeatureIndex < currentFeatures.length - 1) {
    currentFeatureIndex++;
    actualizarContenidoPopup(document.getElementById('popup-central'));
  }
};

// Función para hacer el popup arrastrable
function makeDraggable(element) {
  const header = element.querySelector('#popup-header');

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;

  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    isDragging = true;

    // Cambiar a posicionamiento absoluto durante el arrastre
    const rect = element.getBoundingClientRect();
    element.style.left = rect.left + 'px';
    element.style.top = rect.top + 'px';
    element.style.transform = 'none';

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;

    // Cambiar cursor
    header.style.cursor = 'grabbing';
  }

  function elementDrag(e) {
    if (!isDragging) return;

    e.preventDefault();

    // Calcular nueva posición
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Calcular nueva posición del elemento
    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;

    // Limitar a los bordes de la ventana
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));

    element.style.top = newTop + 'px';
    element.style.left = newLeft + 'px';
  }

  function closeDragElement() {
    isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
    header.style.cursor = 'grab';
  }
}

// Función global para alternar la visibilidad de los detalles
window.togglePopupDetails = function () {
  const details = document.getElementById('popup-details');
  const btn = document.getElementById('popup-toggle-btn');
  const icon = document.getElementById('popup-toggle-icon');

  if (details.style.display === 'none') {
    details.style.display = 'block';
    icon.textContent = '▲';
    btn.innerHTML = `<span id="popup-toggle-icon">▲</span> Menos Información`;
  } else {
    details.style.display = 'none';
    icon.textContent = '▼';
    btn.innerHTML = `<span id="popup-toggle-icon">▼</span> Más Información`;
  }
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

// Función para mostrar alerta de no hay capa activa
function mostrarAlertaNoCapaActiva() {
  const alert = document.getElementById('alert-no-layer');
  if (alert) {
    alert.classList.add('show');
    // Ocultar después de 3 segundos
    setTimeout(() => {
      alert.classList.remove('show');
    }, 3000);
  }
}
export function activarConsultaPunto() {
  // Verificar si hay capas activas ANTES de limpiar
  const capasVisibles = obtenerCapasWMSVisibles();
  if (capasVisibles.length === 0) {
    mostrarAlertaNoCapaActiva();
    return; // Salir sin activar la herramienta
  }

  limpiarConsulta();

  identifyClickKey = base_map.on('singleclick', async evt => {
    const coordinate = evt.coordinate;
    const info = obtenerCapaYTablaActiva();
    if (!info) {
      mostrarAlertaNoCapaActiva();
      return;
    }

    const { layer, layerTable } = info;
    const lon = coordinate[0];
    const lat = coordinate[1];

    const view = base_map.getView();
    const resolution = view.getResolution();      // grados por píxel (EPSG:4326)

    const pixelTolerance = 5;
    let radius = resolution * pixelTolerance;     // grados ≈ pixelTolerance píxeles

    // Por seguridad, si algo raro pasa con la resolución, usamos un fallback
    if (!radius || radius <= 0) {
      radius = 0.02;
    }

    try {
      const resp = await fetch('/api/query/point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layerTable,
          lon,
          lat,
          radius
        })
      });

      const geojson = await resp.json();
      const features = geojson.features || [];
      mostrarResultadoPopup(features, coordinate);
    } catch (err) {
      console.error('Error consulta punto BDD:', err);
    }
  });
}

export function activarConsultaRectangulo() {
  // Verificar si hay capas activas ANTES de limpiar
  const capasVisibles = obtenerCapasWMSVisibles();
  if (capasVisibles.length === 0) {
    mostrarAlertaNoCapaActiva();
    return; // Salir sin activar la herramienta
  }

  limpiarConsulta();

  dragBoxInteraction = new ol.interaction.DragBox();
  base_map.addInteraction(dragBoxInteraction);

  dragBoxInteraction.on('boxend', async () => {
    const info = obtenerCapaYTablaActiva();
    if (!info) {
      mostrarAlertaNoCapaActiva();
      return;
    }

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
          maxy,
          limit: 50
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
let drawInteraction = null;

function limpiarEdicion() {
  if (drawInteraction) {
    base_map.removeInteraction(drawInteraction);
    drawInteraction = null;
  }
}

export function activarAgregarElemento(vectorSource, layer) {
  limpiarEdicion();

  drawInteraction = new ol.interaction.Draw({
    source: vectorSource,
    type: 'Point'
  });

  drawInteraction.on('drawend', async (evt) => {
    const feature = evt.feature;
    base_map.removeInteraction(drawInteraction);

    const nombre = await pedirNombrePunto();

    if (nombre) {
      feature.set('nombre', nombre);
      try {
        // C. ENVIAR A GEOSERVER (La parte que faltaba)
        console.log("Enviando a GeoServer...");
        await enviarTransaccionWFS(feature, layer);
        alert("✅ Punto guardado correctamente en la Base de Datos");
        vectorSource.refresh();

      } catch (error) {
        console.error("Error al guardar:", error);
        alert("❌ Error: " + error.message);
        // Si falló el guardado, borramos el punto del mapa para no confundir
        vectorSource.removeFeature(feature);
      }
    } else {
      vectorSource.removeFeature(feature);
    }
  });

  base_map.addInteraction(drawInteraction);
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
  const btnAdd = crearBoton('+', 'Agregar elemento', () => {
    const gsCapa = 'capa_usuario';

    const appCapa = capas['gs_' + gsCapa];

    if (!appCapa) {
      console.error("No se encontró la capa a editar");
      return;
    }
    const check = document.getElementById('gs_' + gsCapa);

    if (!appCapa.getVisible()) {
      appCapa.setVisible(true);

      if (check) {
        check.checked = true;
        check.dispatchEvent(new Event('change'));
      }
    }
    activarAgregarElemento(appCapa.getSource(), gsCapa);
  });

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