const L = require('leaflet');
const $ = require('jquery');
const geoJSON = require('./southwark.json')

const map = L.map('map');
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

var marker;

polygon.addTo(map);
map.fitBounds(L.polygon([southwark]).getBounds());

const basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  minZoom: 11
});

basemap.addTo(map);

map.on('click', function(e) {
  if (marker != undefined) { map.removeLayer(marker); }
  marker = new L.marker(e.latlng, {draggable:'true'})
  $('#lat').val(e.latlng.lat);
  $('#lng').val(e.latlng.lng);
  marker.addTo(map);
})

$('#submit').click(function() {
  $('.fa-spinner').removeClass('govuk-visually-hidden')
  $.ajax({
    url: 'https://southwark-sale-price-viability.herokuapp.com/expected_range.json',
    type: 'GET',
    contentType: 'application/json',
    data: {
      lat: $('#lat').val(),
      lng: $('#lng').val(),
      sale_price: $('#price').val(),
      size: $('#size').val()
    },
    statusCode: {
      200: function(data) {
        $('.fa-spinner').addClass('govuk-visually-hidden')
        if (data.expected == true) {
          $('#form').addClass('govuk-visually-hidden')
          $('#error').addClass('govuk-visually-hidden')
          $('#success').removeClass('govuk-visually-hidden')
        } else {
          $('html, body').animate({ scrollTop: 0 });
          $('#error').removeClass('govuk-visually-hidden');
        }
      }
    },
    crossDomain: true
  });
})
