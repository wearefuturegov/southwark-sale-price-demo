const Vue = require('vue/dist/vue.js');
const L = require('leaflet');
const geoJSON = require('./southwark.json');

Vue.component('site-map', {
  data: function() {
    return {
      map: null,
      marker: null
    }
  },
  mounted: function() {
    this.map = L.map('map');

    const southwark = L.geoJSON(geoJSON, {
      coordsToLatLng: function(coords) {
        return new L.LatLng(coords[0], coords[1], coords[2]);
      }
    }).toMultiPoint().geometry.coordinates[0]
    
    const polygon = L.polygon([
      [
        [90, -180],
        [90, 180],
        [-90, 180],
        [-90, -180]
      ],
      southwark
    ]);
    
    polygon.addTo(this.map);
    this.map.fitBounds(L.polygon([southwark]).getBounds());
    
    const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
      minZoom: 12
    });
    
    basemap.addTo(this.map);
    
    this.map.on('click', this.addUpdateLatLng)
  },
  methods: {
    addUpdateLatLng: function(e) {
      if (this.marker != null) { this.map.removeLayer(this.marker); }
      this.marker = new L.marker(e.latlng, {draggable:'true'});
      this.$emit('update-latlng', [e.latlng.lat, e.latlng.lng]);
      this.marker.addTo(this.map);
    }
  },
  template: `<div class="govuk-form-group">
    <label class="govuk-label" for="map">
      Site location
    </label>
    <div id="map" style="width:500px; height: 450px"></div>
  </div>`
})