//https://konvajs.org/docs/sandbox/Gestures.html

class Game{
  /*
  * Initialize an empty game board canvas inside the give container id
  * containerId:  String
  * WinCallback: Opt<Function(NumberOfMoves)>
  */
  constructor(containerId="container", winCallback=null){
    console.log("started")
    const container = document.getElementById(containerId);
    this.winCallback = winCallback
    this.colors = {
      foxColor: "orange",
      starColor: "#fccf00",
      tileLightColor: "#89b717",
      tileColor: "green",
      tileDarkColor: "darkgreen",
      rockColor: "brown"
    }
    this.width = container.clientWidth
    this.height = this.width
    this.gridSpace = 10
    this.winningState = false
    this.winningText = null
    this.moves = 0
    //size of a cell, px
    this.l = (this.width - this.gridSpace * 4) / 5
    this.tween = null;
    this.stage = new Konva.Stage({
      container: containerId,
      width: this.width,
      height: this.height,
    });
    //layer for the board items
    this.layer = new Konva.Layer()

    //references to the board tiles
    this.boardTiles = []
    this.createBoardTiles()

    //all items on the board, and their reference
    this.foxes = [] //Array<{Ref, x, y, isVertical, computed: {}}>
    this.rocks = [] //Array<{Ref, x, y}>
    this.frogs = [] //Array<{Ref, x, y}>
  }

  /**
  * bitmap representation of all items on the board.
  * Used to calculate movement boundaries
  */
  computeBitmapBoundaries(debugPrint=false){
    //initialize "bitmap"
    let map = []
    for(let i=0; i<5; i++){
      map[i] = new Array(5).fill(false)
    }

    this.rocks.forEach(c => {
      map[c.y][c.x] = true
    })
    this.frogs.forEach(c => {
      map[c.y][c.x] = true
    })
    this.foxes.forEach(c => {
      let x = c.x
      let y = c.y
      map[y][x] = true
      //foxes occupy two tiles
      if(c.isVertical){
        y++
      }
      else{
        x++
      }
      map[y][x] = true
    })
    if(debugPrint)
      this.debugPrintBitMap(map)
    return map
  }

  debugPrintBitMap(bitmap){
    for(let i=0; i<5; i++){
      let p = "row " + i + ": "
      for(let j=0; j<5; j++){
        p += bitmap[i][j] ? "x" : "."
      }
      console.log(p)
    }
  }

  //call this when a winning configuration is reached
  winAnimation(){
    //add confetti att the coord of each frog
    //TODO
    this.frogs.forEach(c => {
      c.ref.to({
        duration: 1,
        // rotation: 1180,
        opacity: 0
      })
    })
    this.foxes.forEach(c => {
      c.ref.to({
        duration: 1,
        opacity: 0
      })
    })

    this.rocks.forEach(c => {
      c.ref.to({
        duration: 1,
        opacity: 0
      })
    })

    for(let i=0; i<5; i++){
      for(let j=0; j<5; j++){
        this.boardTiles[i][j].to({
          opacity: 0,
          easing: Konva.Easings.EaseIn,
          duration: (i+j)*0.2
        })
      }
    }


    let text = new Konva.Text({
      x: 0,
      y: this.height / 2,
      width: this.width,
      text: `solved in ${this.moves} moves`,
      fontSize: 40,
      align: "center",
      fontFamily: 'Arial',
      fill: 'White',
      opacity:0
    });
    text.offsetY(text.height() / 2);
    this.layer.add(text)
    text.to({
      easing: Konva.Easings.EaseIn,
      duration: 2,
      opacity: 1
    })
    this.winningText = text
    //call win callback
    if(this.winCallback != null)
      setTimeout(this.winCallback, 3000, this.moves)

  }

  createBoardTiles(){
    var boardLayer = new Konva.Layer();
    //board squares
    for(let i=0; i<5; i++){
      let row = [];
      for(let j=0; j<5; j++){
        let s = addSquare.call(this, boardLayer, j, i);
        row.push(s)
      }
      this.boardTiles.push(row)
    }
    //board holes
    addHole.call(this, boardLayer, 0,0)
    addHole.call(this, boardLayer, 2,2)
    addHole.call(this, boardLayer, 0,4)
    addHole.call(this, boardLayer, 4,0)
    addHole.call(this, boardLayer, 4,4)
    this.stage.add(boardLayer)
  }

