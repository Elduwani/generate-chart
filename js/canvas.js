const canvas = document.createElement("canvas")
const cSize = 700
canvas.height = cSize / 1.2
canvas.width = cSize

const c = canvas.getContext("2d")

const clr_bgColor = "#54447b"
const clr_bgColor_light = "#695699"
const clr_green = "#49b47e"
const clr_green_2 = "#94dd4d"
const clr_yellow = "#ffd944"

// // c.strokeRect(20, 20, 20, 20)

// displayGrid()
// drawChart()

export function drawLineChart() {
    let count = 10,
        size = Math.floor(cSize / count),
        pointsArray = []

    c.beginPath()
    c.strokeStyle = clr_yellow
    c.lineWidth = 1

    for (let i = 0; i <= count; i++) {
        let x = size * i,
            y = Math.floor(Math.random() * (cSize / 2)) + size,
            value = 30,
            offset = i === 0 ? value : i === 10 ? -value : 0

        x = x + offset
        c.lineTo(x, y)
        pointsArray.push({ x, y })
    }

    c.stroke()
    c.closePath()

    //draw circles...
    pointsArray.forEach((p, i) => {
        let offsetValue = 20,
            nextY = pointsArray[i + 1] ? pointsArray[i + 1].y : 0,
            // radius = 3 + (Math.random() * 8),
            radius = 8,
            trendingUp = p.y > nextY

        c.beginPath()
        c.strokeStyle = clr_green_2
        c.fillStyle = clr_bgColor
        c.arc(p.x, p.y, radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = "white"
        c.font = `11px Roboto, Montserrat, san-serif`;
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(
            String(cSize - p.y),
            p.x,
            trendingUp ? p.y + offsetValue : p.y - offsetValue
        );

        c.stroke()
        c.closePath()
    })
}

//draw grid guides on the canvas
export function displayGrid() {
    let count = 10

    for (let i = 0; i <= count; i++) {
        c.lineWidth = 0.5
        c.strokeStyle = clr_bgColor_light

        let pointV = Math.floor(cSize / count) * i
        let pointH = Math.floor(cSize / count) * i

        /* vertical lines */
        // c.beginPath()
        // c.moveTo(pointV, 0)
        // c.lineTo(pointV, cSize)
        // c.stroke()
        // c.closePath()

        /* horiontal lines */
        c.beginPath()
        c.moveTo(0, pointH)
        c.lineTo(cSize, pointH)
        c.stroke()
        c.closePath()
    }
}
