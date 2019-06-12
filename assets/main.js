const mapCenter = [44.95, -93.31]
const mapTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const mapZoom = 12

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
  const pointsFiltered = filterPrecinct(points)
  pointsFiltered.map(e => placeMarker(e.geometry.coordinates, e.properties))
}

function placeMarker(coordinates, properties) {
  const info = properties.Description
  const date = properties.ReportedDate
  const content = `<p>Description: ${info}</p><p>Date: ${date}</p>`
  if (coordinates.includes(null, 0)) {
    return null
  } else {
    L.marker([coordinates[1], coordinates[0]]).bindPopup(content).openPopup().addTo(myMap)
  }
}

function filterPrecinct(incidents) {
  const precinct = "05"
  const filtered = incidents.filter(i => i.properties.Precinct === precinct)
  return filtered
}

request().then(e => drawMarkers(e))