const myMap = L.map("mapid").setView([44.95, -93.31], 14)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Stop Violence Uptown <> OpenStreetMap</a> contributors'
}).addTo(myMap)