class Homepage extends Phaser.Scene{
    constructor(){
        super('homepage')
    }

    preload(){
        this.load.image('pencil', './images/pencil.png');
    }

    create(){
        this.categoryBar = this.createCategoryBar();
        this.toolBar = this.createToolBar();

        this.input.keyboard.on('keyup', this.anyKey, this);

        this.textArea = this.createTextArea();
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

    createToolBar(){
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
