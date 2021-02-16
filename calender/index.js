const divYear = document.querySelector(".p_y");
const divMonth = document.querySelector(".p_m");
const divDay = document.querySelector(".p_d");
const ty = document.querySelector("#topYear");
const dy = document.querySelector("#downYear");
const tm = document.querySelector("#topMonth");
const dm = document.querySelector("#downMonth");
const td = document.querySelector("#topDay");
const dd = document.querySelector("#downDay");
const year = Number(new Date().getFullYear());
const rangeYear = 120;
let indexDay = 0, indexYear = year, indexMonth = 0;

const months = [{ name: "January", value: 1, days: 31 }, { name: "February", value: 2, days: 28 }, { name: "March", value: 3, days: 31 }, { name: "April", value: 4, days: 30 }, { name: "May", value: 5, days: 31 }, { name: "June", value: 6, days: 30 }, { name: "July", value: 7, days: 31 }, { name: "August", value: 8, days: 31 }, { name: "September", value: 9, days: 30 }, { name: "October", value: 10, days: 31 }, { name: "November", value: 11, days: 30 }, { name: "December", value: 12, days: 31 }];


function setIndex(index, f, count) {
    index += f % count;
    if (index >= count) return index - count;
    else if (index < 0) return index + count;
    return index;
}

function setIndexYear(index, f, start, end) {
    index += f;
    if (index > end) return start;
    else if (index < start) return end;
    return index;
}

function setPlace(i, index) {
    const place = (i - index + 1) * 50;

    if (i < index) return place + 10;
    else if (i > index) return place - 10;

    return place;
}

function setContent() {
    if (indexYear % 4 === 0) months.find(m => m.value === 2).days = 29;
    else months.find(m => m.value === 2).days = 28;

    divYear.innerHTML = divMonth.innerHTML = divDay.innerHTML = "";

    for (let i = year - rangeYear; i <= year; i++) {
        let p = document.createElement("p");
        let place = setPlace(i, indexYear);
        p.className = "items";
        p.innerText = i;
        p.style.top = place + "%";
        p.style.opacity = (place === 50) ? 1 : .25;
        divYear.appendChild(p);
    }
    for (let i = 0; i < months.length; i++) {
        let p = document.createElement("p");
        let place = setPlace(i, indexMonth);
        p.className = "items";
        p.innerText = months[i].name;
        p.style.top = place + "%";
        p.style.opacity = (place === 50) ? 1 : .25;
        divMonth.appendChild(p);
    }
    for (let i = 0; i < months[indexMonth].days; i++) {
        let p = document.createElement("p");
        let place = setPlace(i, indexDay);
        p.className = "items";
        p.innerText = i + 1;
        p.style.top = place + "%";
        p.style.opacity = (place === 50) ? 1 : .25;
        divDay.appendChild(p);
    }
}

setContent();

function res() {
    return { year: indexYear, month: { name: months[indexMonth].name, value: months[indexMonth].value }, day: (indexDay + 1) }
}

ty.onclick = () => {
    indexYear = setIndexYear(indexYear, -1, year - rangeYear
        , year);
    setContent()
}

dy.onclick = () => {
    indexYear = setIndexYear(indexYear, 1, year - rangeYear
        , year);
    setContent()
}

tm.onclick = () => {
    indexMonth = setIndex(indexMonth, -1, months.length);
    setContent()
}

dm.onclick = () => {
    indexMonth = setIndex(indexMonth, 1, months.length);
    setContent()
}

td.onclick = () => {
    indexDay = setIndex(indexDay, -1, months[indexMonth].days);
    setContent()
}

dd.onclick = () => {
    indexDay = setIndex(indexDay, 1, months[indexMonth].days);
    setContent()
}

//result button
// document.querySelector("#result").onclick = () => {
//     console.log(res());
//     return res();
// }