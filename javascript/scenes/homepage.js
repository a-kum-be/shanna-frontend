
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
    }

    create(){
        this.categoryBar = this.createCategoryBar();
        this.toolBar = this.createToolBar();
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
    }

    update(){
        graphics.clear();
        lines.forEach(lineFam => {
            lineFam.forEach(line => {
                console.log(line.x1);

                graphics.strokeLineShape(line);
            });
        });
    }

    createCategoryBar(){
        // Setting location and drwaing style
        var rectangle =this.add.rectangle(
            (categoryBarStyle.x / 100) * window_config.width, 
            (categoryBarStyle.y / 100) * window_config.height, 
            (categoryBarStyle.width / 100 ) * window_config.width, 
            (categoryBarStyle.height / 100 ) * window_config.height, 
            categoryBarStyle.fillColor
            );
        rectangle.setStrokeStyle(4, categoryBarStyle.borderColor);

        // Set drawing point
        rectangle.setOrigin(categoryBarStyle.anchorX, categoryBarStyle.anchorY)

        return rectangle;
    }

    createToolBar() {
        // Setting location and drwaing style
        var rectangle =this.add.rectangle(
            (toolBarStyle.x / 100) * window_config.width, 
            (toolBarStyle.y / 100) * window_config.height, 
            (toolBarStyle.width / 100 ) * window_config.width, 
            (toolBarStyle.height / 100 ) * window_config.height, 
            toolBarStyle.fillColor
            );
        rectangle.setStrokeStyle(4, toolBarStyle.borderColor);
        
        // Set drawing point
        rectangle.setOrigin(toolBarStyle.anchorX, toolBarStyle.anchorY)

        return rectangle;
    }

    createTextArea(){
    //     var password = this.add.inputField(10, 90, {
    //         font: '18px Arial',
    //         fill: '#212121',
    //         fontWeight: 'bold',
    //         width: 150,
    //         padding: 8,
    //         borderWidth: 1,
    //         borderColor: '#000',
    //         borderRadius: 6,
    //         placeHolder: 'Password',
    //         type: PhaserInput.InputType.password
    //     });
    }

}