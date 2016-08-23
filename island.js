var canvas = document.getElementById('island')
var ctx = canvas.getContext('2d')
ctx.font = '30px Georgia'

var points = [
  { x: 260, y: 100 },
  { x: 510, y: 533 },
  { x: 10, y: 533 }
]

 // draw the island
function island () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  ctx.lineTo(points[1].x, points[1].y)
  ctx.lineTo(points[2].x, points[2].y)
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = '#ddd'
  ctx.fill()
}

var clickedPoints = {
  'spotter': [],
  'surfer': []
}

canvas.addEventListener('click', function (ev) {
  let adding = document.getElementById('surfer').checked ? 'surfer' : 'spotter'

  var point = {x: ev.layerX, y: ev.layerY}
  island()

  let navPoints = adding === 'spotter' ? () => points : findClosestPointsOnSides

  clickedPoints[adding].forEach(function (p) {
    circle(p.x, p.y, '#eee')
    var distance = 0
    navPoints(p).forEach(function (tp) {
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(tp.x, tp.y)
      distance += distanceFormula(p, tp)
    })
    ctx.fillText(Math.round(distance), p.x + 5, p.y - 5)

    ctx.closePath()
    ctx.strokeStyle = '#eee'
    ctx.stroke()
  })

  ctx.beginPath()

  var distance = 0
  navPoints(point).forEach(function (tp) {
    ctx.moveTo(point.x, point.y)
    ctx.lineTo(tp.x, tp.y)
    distance += distanceFormula(point, tp)
  })
  ctx.closePath()
  ctx.strokeStyle = '#000'
  ctx.stroke()

  circle(point.x, point.y, '#000')
  ctx.fillText(Math.round(distance), point.x + 5, point.y - 5)

  clickedPoints[adding].push(point)
})

function findClosestPointsOnSides (p) {
  let dx = 0.866
  let dy = 1.5

  function update (op, x, y) {
    if (distanceFormula(op, p) > distanceFormula({x: x, y: y}, p)) {
      op.x = x
      op.y = y
    }
    return op
  }

  let p1 = {x: points[2].x, y: points[2].y}
  for (let x = p1.x, y = p1.y; x < points[0].x && y > points[0].y; x += dx, y -= dy) {
    p1 = update(p1, x, y)
  }

  let p2 = {x: points[2].x, y: points[2].y}
  for (let x = p2.x, y = p2.y; x < points[1].x; x += dx) {
    p2 = update(p2, x, y)
  }

  let p3 = {x: points[0].x, y: points[0].y}
  for (let x = p3.x, y = p3.y; x < points[1].x && y < points[1].y; x += dx, y += dy) {
    p3 = update(p3, x, y)
  }

  return [p1, p2, p3]
}

function distanceFormula (p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function circle (x, y, color) {
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

island()