  resetGame(){
    this.winningState = false
    this.moves = 0
    this.foxes.forEach(c => {
      c.ref.destroy()
    })
    this.rocks.forEach(c => {
      c.ref.destroy()
    })
    this.frogs.forEach(c => {
      c.ref.destroy()
    })
    this.foxes = []
    this.frogs = []
    this.rocks = []

    if(this.winningText)
      this.winningText.destroy()

    for(let i=0; i<5; i++){
      for(let j=0; j<5; j++){
        this.boardTiles[i][j].to({
          opacity: 1,
          duration: 0.1
        })
      }
    }
  }

  initGame(frogs, foxes, rocks){
    this.computeBitmapBoundaries(true)
    this.resetGame()
    //rocks
    rocks.forEach(c => {
      this.rocks.push({
        x: c.x,
        y: c.y,
        ref: addRock.call(this, this.layer, c.x, c.y)
      })
    })
    //foxes
    foxes.forEach((c, i) => {
      let ref = addFox.call(this, this.layer, c.x, c.y, c.isVertical)
      this.foxes.push({
        x: c.x,
        y: c.y,
        isVertical: c.isVertical,
        //precomputed values to avoid extra calcuations when handling fox legal movements
        computed: {
          x: ref.x(),
          y: ref.y(),
          // minX: 0,
          // maxX: (this.width - ref.width()),
          // minY: 0,
          // maxY: (this.height - ref.height())
        },
        ref: ref
      })
      //handle drag logic
      ref.on('dragmove', evt => this.handleFoxDragmove(evt, i))
      ref.on('dragend', evt => this.handleFoxDragend(evt, i))
    })
    //frogs
    frogs.forEach((c, i) => {
      console.log(c)
      let ref = addStar.call(this, this.layer, c.x, c.y)
      this.frogs.push({
        x: c.x,
        y: c.y,
        ref: ref
      })
      //handle drag logic
      ref.on('dragend', evt => this.handleFrogDragend(evt, i))

    })

    //add the layer to the stage
    this.stage.add(this.layer)
    this.updateComputed()
  }

  checkWin(){
    const holes = [
      0,
      4,
      40,
      44,
      22
    ]
    this.winningState = this.frogs.every(c => {
      let tile = c.x * 10 +c.y
      return holes.includes(tile)
    })

    if(this.winningState){
      this.winAnimation()
    }
  }

  isLegalMove(currentX, currentY, targetX, targetY){
    let bitmap = this.computeBitmapBoundaries()
    let lower, upper;
    //target is occupied
    if(bitmap[targetY][targetX]){
      return false
    }

    if(currentX == targetX){
      lower = Math.min(currentY, targetY)
      upper = Math.max(currentY, targetY)
    }
    else if(currentY == targetY){
      lower = Math.min(currentX, targetX)
      upper = Math.max(currentX, targetX)
    }
    else{
      //current and target are not aligned
      return false
    }

    //target is an adjacent tile
    if(upper - lower == 1){
      return false
    }

    //there are empty tiles between target and current
    for(let i= lower+1; i<upper; i++){
      const tileOccupied = (currentX == targetX) ? 
         bitmap[i][targetX] :
         bitmap[targetY][i] ;
      if(!tileOccupied){
        return false
      }
    }

    //all checks passed, the move is legal
    return true
  }

