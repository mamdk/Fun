const rand = (l, h) => Math.floor(l + Math.random() * (h - l))
const randF = (l, h) => Number((l + Math.random() * (h - l)).toFixed(7))
const can = document.querySelector("#can");
let ctx = can.getContext("2d");
let w = can.width = window.innerWidth;
let h = can.height = window.innerHeight;
let docs = []
let lines = []
const radiusDocs = [2, 5];
const speedDocs = [-3, 3];
const widthLine = [1, 4];
const radiusSpace = 50;
const radiusLine = 100;
const opacityCan = .5   ;


function createDocs() {
    const numberDocs = Math.ceil(w / 10);
    docs = [];

    for (let i = 0; i < numberDocs; i++) {
        const x = rand(0, w);
        const y = rand(0, h);
        const r = rand(...radiusDocs);
        const sx = randF(...speedDocs);
        const sy = randF(...speedDocs);
        docs.push({ x, y, r, sx, sy })
    }
}

createDocs();

function updateDocs() {
    for (let d of docs) {
        d.x += d.sx;
        d.y += d.sy;

        if (d.x >= w - d.r || d.x <= d.r) d.sx = -d.sx;
        if (d.y >= h - d.r || d.y <= d.r) d.sy = -d.sy;
    }
}

function drawDocs() {
    for (let { x, y, r } of docs) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#aaa";
        ctx.fill();
        ctx.closePath();
    }
}

function createLine() {
    lines = [];
    for (let i = 0; i < docs.length; i++) {
        for (let j = i + 1; j < docs.length; j++) {
            const d1 = docs[i];
            const d2 = docs[j];

            const dx = d1.x - d2.x;
            const dy = d1.y - d2.y;

            const dix = Math.sqrt(dx ** 2 + dy ** 2);

            if (dix < radiusLine) {
                lines.push({ x1: d1.x, y1: d1.y, x2: d2.x, y2: d2.y });
            }
        }
    }
}


function drawLines() {
    for (const { x1, x2, y1, y2 } of lines) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = rand(...widthLine);
        ctx.strokeStyle = "rgba(225, 225, 225, .1)";
        ctx.stroke();
        ctx.closePath();
    }
}


ctx.globalAlpha = opacityCan;

can.onmousemove = (e) => {
    const x = e.pageX || e.clientX;
    const y = e.pageY || e.clientY;

    for (let d of docs) {
        let dx = x - d.x;
        let dy = y - d.y;

        let dix = Math.sqrt(dx ** 2 + dy ** 2);

        while (dix < radiusSpace) {
            if (dx > 0) {
                d.x += -10;
            } else {
                d.x += 10;

            }
            if (dy < 0) {
                d.y += 10
            } else {
                d.y += -10;
            }

            dx = x - d.x;
            dy = y - d.y;

            dix = Math.sqrt(dx ** 2 + dy ** 2);
        }
    }
}

window.onresize = (e) => {
    w = can.width = e.target.innerWidth || window.innerWidth;
    h = can.height = e.target.innerHeight || window.innerHeight;
    createDocs();
}

setInterval(() => {
    ctx.clearRect(0, 0, w, h);
    updateDocs();
    createLine();
    drawDocs();
    drawLines();
}, 50)
