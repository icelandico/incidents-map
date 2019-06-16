const myMap = L.map("mapid").setView(data.mapCenter, data.mapZoom)
const layerGroup = L.layerGroup().addTo(myMap)

L.tileLayer(data.mapTiles, {
  maxZoom: 19,
  attribution: data.mapAttribution
}).addTo(myMap)

const mapSet = {
  data: "2019",
  layer: "markers"
}

const request = async () => {
  const data = determineData()
  const response = await fetch(data)
    .then(res => res.json())
    .catch(e => alert("Something went wrong with the data provider. Please try again to select the layer"))
  return response
}

function determineData() {
  const set = mapSet.data
  switch (set) {
    case "2017":
      return data.data2017
    case "2018":
      return data.data2018
    case "2019":
      return data.data2019
    default:
      return data.data2019
  }
}

function drawLayer(e) {
  const { layer } = mapSet
  switch (layer) {
    case "markers":
      drawMarkers(e)
      break;
    case "heatmap":
      drawHeatmap(e)
  }
}

function filterData(incidents) {
  const points = changeCase(incidents.features)
  const precinct = "5"
  const pointsFiltered = points.filter(i => i.properties.precinct !== null && i.properties.precinct.includes(precinct)) //i.properties.precinct.includes(precinct) ))
  return pointsFiltered
}

// Data from different time extent has different keys case in properties (i.e. ReportedDate vs reportedDate)
// Function is supposed to marge it into one standard format

function changeCase(array) {
  const incidents = array.map((p, i) => {
    const keys = Object.keys(p.properties)
    let idx = keys.length
    const newProps = {}
    while (idx--) {
      let key = keys[idx]
      newProps[key.toLowerCase()] = p.properties[key]
    }
    return { ...p, properties: newProps }
  })
  return incidents
}

function drawMarkers(d) {
  const pointsFiltered = filterData(d)
  layerGroup.clearLayers()
  pointsFiltered.map(e => placeMarker(e.geometry.coordinates, e.properties))
}

function drawHeatmap(d) {
  layerGroup.clearLayers()
  const pointsFiltered = filterData(d)
  const coordinatesOnly = pointsFiltered.map(el => [el.geometry.coordinates[1], el.geometry.coordinates[0]])
  generateHeatmap(coordinatesOnly)
}

function placeMarker(coordinates, properties) {
  const info = properties.description
  const date = formatDate(properties.reporteddate) || "Unknown"
  const content = `<p>Description: ${info}</p><p>Reported date: ${date}</p>`
  if (coordinates.includes(null, 0)) {
    return null
  } else {
    insertMarker(coordinates, content)
  }
}

function insertMarker(coordinates, content) {
  L.marker([coordinates[1], coordinates[0]]).bindPopup(content).openPopup().addTo(layerGroup)
}

// Return date in format { year, month, day } or YYYY-MM-DD
function formatDate(text) {
  const getDate = text.split("T")[0]
  // const date = getDate.split("-")
  return getDate//{ year: date[0], month: date[1], day: date[2] }
}


function generateHeatmap(data) {
  L.heatLayer(data, { radius: 20 }).addTo(layerGroup)
}

const layerInput = document.querySelectorAll("label.layer")
const yearInput = document.querySelectorAll("label.year")

layerInput.forEach(el => el.addEventListener("click", function () {
  mapSet.layer = el.getAttribute("for")
  request().then(e => drawLayer(e))
}))

yearInput.forEach(el => el.addEventListener("click", function () {
  mapSet.data = el.getAttribute("for")
  request().then(e => drawLayer(e))
}))

request().then(e => drawLayer(e))