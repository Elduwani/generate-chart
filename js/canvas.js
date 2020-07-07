const canvas = document.getElementById("canvas")
const cWidth = canvas.parentElement.offsetWidth
const cHeight = canvas.parentElement.offsetHeight
canvas.height = cHeight
canvas.width = cWidth

const c = canvas.getContext("2d")
const clr_dark_3 = "#22222c"
const clr_dark_4 = "#282a36"
const clr_dark_5 = "#343748"

const state = {
    colors: ["#6151bb", "#67ba6d", "#f38181", "#8aacff", "#d7f096"],
    particlesArray: [],
    friction: 0.005,
    gravity: 0.005
}

class Particle {
    constructor(x, y, data) {
        this.x = x
        this.y = y
        this.dy = 0.1
        this.radius = 8
        this.data = data
        this.origPos = { x, y }
        this.color = randomColor()
        this.to = y + randomIntFromRange(2, 15)
    }
    update(nextParticle) {
        if (this.y + this.dy > this.to || this.y + this.radius + this.dy > canvas.height) {
            this.dy = -this.dy
        } else this.dy += state.gravity

        this.y += this.dy
        // nextParticle && console.log(nextParticle.x)
        this.draw(nextParticle)
    }
    draw(nextParticle) {
        /**
         * Draw connecting line to next sibling
        */
        if (nextParticle) {
            const { x, y } = nextParticle

            c.beginPath()
            c.lineWidth = 2
            c.strokeStyle = clr_dark_4
            c.moveTo(this.x, this.y)
            c.lineTo(x, y)
            c.stroke()
            c.closePath()
        }

        let { amount, isNull } = this.data

        c.beginPath()
        c.lineWidth = 1

        isNull ? c.strokeStyle = clr_dark_5 : null
        c.fillStyle = isNull ? clr_dark_4 : this.color
        c.arc(this.x, this.y, isNull ? this.radius / 1.5 : this.radius, 0, Math.PI * 2, false)
        c.fill()

        c.fillStyle = this.color
        c.font = `11px Roboto, Montserrat, san-serif`;
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(
            !isNull ? String(amount.toLocaleString("en")) : "",
            this.x, this.y - (this.radius * 2.2)
        );

        isNull && c.stroke()
        c.closePath()
    }
}

export function chartInit(data) { // init()
    //reset state
    state.particlesArray = []

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
        state.particlesArray.push(element)
        i++
    })
}

animate()

/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

function animate() {
    // console.log(particlesArray)
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    state.particlesArray.forEach((particle, i, arr) => particle.update(arr[i + 1]))
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
    return state.colors[Math.floor(Math.random() * state.colors.length)]
}
