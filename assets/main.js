const mapCenter = [44.94, -93.31]
const myMap = L.map("mapid").setView(mapCenter, data.mapZoom)

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
  return response
}

function determineData() {
  const set = mapSet.data
  switch (set) {
    case "2018":
      return data.data2018
    case "2019":
      return data.data2019
    default:
      return data.data2018
  }
}

function drawMarkers(d) {
  const points = d.features
  const pointsFiltered = filterPrecinct(points)
  const coordinatesOnly = pointsFiltered.map(el => [el.geometry.coordinates[1], el.geometry.coordinates[0]])
  // generateHeatmap(coordinatesOnly)
  pointsFiltered.map(e => placeMarker(e.geometry.coordinates, e.properties))
}

function placeMarker(coordinates, properties) {
  const info = properties.Description
  const date = formatDate(properties.ReportedDate) || "Unknown"
  const content = `<p>Description: ${info}</p><p>Reported date: ${date}</p>`
  if (coordinates.includes(null, 0)) {
    return null
  } else {
    L.marker([coordinates[1], coordinates[0]]).bindPopup(content).openPopup().addTo(myMap)
  }
}

// Return date in format { year, month, day } or YYYY-MM-DD
function formatDate(text) {
  const getDate = text.split("T")[0]
  // const date = getDate.split("-")
  return getDate//{ year: date[0], month: date[1], day: date[2] }
}


function generateHeatmap(data) {
  L.heatLayer(data, { radius: 20 }).addTo(myMap)
}


function filterPrecinct(incidents) {
  const precinct = "5"
  const filtered = incidents.filter(i => i.properties.Precinct.includes("5"))
  return filtered
}

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
  }
  )
  return incidents
}

const input = document.querySelectorAll("label")

input.forEach(el => el.addEventListener("click", function () {
  console.log(el.getAttribute("for"))
}))

request().then(e => drawMarkers(e))