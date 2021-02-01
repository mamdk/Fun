//If the "color" does not exist, it uses the random color
//If the "text" does not exist, it uses the index of item
//value required!
// 
// example:
const data = [{ value: 225, text: "test", color: "#900586" }];

function selectChart (name,data) {
    switch (name.toLowerCase()) {
        case "circle":
            new Circle(data);
            break;
        case "bar":
            new Rects(data);
            break;
        case "points":
            new Points(data);
            break;
        default:
            alert("value is not True!!!!!!");
            break;
    }
}

selectChart("circle",data);