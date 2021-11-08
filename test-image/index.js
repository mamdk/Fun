const _ = name => document.querySelector(name)
const rand = (l, h) => l + Math.random() * (h - l)

const image = _("img")
image.src += '?' + new Date().getTime()
const can = _("#can");
const ctx = can.getContext("2d");
const w = can.width = image.width;
const h = can.height = image.height;
// image.remove()
let dots = []
const r = 2
const s = [1, 3]
let click = false

function getDots() {
    const c = document.createElement("canvas")
    const ctx_ = c.getContext("2d");
    let arr = []

    c.width = w
    c.height = h

    ctx_.drawImage(image, 0, 0, w, h);
    let d = ctx_.getImageData(0, 0, w, h)

    for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
            const p = (y * w + x) * 4
            const avg = d.data.slice(p, p + 3).reduce((a, b) => a + b) / 3
            let color = 0;

            if (avg >= 50 && avg < 150) color = 100
            else if (avg >= 150 && avg <= 255) color = 200
            const radius = rand(10, 60)

            const deg = rand(0, 360)
            const rad = deg * Math.PI / 180

            const xx = Math.cos(rad) * radius + x
            const yy = Math.sin(rad) * radius + y

            const speed = rand(...s)

            const sx = (xx - x) / speed
            const sy = (yy - y) / speed

            arr.push({
                x,
                x_: x,
                y,
                y_: y,
                sx,
                sy,
                r: radius,
                color,
                animation: false
            })
        }
    }

    dots = arr
}

getDots()

function drawDots() {
    ctx.clearRect(0, 0, w, h);

    dots.forEach(({
        x_,
        y_,
        color: c,
    }, i) => {
        ctx.beginPath()
        ctx.fillStyle = `rgb(${c} , ${c} , ${c})`
        ctx.arc(x_, y_, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    })
}

drawDots()

function updateDots() {
    dots.forEach((d, i) => {
        if (d.animation) {
            d.x_ += d.sx
            d.y_ += d.sy

            // const dis = Math.sqrt((d.x - d.x_) ** 2 + (d.y - d.y_) ** 2)

            // if (dis >= d.r) {
            //     d.sx = -d.sx
            //     d.sy = -d.sy
            // } else if (dis <= 1) d.animation = false
        }
    })
}

setInterval(() => {
    drawDots()
    updateDots()
}, 20);


can.onmousedown = (e) => {
    click = true
}


can.onmouseup = (e) => {
    click = false
}

can.onmousemove = (e) => {
    if (click) {
        const xm = e.clientX || e.pageX
        const ym = e.clientY || e.pageY

        const rect = can.getBoundingClientRect()

        const x = xm - rect.x
        const y = ym - rect.y

        dots.forEach(d => {

            const dis = Math.sqrt((x - d.x) ** 2 + (y - d.y) ** 2)

            if (dis <= 20) {
                if (d.animation === false) d.animation = true
            }
        })

    }
}