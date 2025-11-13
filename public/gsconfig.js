const gs = {
  url: 'http://localhost:8080/geoserver',
  workspace: 'tpigis',
  wms: function() {	
    return `${this.url}/${this.workspace}/wms`;
  },
  wfs: function() {
    return `${this.url}/${this.workspace}/wfs`;
  }
};

export default gs;
