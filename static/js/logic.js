//   get data from  USGS GeoJSON 

var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  // id: "mapbox/streets-v11",mapbox://styles/mapbox/light-v10
  accessToken: API_KEY
}).addTo(myMap);



function getColor(d) {
  switch (true) {
    case d > 10:
      return "#3366ff";
    case d > 30:
      return "#6666ff";
    case d > 50:
      return "#9966ff";
    case d > 70:
      return "#cc33ff";
    case d > 90:
      return "#ff00ff";
    default:
      return "#cc0099";
  }
}

  d3.json(earthquakeurl).then(function (data) {

    console.log(data.features);

    // add each earthquake circles to map
    for (var i = 0; i < data.features.length; i++) {

      var earthquake = data.features[i];

      if (earthquake) {
        L.circleMarker(([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]), {
          fillOpacity: 0.8,
          color: "Red",
          weight: .75,
          fillColor: getColor(earthquake.geometry.coordinates[2]),
       
          radius: earthquake.properties.mag * 4

        }).bindPopup("<h4>Location: " + earthquake.properties.place + "</h4> <hr> <h5>Magnitude: " + earthquake.properties.mag + "  Depth: " + earthquake.geometry.coordinates[2] + " km</h5>").addTo(myMap);
      }
    }



    // Add legend

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = [-1, 10, 30, 50, 70, 90],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };

    legend.addTo(myMap);

  });