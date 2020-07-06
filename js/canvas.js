const canvas = document.getElementById("canvas")
const cWidth = canvas.parentElement.offsetWidth
const cHeight = canvas.parentElement.offsetHeight
canvas.height = cHeight
canvas.width = cWidth

// console.log(cWidth, canvas.parentElement)
const c = canvas.getContext("2d")

const clr_dark_3 = "#22222c"
const clr_dark_4 = "#282a36"
const clr_dark_5 = "#343748"
const clr_dark_6 = "#9b9fab"

// // c.strokeRect(20, 20, 20, 20)

export function drawLineChart(data) {
    let { maxAmount, map } = data,
        count = map.size,
        size = Math.floor(cWidth / count),
        pointsArray = [],
        radius = 8

    displayGrid(data.yLength)

    c.beginPath()
    c.strokeStyle = clr_dark_5
    c.lineWidth = 2

    let i = 0; //Map.forEach doesn't provide the "index" argument
    data.map.forEach((value, key) => {
        let x = size * i, limit = 30,
            offset = i === 0 ? limit : 0,
            amount = value.total,
            percent = Math.trunc((amount / maxAmount) * 100),
            isNull = amount < 1

        /**
         * the [y] coord goes top (0) -> bottom (canvas height)
         * Reverse it so 0 is at the bottom by removing the height
        */
        let y = cHeight - ((cHeight / 100) * percent)
        if (isNull) y = y - radius

        x = x + offset
        c.lineTo(x, y)
        pointsArray.push({ x, y, amount: value.total, isNull })

        i++
    })

    c.stroke()
    c.closePath()

    //draw circles...
    pointsArray.forEach(point => {
        let { x, y, amount, isNull } = point
        // nextY = pointsArray[i + 1] ? pointsArray[i + 1].y : 0,
        // radius = 3 + (Math.random() * 8),

        c.beginPath()
        c.strokeStyle = isNull ? clr_dark_4 : clr_dark_5
        c.fillStyle = isNull ? clr_dark_3 : clr_dark_4
        c.arc(x, y, radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = "white"
        c.font = `11px Roboto, Montserrat, san-serif`;
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(
            !isNull ?
                String(amount.toLocaleString("en"))
                : ""
            ,
            x, y - 20
            // trendingUp ? p.y + offsetValue : p.y - offsetValue
        );

        c.stroke()
        c.closePath()
        // console.log(amount)
    })
}

//draw grid guides on the canvas
export function displayGrid(count = 10) {
    for (let i = 0; i <= count; i++) {
        c.lineWidth = 0.2
        c.strokeStyle = clr_dark_5
        let pointH = Math.floor(cHeight / count) * i

        /* vertical lines */
        // c.beginPath()
        // c.moveTo(pointV, 0)
        // c.lineTo(pointV, cHeight)
        // c.stroke()
        // c.closePath()

        /* horiontal lines */
        c.beginPath()
        c.moveTo(0, pointH)
        c.lineTo(cWidth, pointH)
        c.stroke()
        c.closePath()
    }
}
