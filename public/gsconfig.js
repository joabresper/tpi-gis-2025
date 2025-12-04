const config = window.GS_CONFIG || { 
    uri: 'http://localhost:8080/geoserver',
    workspaceUri: 'tpigis' // valor por defecto
};

const gs = {
  url: 'http://localhost:8080/geoserver/ows',
  wms: 'http://localhost:8080/geoserver/wms',
  wfs: 'http://localhost:8080/geoserver/wfs',
  workspace: config.workspace,
  uri: config.uri,
  geometryName: 'geom',
  srsName: 'EPSG:4326'
};

export default gs;
