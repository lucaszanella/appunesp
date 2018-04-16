const md5 = require("blueimp-md5");

export default randomColorPicker = string => randomColors[md5(string)[0]]; //TODO: update color picker function to be more light

const randomColors = {
    0: "#EF5350",
    1: "#EC407A",
    2: "#4A148C",
    3: "#7986CB",
    4: "#512DA8",
    5: "#009688",
    6: "#81C784",
    7: "#DCE775",
    8: "#FFA000",
    9: "#A1887F",
    a: "#FF8A65",
    b: "#B0BEC5",
    c: "#00B0FF",
    d: "#D1C4E9",
    e: "#C51162",
    f: "#E0F2F1",
}