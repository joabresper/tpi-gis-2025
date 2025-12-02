import gs from '../gsconfig.js'

/**
 * Empaqueta el feature en un XML y lo envía a GeoServer
 * @param {ol.Feature} feature - El punto dibujado
 */
export async function enviarTransaccionWFS(feature, layer) {
    
    // 1. Preparar el formato WFS
    const wfsFormat = new ol.format.WFS({ version: '1.0.0' });

    // Se clona el punto para invertir las coordenadas
    const featureClone = feature.clone();

    const geom = featureClone.getGeometry();
    geom.applyTransform((flatCoordinates, flatCoordinates2, stride) => {
        for (let j = 0; j < flatCoordinates.length; j += stride) {
            const y = flatCoordinates[j];
            const x = flatCoordinates[j + 1];
            flatCoordinates[j] = x;
            flatCoordinates[j + 1] = y;
        }
    });
    
    // 2. Generar el nodo XML de Transacción (Insert)
    // writeTransaction(inserts, updates, deletes, options)
    const node = wfsFormat.writeTransaction([featureClone], null, null, {
        featureNS: gs.uri,
        featurePrefix: gs.workspace,
        featureType: layer,
        srsName: gs.srsName,
        geometryName: 'geom'
    });

    // 3. Convertir el objeto DOM a String XML
    const serializer = new XMLSerializer();
    let xmlBody = serializer.serializeToString(node);

    const geometryColumnName = 'geom';

    xmlBody = xmlBody.replace(/<geometry>/g, `<${geometryColumnName}>`);
    xmlBody = xmlBody.replace(/<\/geometry>/g, `</${geometryColumnName}>`);

    // 4. Enviar a GeoServer (Fetch)
    const response = await fetch(gs.url, {
        method: 'POST',
        body: xmlBody,
        headers: {
            'Content-Type': 'text/xml'
        }
    });

    // 5. Validar la respuesta
    const textResponse = await response.text();

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${textResponse}`);
    }

    // GeoServer a veces devuelve 200 OK incluso si falló la inserción (ExceptionReport)
    if (textResponse.includes('ExceptionReport')) {
        throw new Error("GeoServer rechazó la transacción: " + textResponse);
    }
    
    return textResponse; // Éxito
}