  handleFrogDragend(evt, index){
    let frog = this.frogs[index]
    //get closest tile
    let tileX = Math.floor(frog.ref.x() / (this.l + this.gridSpace))
    let tileY = Math.floor(frog.ref.y() / (this.l + this.gridSpace))
    console.log({
      x: tileX,
      y: tileY
    })
    //if legal, update frog coords and update computed
    if(this.isLegalMove(frog.x, frog.y, tileX, tileY)){
      frog.x = tileX
      frog.y = tileY
      this.moves ++;
    }
    //animate to the correct tile
    this.updateComputed()
    this.animateToPosition()
    this.checkWin()

  }
  handleFoxDragend(evt, index){
    let fox = this.foxes[index]
    //get closest tile
    let tileX = Math.floor(fox.ref.x() / (this.l + this.gridSpace))
    let tileY = Math.floor(fox.ref.y() / (this.l + this.gridSpace))
    console.log({
      x: tileX,
      y: tileY
    })

    if(fox.x != tileX || fox.y != tileY)
      this.moves++;
    //update fox coords and update computed
    fox.x = tileX
    fox.y = tileY
    this.updateComputed()
    this.animateToPosition()
  }
  handleFoxDragmove(evt, index){
    let fox = this.foxes[index]
    if(fox.isVertical){
      // constraint movement on one axys
      fox.ref.x(fox.computed.x);
      // constraint movement to precomputed boundaries
      fox.ref.y(Math.max(
        fox.computed.minY,
        Math.min(fox.computed.maxY, fox.ref.y()
        ))
      )
    }
    else{
      // constraint movement on one axys
      fox.ref.y(fox.computed.y);
      // constraint movement to precomputed boundaries
      fox.ref.x(Math.max(
        fox.computed.minX,
        Math.min(fox.computed.maxX, fox.ref.x()
        ))
      )
    }
  }

  //call this when the map items change position
  animateToPosition(){
    this.frogs.forEach(c => {
      c.ref.to({
        duration: 0.1,
        x: c.x*this.l + (this.gridSpace * c.x) + this.l/2 ,
        y: c.y*this.l + (this.gridSpace * c.y) + this.l/2 ,
      })
    })
    this.foxes.forEach(c => {
      c.ref.to({
        duration: 0.01,
        x: c.x*this.l + (this.gridSpace * c.x) + 10,
        y: c.y*this.l + (this.gridSpace * c.y) + 10,
      })
    })
  }
  //call this when the map items change position
  //TODO: clean. this is ugly
  updateComputed(){
    let bitmap = this.computeBitmapBoundaries(true)
    //update foxes computed boundaries
    this.foxes.forEach((c,i) => {
      let comp = {
      minX: 0,
      maxX: 4,
      minY: 0,
      maxY: 4
      }

      if(c.isVertical){
        for(let j=0; j< 5; j++){
          let tile = bitmap[j][c.x];
          let pos = c.y
          if(j < pos && tile){
            comp.minY = j + 1
          }
          else if(j > (pos+1) && tile){
            comp.maxY = j - 1
            break
          }
        }
      }
      else{
        for(let j=0; j< 5; j++){
          let tile = bitmap[c.y][j];
          let pos = c.x
          if(j < pos && tile){
            comp.minX = j + 1
          }
          else if(j > (pos+1) && tile){
            comp.maxX = j - 1
            break
          }
        }
      }

      //transform tile numbers to real coords
      Object.keys(comp).forEach(k => {
        comp[k] = ((comp[k]+1) * this.l) + (comp[k] * this.gridSpace)
      });
      comp.minX -= this.l
      comp.minY -= this.l
      comp.maxX -= c.ref.width()
      comp.maxY -= c.ref.height()
      this.foxes[i].computed = {
        ...this.foxes[i].computed,
        ...comp
      }
    })
  }

}

