const data = {
  data2017: "https://opendata.arcgis.com/datasets/3d33a4f94a004fb5816936708642e045_0.geojson",
  data2018: "https://opendata.arcgis.com/datasets/58e6f399e0f04c568b3ba45086d15818_0.geojson",
  data2019: "https://opendata.arcgis.com/datasets/8cd15449ac344aa5a55be7840d67c52d_0.geojson",
  mapZoom: adjustZoom(),
  mapTiles: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  mapCenter: adjustCoordinates(),
  mapAttribution: `Stop Violence, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap </a>Created by <a href="http://michalmuszynski.com" target="_blank">Michal Muszynski </a> & OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`
}

function adjustZoom() {
  const windowWidth = window.innerWidth
  const widthThreshold = 768
  return windowWidth > widthThreshold ? 13 : 12
}

function adjustCoordinates() {
  const windowWidth = window.innerWidth
  const widthThreshold = 768
  return windowWidth > widthThreshold ? [44.93, -93.31] : [44.95, -93.30]
}

