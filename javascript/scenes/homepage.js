
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var lines = [];
var graphics;

class Homepage extends Phaser.Scene{
    constructor(){
        super('homepage')
    }

    preload(){
        this.applicationLogo;
        this.graph = exampleGraph
        this.load.image('pencil', './images/pencil.png');
    }

    create(){
        this.categoryBar = this.createCategoryBar();
        this.toolBar = this.createToolBar();

        this.input.keyboard.on('keyup', this.anyKey, this);

        this.textArea = this.createTextArea();

        var circleColor = 0xffffff;

        var circleArr = [];
        graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xffffff } });

        fetch("http://54.74.246.181:8080/api/knowledge/getAll")
        .then(response => response.json())
        .then(graph => {
            graph.forEach(node => {
                var circle = this.add.circle(
                    getRandomArbitrary(this.categoryBar.x + this.categoryBar.width + 20, this.toolBar.x - 20),
                    getRandomArbitrary(20, window_config.height - 20),
                    20,
                    circleColor
                );
                circle.l1 = [];
                circle.l2 = [];
                circle.setInteractive();
                this.input.setDraggable(circle);
    
                circle.on('pointerover', function () {
                    circle.setFillStyle(0x44ff44, circle.fillAlpha);
                });
    
                circle.on('pointerout', function () {
                    circle.setFillStyle(circleColor);
                });
    
                circleArr[node.id] = circle;
                circle.on('drag', function() {
                    circle.l1.forEach(line => {
                        line.x1 = circle.x;
                        line.y1 = circle.y;
                    });
                    circle.l2.forEach(line => {
                        line.x2 = circle.x;
                        line.y2 = circle.y;
                    });
                });
            });
    
    
            graph.forEach(node => {
                node.pointedBy.forEach(parent => {
                    console.log("Drawing line");
                    var c1 = circleArr[node.id];
                    var c2 = circleArr[parent.id];
                    var line = new Phaser.Geom.Line(c1.x, c1.y, c2.x, c2.y);
                    graphics.strokeLineShape(line)
    
                    if(lines[node.id] == undefined) {
                        lines[node.id] = [];
                    }
                    if(lines[parent.id] == undefined) {
                        lines[parent.id] = [];
                    }
                    lines[node.id].push(line);
                    lines[parent.id].push(line);
    
                    c1.l1.push(line);
                    c2.l2.push(line);
                })
            })
        });
    
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.text = '';
        this.textGraphics = this.add.text(200, 200, this.text, {fontSize: '32px', fill: textStyle.color}).setFontSize(15);
        this.textGraphics.stroke =  textStyle.color;
        this.textGraphics.setVisible(false);
        this.lineSpacing = textStyle.newLineSpacing;
        this.renderText = this.add.renderTexture(0, 0, window_config.width, window_config.height);

        this.pencil = this.add.sprite((pencilStyle.x / 100) * window_config.width, (pencilStyle.y / 100) * window_config.height, 'pencil')
        this.pencil.setScale(pencilStyle.scaleX, pencilStyle.scaleYs)
        this.pencil.setOrigin(pencilStyle.anchorX, pencilStyle.anchorY)
    }

    update(){
        this.renderText.clear();
        this.textGraphics.setText(this.text)
        this.renderText.draw(this.textGraphics, (textStyle.x / 100 ) * window_config.width, (textStyle.y / 100 ) * window_config.height);
        graphics.clear();
        lines.forEach(lineFam => {
            lineFam.forEach(line => {
                console.log(line.x1);

                graphics.strokeLineShape(line);
            });
        });
    }

    anyKey(key){
        var _key = key.key;
        if(this.textArea.clicked){
            if(_key == "Shift" || _key == "Escape" || _key == "Backspace" || _key == "Control" ){
                if(_key == "Backspace"){
                    this.text = this.text.slice(0, -1);
                }
            }
            else{
                console.log(textStyle.newLineSpacing)
                this.text += _key;
                if(this.text.length > this.lineSpacing ){
                    this.text += '\n';
                    this.lineSpacing += textStyle.newLineSpacing
                }
            }
        }
 
        
    }

    createRectangle(x, y, width, height, fillColor, borderColor, anchorX, anchorY, ){
        // Setting location and drwaing style
        var rectangle =this.add.rectangle(x, y, width, height, fillColor);

        if(borderColor)
            rectangle.setStrokeStyle(4, borderColor);

        // Set drawing point
        rectangle.setOrigin(anchorX, anchorY)

        return rectangle;
    }

    createCategoryBar(){
        // Setting location and drwaing style
        var rectangle = this.createRectangle(
            (categoryBarStyle.x / 100) * window_config.width, 
            (categoryBarStyle.y / 100) * window_config.height, 
            (categoryBarStyle.width / 100 ) * window_config.width, 
            (categoryBarStyle.height / 100 ) * window_config.height, 
            categoryBarStyle.fillColor, 
            categoryBarStyle.borderColor,
            categoryBarStyle.anchorX,
            categoryBarStyle.anchorY
        );

        return rectangle;
    }

    createToolBar() {
        // Setting location and drwaing style
        var rectangle = this.createRectangle(
            (toolBarStyle.x / 100) * window_config.width, 
            (toolBarStyle.y / 100) * window_config.height, 
            (toolBarStyle.width / 100 ) * window_config.width, 
            (toolBarStyle.height / 100 ) * window_config.height, 
            toolBarStyle.fillColor, 
            toolBarStyle.borderColor,
            toolBarStyle.anchorX,
            toolBarStyle.anchorY
        );
        
        return rectangle;
    }

    createTextArea(){
        // Setting location and drwaing style
        var rectangle = this.createRectangle(
            (textAreaStyle.x / 100) * window_config.width, 
            (textAreaStyle.y / 100) * window_config.height, 
            (textAreaStyle.width / 100 ) * window_config.width, 
            (textAreaStyle.height / 100 ) * window_config.height, 
            textAreaStyle.fillColor, 
            textAreaStyle.borderColor,
            textAreaStyle.anchorX,
            textAreaStyle.anchorY
        );
        rectangle.clicked = false;
        
        rectangle.setInteractive();
        rectangle.on('pointerup', function(){
           if(rectangle.clicked){
                rectangle.fillColor = textAreaStyle.fillColor;
                rectangle.clicked = false;
           }
            else{
                rectangle.fillColor = textAreaStyle.clickedColor;
                rectangle.clicked=true;
            }
        })
    
        return rectangle;
    }
}
