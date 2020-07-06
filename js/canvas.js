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

const colors = ["#6151bb", "#67ba6d", "#f38181", "#8aacff", "#d7f096",]

// // c.strokeRect(20, 20, 20, 20)
export function drawLineChart(data) {
    c.clearRect(0, 0, cWidth, cHeight)

    let { maxAmount, map } = data,
        count = map.size,
        size = Math.floor(cWidth / count),
        color = colors[0],
        pointsArray = [],
        radius = 8

    displayGrid(data.yLength)

    c.beginPath()
    c.strokeStyle = color
    c.lineWidth = 1

    let i = 0; //Map.forEach doesn't provide the "index" argument
    data.map.forEach(value => {
        let x = size * i,
            amount = value.total,
            percent = Math.trunc((amount / maxAmount) * 100),
            isNull = amount < 1

        /**
         * the [y] coord goes top (0) -> bottom (canvas height)
         * Reverse it so 0 is at the bottom by removing the height
        */
        let y = cHeight - ((cHeight / 100) * percent)
        if (isNull) y = y - radius

        //offset everything by 20 on the x
        x = x + 20
        c.lineTo(x, y)
        pointsArray.push({ x, y, amount: value.total, isNull })

        i++
    })

    c.stroke()
    c.closePath()

    //draw circles...
    pointsArray.forEach(point => {
        let { x, y, amount, isNull } = point

        c.beginPath()
        c.strokeStyle = isNull ? color : colors[3]
        c.fillStyle = isNull ? clr_dark_3 : colors[0]
        c.arc(x, y, isNull ? radius / 1.5 : radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = colors[4]
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

export function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}