const games = [

{
  name: "tutorial 1",
  frogs: [
    {x: 4, y: 2},
  ],
  foxes: [
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    {x: 3, y: 2},
  ]
},
{
  name: "tutorial 2",
  frogs: [
    {x: 0, y: 3},
  ],
  foxes: [
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    {x: 0, y: 2},
    {x: 0, y: 1},
  ]
},
{
  name: "tutorial 3",
  frogs: [
    {x: 3, y: 2},
  ],
  foxes: [
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    {x: 0, y: 1},
    {x: 1, y: 2},
    {x: 2, y: 2},
  ]
},
{
  name: "tutorial 4",
  frogs: [
    {x: 4, y: 2},
  ],
  foxes: [
     {x: 3, y: 0, isVertical: true},
  ],
  rocks: [
  ]
},
{
  name: "level 1",
  frogs: [
    {x: 2, y: 2},
    {x: 4, y: 2},
  ],
  foxes: [
    {x: 3, y: 0, isVertical: true},
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    // {x: 0, y: 3},
    // {x: 1, y: 3},
    {x: 0, y: 1},
    {x: 1, y: 2},
    {x: 2, y: 3},
  ]
},
{
  name: "level 1b",
  frogs: [
    {x: 2, y: 2},
    {x: 4, y: 2},
  ],
  foxes: [
    {x: 3, y: 0, isVertical: true},
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    // {x: 0, y: 3},
    // {x: 1, y: 3},
    {x: 1, y: 2},
    {x: 2, y: 3},
  ]
},

{
  name: "level 29",
  frogs: [
    {x: 3, y: 3},
    {x: 4, y: 4},
  ],
  foxes: [
    {x: 3, y: 1, isVertical: true},
    // {x: 0, y: 2, isVertical: false},
  ],
  rocks: [
    {x: 2, y: 4},
  ]
},

{
  name: "level 30",
  frogs: [
    {x: 1, y: 3},
    {x: 2, y: 4},
  ],
  foxes: [
    {x: 1, y: 0, isVertical: true},
    {x: 3, y: 1, isVertical: false},
  ],
  rocks: [
    {x: 4, y: 2},
  ]
},

{
  name: "level 31",
  frogs: [
    {x: 4, y: 0},
    {x: 3, y: 2},
  ],
  foxes: [
    {x: 3, y: 3, isVertical: true},
  ],
  rocks: [
    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 2, y: 2},
  ]
},

{
  name: "level 45",
  frogs: [
    {x: 0, y: 3},
    {x: 2, y: 3},
    {x: 4, y: 2},
  ],
  foxes: [
    {x: 2, y: 1, isVertical: false},
    {x: 3, y: 3, isVertical: true},
  ],
  rocks: [
    // {x: 0, y: 3},
    // {x: 1, y: 3},
    {x: 0, y: 0},
  ]
},

{
  name: "level 47",
  frogs: [
    {x: 4, y: 1},
    {x: 2, y: 4},
  ],
  foxes: [
    {x: 2, y: 1, isVertical: false},
  ],
  rocks: [
    // {x: 0, y: 3},
    // {x: 1, y: 3},
    {x: 2, y: 2},
    {x: 3, y: 2},
    {x: 2, y: 3},
  ]
},

]

//TODO: when using as module, import Konva

//add this preset to every element that needs a shadow
const shadowPreset = {
  shadowColor: 'black',
  shadowBlur: 10,
  shadowOffset: {
    x: 5,
    y: 5,
  },
  shadowOpacity: 0.6,
}

/**
*   x: int in range 0-4
*   y: int in range 0-4
*/
function addSquare(layer, x, y){
  let s = new Konva.Rect({
    x: x*this.l + (this.gridSpace * x),
    y: y*this.l + (this.gridSpace * y),
    width: this.l,
    height: this.l,
    cornerRadius: 8,
    fill: this.colors.tileLightColor,
    draggable: false
  })

  layer.add(s);
  return s
}

/**
*   x: int in range 0-4
*   y: int in range 0-4
*/
function addRock(layer, x, y){
  var rock = new Konva.Circle({
    x: x*this.l + (this.gridSpace * x) + this.l/2 ,
    y: y*this.l + (this.gridSpace * y) + this.l/2 ,
    radius: this.l / 2.5,
    fill: this.colors.rockColor,
    //TODO: use shadow preset
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {
      x: 5,
      y: 5,
    },
    shadowOpacity: 0.6,
  });
  layer.add(rock)

  return rock
}


/**
*   x: int in range 0-4
*   y: int in range 0-4
*/
function addHole(layer, x, y){
  var circle2 = new Konva.Circle({
    x: x*this.l + (this.gridSpace * x) + this.l/2 ,
    y: y*this.l + (this.gridSpace * y) + this.l/2 ,
    radius: this.l / 2.5,
    fill: this.colors.tileColor,
  });
  layer.add(circle2)
  return circle2
}

