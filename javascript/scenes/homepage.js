class Homepage extends Phaser.Scene{
    constructor(){
        super('homepage')
    }

    preload(){
        this.applicationLogo;
    }

    create(){
        this.categoryBar = this.createCategoryBar();
        this.toolBar = this.createToolBar();
        this.textArea = this.createTextArea();
    }

    update(){
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

    createToolBar(){
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