// All locations of the visual elements are in percentage

var categoryBarStyle = {
    x: 0,
    y: 0,
    width: 15,
    height: 100,
    fillColor: 0xFF6520,
    borderColor: NaN,
    anchorX: 0,
    anchorY: 0
}

var toolBarStyle ={
    x: 90,
    y: 10,
    width: 5,
    height: 45,
    fillColor: 0xFF6520,
    borderColor: NaN,
    anchorX: 0,
    anchorY: 0
}

var textAreaStyle = { 
    x: categoryBarStyle.width,
    y: 65,
    width: 85,
    height: 35,
    fillColor: 0x808080,
    borderColor: NaN,
    anchorX: 0,
    anchorY: 0,
    clickedColor: 0xffffff

}

var textStyle = {
    x: textAreaStyle.x + 2,
    y: textAreaStyle.y + 2,
    font: 'Arial',
    size: textAreaStyle/10,
    color: 0x332F2F,
    newLineSpacing: Math.floor()
}

var pencilStyle = { 
    x: toolBarStyle.x + toolBarStyle.width/2,
    y: toolBarStyle.y + 4,
    width: 5/2,
    height: 5/2,
    scaleX: 0.15,
    scaleY: 0.15,
    anchorX: 0.5,
    anchorY: 0.5
}