function addStar(layer, x, y) {
  console.log(this)
  var scale = 1;

  var star = new Konva.Star({
    x: x * this.l + (this.gridSpace * x) + this.l/2,
    y: y * this.l + (this.gridSpace * y) + this.l/2,
    numPoints: 5,
    innerRadius: this.l/ 2.3 - this.l/5.0,
    outerRadius: this.l / 2.3,
    fill: this.colors.starColor,
    opacity: 0.8,
    draggable: true,
    scale: {
      x: scale,
      y: scale,
    },
    rotation: 30,
    //todo: use shadow preset
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {
      x: 5,
      y: 5,
    },
    shadowOpacity: 0.6,
    startScale: scale,
  });
  // add listeners for cursor styling
  star.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  star.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
  // bind stage handlers
  star.on('mousedown', function (evt) {
    var shape = evt.target;
    // shape.moveTo(dragLayer);
    // restart drag and drop in the new layer
    shape.startDrag();
  });

  star.on('mouseup', function (evt) {
    var shape = evt.target;
    // shape.moveTo(layer);
  });

  star.on('dragstart', function (evt) {
    var shape = evt.target;
    if (this.tween) {
      this.tween.pause();
    }
    shape.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scale: {
        x: shape.getAttr('startScale') * 1.2,
        y: shape.getAttr('startScale') * 1.2,
      },
    });
  });

  star.on('dragend', function (evt) {
    var shape = evt.target;

    this.tween = new Konva.Tween({
      node: shape,
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: shape.getAttr('startScale'),
      scaleY: shape.getAttr('startScale'),
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });

    this.tween.play();
  });

  layer.add(star);
  return star
}


/**
*   x: int in range 0-4
*   y: int in range 0-4
*
*/
function addFox(layer, x, y, isVertical=true){
  let s = new Konva.Rect({
    x: x*this.l + (this.gridSpace * x) + 10,
    y: y*this.l + (this.gridSpace * y) + 10,
    width:  (this.l- (isVertical? 20 : 5)) * (isVertical? 1 : 2),
    height: (this.l- (isVertical? 5 : 20)) * (isVertical? 2 : 1),
    fill: this.colors.foxColor,
    opacity: 0.9,
    draggable: true,
    cornerRadius: 8,
    shadowColor: 'black',
    //todo: use shadow preset
    shadowBlur: 10,
    shadowOffset: {
      x: 5,
      y: 5,
    },
    shadowOpacity: 0.6
  })

  // add listeners for cursor styling
  s.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  s.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });
  //todo: maybe this should be calculated out from here
  // var originalX = s.x();
  // var originalY = s.y();
  // s.on('dragmove', () => {
  //   // constraint movement on one axys
  //   if(isVertical)
  //     s.x(originalX);
  //   else
  //     s.y(originalY);

  //   //TODO: precompute min and max boundaries when state changes
  //   s.x(Math.max(
  //     0,
  //     Math.min(this.width - s.width(), s.x()
  //     ))
  //   )
  //   s.y(Math.max(
  //     0,
  //     Math.min(this.height - s.height(), s.y()
  //     ))
  //   )
  // });
  layer.add(s);
  return s;
}


  document.addEventListener('DOMContentLoaded', function() {
    main()
  }, false);
  function main(){
    const DOMlevelTxt = document.getElementById("level-txt")
    const DOMlevelSelect = document.getElementById("level-select")
    const DOMrestartBt = document.getElementById("restart-bt")
    const DOMpreviousBt = document.getElementById("previous-bt")
    const DOMnextBt = document.getElementById("next-bt")


    let selected = 0
   
    // try to get the selected game from the html
    if(DOMlevelSelect && parseInt(DOMlevelSelect.value) >= 0){
      selected = parseInt(DOMlevelSelect.value)
    }

    const game = new Game();

    function setGame(selected){
      let g = games[selected]
      game.initGame(
        g.frogs, g.foxes, g.rocks
      )
      if(DOMlevelTxt)
        DOMlevelTxt.innerText = " " + g.name
    }

    setGame(selected)


    if(DOMrestartBt)
      DOMrestartBt.addEventListener("click", c => {
        setGame(selected)
      })

    if(DOMpreviousBt)
      DOMpreviousBt.addEventListener("click", c => {
        selected --;
        if(selected < 0)
        selected = games.length -1;
        setGame(selected)
      })

    if(DOMnextBt)
    DOMnextBt.addEventListener("click", c => {
      selected ++;
      if(selected == games.length)
      selected = 0;
      setGame(selected)
    })
  }
