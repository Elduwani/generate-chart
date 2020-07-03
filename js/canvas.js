const canvas = document.getElementById("canvas")
const wrapper_node = document.querySelector(".wrapper")
const cSize = 700
canvas.height = cSize
canvas.width = cSize

const c = canvas.getContext("2d")

const clr_bgColor = "#54447b"
const clr_bgColor_light = "#695699"
const clr_green = "#49b47e"
const clr_green_2 = "#94dd4d"
const clr_yellow = "#ffd944"

// // c.strokeRect(20, 20, 20, 20)

displayGrid()
lines()

function lines() {
    let count = 10,
        size = Math.floor(cSize / count),
        pointsArray = []

    c.beginPath()
    c.strokeStyle = clr_yellow
    c.lineWidth = 1

    for (let i = 0; i <= count; i++) {
        let x = size * i,
            y = Math.floor(Math.random() * (cSize / 1.5)) + size,
            offset = i === 0 ? 10 : i === 10 ? -10 : 0

        x = x + offset
        c.lineTo(x, y)
        pointsArray.push({ x, y })
    }

    c.stroke()
    c.closePath()

    //draw circles...
    pointsArray.forEach(p => {
        const radius = 3 + (Math.random() * 10)
        const aboveMidpoint = p.y > cSize / 2

        c.beginPath()
        c.strokeStyle = clr_green
        c.fillStyle = aboveMidpoint ? clr_green : clr_bgColor
        c.arc(p.x, p.y, radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = "white"
        c.font = `10px Roboto, Montserrat, san-serif`;
        c.fillText(String(p.y), p.x, p.y - 20);

        c.stroke()
        c.closePath()
    })
}

//draw grid guides on the canvas
function displayGrid() {
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
