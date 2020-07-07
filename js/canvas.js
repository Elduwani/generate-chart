const canvas = document.getElementById("canvas")
const cWidth = canvas.parentElement.offsetWidth
const cHeight = canvas.parentElement.offsetHeight
canvas.height = cHeight
canvas.width = cWidth

const c = canvas.getContext("2d")
const clr_dark_3 = "#22222c"
const clr_dark_4 = "#282a36"
const clr_dark_5 = "#343748"

const colors = ["#6151bb", "#67ba6d", "#f38181", "#8aacff", "#d7f096",]
let particlesArray = [], gravity = 1, friction = 0.005

class Particle {
    constructor(x, y, data) {
        this.x = x
        this.y = y
        this.dy = 1
        this.radius = 10
        this.to = y + randomIntFromRange(30, 80)
        this.data = data
        this.color = randomColor()
    }
    update() {
        if (this.y + this.dy > this.to) {
            this.dy = -this.dy
        } else this.dy += gravity

        this.y += this.dy * friction
        this.draw()
    }
    draw() {
        let { amount, isNull } = this.data

        c.beginPath()
        c.lineWidth = 1

        c.strokeStyle = isNull ? clr_dark_5 : this.color
        c.fillStyle = isNull ? clr_dark_4 : this.color
        c.arc(this.x, this.y, isNull ? this.radius / 1.5 : this.radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = this.color
        c.font = `11px Roboto, Montserrat, san-serif`;
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(
            !isNull ? String(amount.toLocaleString("en")) : "",
            this.x, this.y - (this.radius * 2)
        );

        c.stroke()
        c.closePath()
    }
}

export function chartInit(data) { // init()
    let { maxAmount, map } = data,
        radius = 8, count = map.size,
        size = Math.floor(canvas.width / count)

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
        let y = canvas.height - ((canvas.height / 100) * percent)
        if (isNull) y = y - radius

        //offset everything by 20 on the x
        x = x + 20
        // c.lineTo(x, y)
        const element = new Particle(x, y, { amount: value.total, isNull })
        particlesArray.push(element)
        i++
    })

    animate()
}

function animate() {
    // console.log(particlesArray)
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    particlesArray.forEach(particle => particle.update())
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

export function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
}
