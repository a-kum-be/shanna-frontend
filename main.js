//
//  main.js
//
//  A project template for using arbor.js
//


(function($){
    var nodeStyle = {
        fillStyle: "#FF0000",
        font:"25px Arial",
        fontSize: 25,
        padding: 10,
        textColor: "#00ff00"
    }

    // in percentage
    var screenPadding = {
        top: 5,
        right: 15,
        bottom: 40,
        left: 8
    }


    var DrawArrow = function(arrow_ctx, fromx, fromy, tox, toy, arrowWidth, color){
        //variables to be used when creating the arrow
        var headlen = 60;
        var angle = Math.atan2(toy-fromy,tox-fromx);
     
        arrow_ctx.save();
        arrow_ctx.strokeStyle = color;
     
        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        arrow_ctx.beginPath();
        arrow_ctx.moveTo(fromx, fromy);
        arrow_ctx.lineTo(tox, toy);
        arrow_ctx.lineWidth = arrowWidth;
        arrow_ctx.stroke();
     
        //starting a new path from the head of the arrow to one of the sides of
        //the point
        arrow_ctx.beginPath();
        arrow_ctx.moveTo(tox, toy);
        arrow_ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/12),
                   toy-headlen*Math.sin(angle-Math.PI/12));
     
        //path from the side point of the arrow, to the other side point
        arrow_ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/12),
                   toy-headlen*Math.sin(angle+Math.PI/12));
     
        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        arrow_ctx.lineTo(tox, toy);
        arrow_ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/12),
                   toy-headlen*Math.sin(angle-Math.PI/12));
     
        //draws the paths created above
        arrow_ctx.stroke();
        arrow_ctx.restore();
    }

    var DrawRoundedRectangle = function (rounded_ctx, x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        rounded_ctx.beginPath();
        rounded_ctx.moveTo(x + radius, y);
        rounded_ctx.arcTo(x + width, y, x + width, y + height, radius);
        rounded_ctx.arcTo(x + width, y + height, x, y + height, radius);
        rounded_ctx.arcTo(x, y + height, x, y, radius);
        rounded_ctx.arcTo(x, y, x + width, y, radius);
        rounded_ctx.fill()
        rounded_ctx.closePath();
        return rounded_ctx;
    }

    var Renderer = function(canvas){
      var canvas = $(canvas).get(0)
      var ctx = canvas.getContext("2d");
      var particleSystem
  
      var that = {
        init:function(system){
            //
            // the particle system will call the init function once, right before the
            // first frame is to be drawn. it's a good place to set up the canvas and
            // to pass the canvas size to the particle system
            //
            // save a reference to the particle system for use in the .redraw() loop
            particleSystem = system
    
            // inform the system of the screen dimensions so it can map coords for us.
            // if the canvas is ever resized, screenSize should be called again with
            // the new dimensions
            particleSystem.screenSize(canvas.width, canvas.height) 
            particleSystem.screenPadding(
                screenPadding.top / 100 * canvas.height,
                screenPadding.right / 100 * canvas.width,
                screenPadding.bottom / 100* canvas.height,
                screenPadding.left / 100 * canvas.width
            ) // leave an extra 80px of whitespace per side
          
          // set up some event handlers to allow for node-dragging
          that.initMouseHandling()
        },
        
        redraw:function(){
            // 
            // redraw will be called repeatedly during the run whenever the node positions
            // change. the new positions for the nodes can be accessed by looking at the
            // .p attribute of a given node. however the p.x & p.y values are in the coordinates
            // of the particle system rather than the screen. you can either map them to
            // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
            // which allow you to step through the actual node objects but also pass an
            // x,y point in the screen's coordinate system
            // 
            ctx.fillStyle = "white"
            ctx.fillRect(0,0, canvas.width, canvas.height)
            
            particleSystem.eachEdge(function(edge, pt1, pt2){
                // edge: {source:Node, target:Node, length:#, data:{}}
                // pt1:  {x:#, y:#}  source position in screen coords
                // pt2:  {x:#, y:#}  target position in screen coords
    
                ctx.strokeStyle = "rgba(0,0,0, .333)"
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(pt1.x, pt1.y)
                ctx.lineTo(pt2.x, pt2.y)
                ctx.stroke()

                DrawArrow(ctx, pt1.x, pt1.y, pt2.x , pt2.y, 5,'#000000')
                
            })
    
            particleSystem.eachNode(function(node, point){

                var width = ctx.measureText(node.data.description).width + 2 * nodeStyle.padding;
                var height =  nodeStyle.fontSize + 2*nodeStyle.padding;

                ctx.fillStyle = nodeStyle.fillStyle
                ctx = DrawRoundedRectangle(ctx, point.x-width/2, point.y-height/2, width, height, 20)
                
                ctx.font = nodeStyle.font;
                ctx.fillStyle = nodeStyle.textColor;
                ctx.textAlign = "center"
                ctx.fillText(node.data.description, point.x, point.y + nodeStyle.fontSize / 2);
          })    			
        },
        
        initMouseHandling:function(){
          // no-nonsense drag and drop (thanks springy.js)
          var dragged = null;
  
          // set up a handler object that will initially listen for mousedowns then
          // for moves and mouseups while dragging
          var handler = {
            clicked:function(e){
              var pos = $(canvas).offset();
              _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
              dragged = particleSystem.nearest(_mouseP);
  
              if (dragged && dragged.node !== null){
                // while we're dragging, don't let physics move the node
                dragged.node.fixed = true
              }
  
              $(canvas).bind('mousemove', handler.dragged)
              $(window).bind('mouseup', handler.dropped)
  
              return false
            },
            dragged:function(e){
              var pos = $(canvas).offset();
              var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
  
              if (dragged && dragged.node !== null){
                var p = particleSystem.fromScreen(s)
                dragged.node.p = p
              }
  
              return false
            },
  
            dropped:function(e){
              if (dragged===null || dragged.node===undefined) return
              if (dragged.node !== null) dragged.node.fixed = false
              dragged.node.tempMass = 1000
              dragged = null
              $(canvas).unbind('mousemove', handler.dragged)
              $(window).unbind('mouseup', handler.dropped)
              _mouseP = null
              return false
            }
          }
          
          // start listening
          $(canvas).mousedown(handler.clicked);
  
        },
        
      }
      return that
    }    

  
    $(document).ready(function(){
      var sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
      sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
      sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

      $('#submit-button').on('click', function() {
        var newKnowledge = $('#submit-area').val();
        fetch("http://54.74.246.181:8080/api/knowledge/post", {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({text: newKnowledge})
        }).then(res => res.json())
          .then(graph => {
            graph.forEach(node => {
              sys.addNode(node.name, {description: node.name})
            })
            graph.forEach(node => {
                node.pointedBy.forEach(parent => {
                    sys.addEdge(parent.name, node.name);
                })
            })
          });
      })

      fetch("http://54.74.246.181:8080/api/knowledge/getAll")
      .then(response => response.json())
      .then(graph => {
          graph.forEach(node => {
              sys.addNode(node.name, {description: node.name})
          })
          graph.forEach(node => {
              node.pointedBy.forEach(parent => {
                  sys.addEdge(parent.name, node.name);
              })
          })
      });
        // add some nodes to the graph and watch it go...
        //   sys.addNode('Iwan', {description: "Iwan"})
        //   sys.addNode('Radi', {description: "Radi"})
        //   sys.addNode('Eli', {description: "Eli"})
        //   sys.addNode('Stefan', {description: "Stefan"})
        //   sys.addNode('Rado', {description: "Rado"})
        //   sys.addNode('Jorkata', {description: "Jorkata"})

        //   sys.addEdge('Iwan', "Rado")
        //   sys.addEdge('Jorkata', "Rado")
        //   sys.addEdge('Rado', "Radi")
        //   sys.addEdge('Eli', "Stefan")
        //   sys.addEdge('Stefan', "Iwan")
        //   sys.addEdge('Rado', "Eli")
        //   sys.addEdge('Stefan', "Rado")
        // var input = document.createElement("input");
        // input.type = "text";
        // input.className = "css-class-name"; // set the CSS class
        // container.appendChild(input); // put it into the DOM
    })
  
  })(this.jQuery)