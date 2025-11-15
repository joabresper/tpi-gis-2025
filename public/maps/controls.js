export const escala = new ol.control.ScaleLine({
    units: 'metric',      // metric, imperial, degrees, us, nautical
    bar: true,           // true = barra, false = texto
    steps: 4,             // solo si bar = true
});
