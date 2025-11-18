import { base_map } from './maps.js';

// Capa vectorial para dibujar la línea de medición
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

// Variables para la interacción de medición
let measureInteraction = null;
let measureTooltip = null;
let measureOverlay = null;
let measureListener = null;

// Función para limpiar la medición anterior
function limpiarMedicion() {
  if (measureInteraction) {
    base_map.removeInteraction(measureInteraction);
    measureInteraction = null;
  }
  
  if (measureOverlay) {
    base_map.removeOverlay(measureOverlay);
    measureOverlay = null;
  }
  
  // Limpiar el listener de geometría si existe
  if (measureListener) {
    ol.Observable.unByKey(measureListener);
    measureListener = null;
  }
  
  measureTooltip = null;
  measureLayer.getSource().clear();
}

// Función para activar la herramienta de medir distancia
export function activarMedirDistancia() {
  // Limpiar cualquier medición anterior
  limpiarMedicion();
  
  // Crear la interacción de dibujo para líneas
  measureInteraction = new ol.interaction.Draw({
    source: measureLayer.getSource(),
    type: 'LineString'
  });
  
  // Crear overlay para mostrar la medida
  measureOverlay = new ol.Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
  });
  
  base_map.addOverlay(measureOverlay);
  
  let sketch;
  
  // Función para actualizar la medida en el tooltip
  function actualizarMedida(geometry) {
    if (!measureTooltip || !geometry) return;
    
    const length = ol.sphere.getLength(geometry, { projection: 'EPSG:4326' });
    const output = length > 1000 
      ? (length / 1000).toFixed(2) + ' km'
      : length.toFixed(2) + ' m';
    
    measureTooltip.innerHTML = output;
    
    // Actualizar la posición del tooltip al último punto de la línea
    const coordinates = geometry.getCoordinates();
    if (coordinates.length > 0) {
      const lastPoint = coordinates[coordinates.length - 1];
      measureOverlay.setPosition(lastPoint);
    }
  }
  
  // Cuando comienza el dibujo
  measureInteraction.on('drawstart', function(e) {
    sketch = e.feature;
    measureTooltip = document.createElement('div');
    measureTooltip.className = 'ol-tooltip ol-tooltip-measure';
    measureOverlay.setElement(measureTooltip);
    
    // Escuchar cambios en la geometría para actualizar en tiempo real
    const geometry = sketch.getGeometry();
    measureListener = geometry.on('change', function() {
      actualizarMedida(geometry);
    });
  });
  
  // Cuando termina el dibujo
  measureInteraction.on('drawend', function(e) {
    const geometry = e.feature.getGeometry();
    
    if (measureTooltip) {
      measureTooltip.className = 'ol-tooltip ol-tooltip-static';
      actualizarMedida(geometry);
      measureOverlay.setOffset([0, -7]);
    }
    
    // Remover el listener
    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }
    
    sketch = null;
  });
  
  // Si se cancela el dibujo
  measureInteraction.on('drawabort', function() {
    measureOverlay.setElement(null);
    measureTooltip = null;
    
    // Remover el listener si existe
    if (measureListener) {
      ol.Observable.unByKey(measureListener);
      measureListener = null;
    }
    
    sketch = null;
  });
  
  // Agregar la interacción al mapa
  base_map.addInteraction(measureInteraction);
}

// Función para inicializar el listener del botón
export function inicializarHerramientas() {
  const toolSelect = document.getElementById('tool-select');
  const applyButton = document.getElementById('apply-tool');
  
  if (!toolSelect || !applyButton) {
    console.error('Elementos de herramientas no encontrados');
    return;
  }
  
  applyButton.addEventListener('click', function() {
    const selectedTool = toolSelect.value;
    
    if (selectedTool === 'measure') {
      activarMedirDistancia();
    } else {
      // Si se selecciona otra herramienta, limpiar la medición
      limpiarMedicion();
    }
  });
  
  // También limpiar cuando se cambia la selección del dropdown
  toolSelect.addEventListener('change', function() {
    if (toolSelect.value !== 'measure') {
      limpiarMedicion();
    }
  });
}

