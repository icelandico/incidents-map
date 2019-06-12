const mapCenter = [44.95, -93.31]
const mapTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const mapZoom = 14
const fetchButton = document.getElementById("fetch")
const precinct = 5


const myMap = L.map("mapid").setView(mapCenter, mapZoom)

L.tileLayer(mapTiles, {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Stop Violence Uptown <> OpenStreetMap</a> contributors'
}).addTo(myMap)

const request = async () => {
  const response = await fetch('https://opendata.arcgis.com/datasets/58e6f399e0f04c568b3ba45086d15818_0.geojson')
    .then(res => res.json())
  return response
}

function drawMarkers(d) {
  const points = d.features
  points.map(e => placeMarker(e.geometry.coordinates))
}

function placeMarker(coordinates) {
  if (coordinates.includes(null, 0)) {
    return null
  } else {
    L.marker([coordinates[1], coordinates[0]]).addTo(myMap)
  }
}

request().then(e => drawMarkers(e))