/**
***	Author : Oussama Ben Khiroun
***	Contact : https://oussamabenkhiroun.com/
*** Version 1.0
**/

var numberOfBombs = 99;
var iMatrixSize = 16;
var jMatrixSize = 30;
var playerID = 2;

// get parameters, if exists
const urlParams = new URLSearchParams(location.search);
for (const [key, value] of urlParams) {
  if (key == "x") {
    jMatrixSize = parseInt(value);
  } else if (key == "y") {
    iMatrixSize = parseInt(value);
  } else if (key == "b") {
    numberOfBombs = parseInt(value);
  } else if (key == "u") {
    playerID = parseInt(value);
  }
}


// create board
const boardSize=String(iMatrixSize)+"x"+String(jMatrixSize);
const theme="url('images/minesweeper.png') "	// theme could be changed with another sprite (cells dimension=16px)

var b = jsboard.board({attach:"game", size:boardSize});
b.style({borderSpacing: "0px", border:"1px solid #CCC"});
var nil = jsboard.piece({text:"NL", textIndent:"-9999px", background:theme+"-32px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto", padding:"0" });
b.cell("each").style({background:"transparent", width:"16px", height:"16px", margin:"0", padding:"0"});
b.cell("each").place(nil.clone())

// setup pieces
var zero = jsboard.piece({text:"ZR", textIndent:"-9999px", background:theme+"0 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var one = jsboard.piece({text:"ON", textIndent:"-9999px", background:theme+"-16px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var two = jsboard.piece({text:"TW", textIndent:"-9999px", background:theme+"-32px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var three = jsboard.piece({text:"TH", textIndent:"-9999px", background:theme+"-48px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var four = jsboard.piece({text:"FO", textIndent:"-9999px", background:theme+"-64px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var five = jsboard.piece({text:"FI", textIndent:"-9999px", background:theme+"-80px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var six = jsboard.piece({text:"SX", textIndent:"-9999px", background:theme+"-96px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var seven = jsboard.piece({text:"SV", textIndent:"-9999px", background:theme+"-112px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var eight = jsboard.piece({text:"EI", textIndent:"-9999px", background:theme+"-128px 0 no-repeat", width:"16px", height:"16px", margin:"0 auto" });

var f1 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-48px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff1 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-64px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f2 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-80px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff2 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-96px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f3 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-112px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff3 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-128px -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f4 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-16px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff4 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-32px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f5 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-48px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff5 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-64px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f6 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-80px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff6 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-96px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var f7 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-112px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var ff7 = jsboard.piece({text:"FL", textIndent:"-9999px", background:theme+"-128px -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });

var flags = [f1,f2,f3,f4,f5,f6,f7]
var falseFlags = [ff1,ff2,ff3,ff4,ff5,ff6,ff7]
var colors = [ "#0000FF", "#008000", "#FF0000", "#000080", "#800000", "#008080", "#808080" ]

var flag = flags[playerID]
var falseFlag = falseFlags[playerID]


// setup bombs
var bomb = jsboard.piece({text:"BM", textIndent:"-9999px", background:theme+"0 -16px no-repeat", width:"16px", height:"16px", margin:"0 auto" });
var bombRed = jsboard.piece({text:"BR", textIndent:"-9999px", background:theme+"0 -32px no-repeat", width:"16px", height:"16px", margin:"0 auto" });

// array regrouping numbered pieces
var arrayNumbers = [zero, one, two, three, four, five, six, seven, eight];
var arrayValues = { "ON": 1, "TW": 2, "TH": 3, "FO": 4, "FI": 5, "SX": 6, "SV": 7, "EI": 8, }

var gameOn = false;
var gameIsOver = false;

// handle bombs in 2d array
var bombMatrix, flagMatrix;

// set number of remaining mines in HTML
setDigits("l",numberOfBombs)
var remainingMines = numberOfBombs;
var elapsed = 0;
var timerInterval;

// display .game-top
document.getElementById("game-board").style.display = "block";
w = document.getElementById("game").offsetWidth;
document.getElementById("game-board").style.width = String(w)+"px";
document.getElementById("game-top").style.width = String(w-4)+"px";



b.cell("each").on("mousedown", function() {
	if(gameOn && !gameIsOver) document.getElementById("mood").style.backgroundPosition = "-52px -72px"
});

b.cell("each").on("mouseup", function() {
  if(gameOn && !gameIsOver) document.getElementById("mood").style.backgroundPosition = "-26px -72px"
});

// game click handler (left mouse click)
b.cell("each").on("click", function() {
  if (!gameOn) {
    // initializing game array with random placed bombs
    initGame(b.cell(this).where());
    gameOn = true;
  }
	if(!gameIsOver){
    var loc = b.cell(this).where();
    var i = loc[0];
    var j = loc[1];
    console.log((b.cell(this).get()))
		if (b.cell(this).get()==="NL") {
      testCell(i,j);
    } else if (b.cell(this).get()!="FL" && b.cell(this).get()!="ZR") {
      if (arrayValues[b.cell(this).get()] == numberOfNearFlags(i,j)) {
        for (var k = i-1; k<= i+1; k++) {
          if (k >= 0 && k<iMatrixSize) {
            for (var l = j-1; l<= j+1; l++) {
              if (l >= 0 && l<jMatrixSize && b.cell([k,l]).get() === "NL") {
                testCell(k,l)
              }
            }
          }
        }
      }
		}
	}
});

// placing flags (right mouse click)
b.cell("each").on("contextmenu", function(ev) {
	// avoid showing context menu
  ev.preventDefault();
  var loc = b.cell(this).where();
  var i = loc[0];
  var j = loc[1];
	// for updating remaining mines
	if (b.cell(this).get()==="NL") {
		b.cell(this).place(flag.clone());	// place a flag
    flagMatrix[i][j] = 1;
    remainingMines -= 1;
	} else if (b.cell(this).get()=="FL") {
		b.cell(this).rid();
    flagMatrix[i][j] = 0;
    remainingMines += 1;
	}
  setDigits("l",remainingMines)
  return false;
}, false);

function initGame(first_click){
	var i, j;
	bombMatrix = [];
	flagMatrix = [];
	for (i=0; i<iMatrixSize; i++){
		bombMatrix[i] = [];
		flagMatrix[i] = [];
		for (j=0; j<jMatrixSize; j++){
			bombMatrix[i][j] = 0;
			flagMatrix[i][j] = 0;
		}
	}
	
	// place bombs randomly
	var placedBombs = 0;
	while(placedBombs<numberOfBombs){
		i = Math.floor(Math.random() * iMatrixSize);
		j = Math.floor(Math.random() * jMatrixSize);
    if(bombMatrix[i][j]==0 && !(i == first_click[0] && j == first_click[1])){
			bombMatrix[i][j]=1;
			placedBombs++;
    }
	}
  timerInterval = window.setInterval(timer,1000)
}

function testCell(i,j) {

  if(bombMatrix[i][j]==1){
    // game over
    finishGame(i,j);
  } else {
  
    var nearBombs = numberOfNearBombs(i,j); 
    
    if(nearBombs==0){
      // when zero bombs are placed near the current cell
      exploreRecursively(i,j);
    }else{
      b.cell([i,j]).place(arrayNumbers[nearBombs].clone());
    }
    
    // test if all cells not containing bombs are explored
    if(isAllCellExplored()){
      finishGame(-1,-1);
      // show winning message
      document.getElementById("mood").style.backgroundPosition = "-104px -72px"
    }
  }
}

function numberOfNearBombs(i,j){
	var nearBombs = 0;
	if(i>0){
		nearBombs = nearBombs + bombMatrix[i-1][j];
	}
	if(j>0){
		nearBombs = nearBombs + bombMatrix[i][j-1];
	}
	if(i<iMatrixSize-1){
		nearBombs = nearBombs + bombMatrix[i+1][j];
	}
	if(j<jMatrixSize-1){
		nearBombs = nearBombs + bombMatrix[i][j+1];
	}
	if((i-1>=0)&&(j-1>=0)){
		nearBombs = nearBombs + bombMatrix[i-1][j-1];
	}
	if((i+1<iMatrixSize)&&(j+1<jMatrixSize)){
		nearBombs = nearBombs + bombMatrix[i+1][j+1];
	}
	if((i-1>=0)&&(j+1<jMatrixSize)){
		nearBombs = nearBombs + bombMatrix[i-1][j+1];
	}	
	if((i+1<iMatrixSize)&&(j-1>=0)){
		nearBombs = nearBombs + bombMatrix[i+1][j-1];
	}
	return nearBombs; 
}

function numberOfNearFlags(i,j){
	var nearFlags = 0;
	if(i>0){
		nearFlags = nearFlags + flagMatrix[i-1][j];
	}
	if(j>0){
		nearFlags = nearFlags + flagMatrix[i][j-1];
	}
	if(i<iMatrixSize-1){
		nearFlags = nearFlags + flagMatrix[i+1][j];
	}
	if(j<jMatrixSize-1){
		nearFlags = nearFlags + flagMatrix[i][j+1];
	}
	if((i-1>=0)&&(j-1>=0)){
		nearFlags = nearFlags + flagMatrix[i-1][j-1];
	}
	if((i+1<iMatrixSize)&&(j+1<jMatrixSize)){
		nearFlags = nearFlags + flagMatrix[i+1][j+1];
	}
	if((i-1>=0)&&(j+1<jMatrixSize)){
		nearFlags = nearFlags + flagMatrix[i-1][j+1];
	}	
	if((i+1<iMatrixSize)&&(j-1>=0)){
		nearFlags = nearFlags + flagMatrix[i+1][j-1];
	}
	return nearFlags; 
}

// this function is called when zero cell is clicked
function exploreRecursively(i,j){
	if((i>=0)&&(i<iMatrixSize)&&(j>=0)&&(j<jMatrixSize)&&(b.cell([i,j]).get()==="NL")){
		var nearBombs = numberOfNearBombs(i,j);
		b.cell([i,j]).place(arrayNumbers[nearBombs].clone());
		if((nearBombs==0)){		
			exploreRecursively(i+1,j) + exploreRecursively(i-1,j) + exploreRecursively(i,j+1) + exploreRecursively(i,j-1)
			+ exploreRecursively(i-1,j-1) + exploreRecursively(i-1,j+1) + exploreRecursively(i+1,j-1) + exploreRecursively(i+1,j+1);
		}			
	}
}

/* show all hidden cells:
	- when a bombs is clicked, (k,l) represent the cell indices (a red bomb is shown)
	- to resolve the grid, this function can be called by passing (-1,-1) arguments
*/
function finishGame(k,l){
  window.clearInterval(timerInterval)
	var aux; 
	for (var i=0; i<iMatrixSize; i++) {
		for (var j=0; j<jMatrixSize; j++) {
      if (bombMatrix[i][j]==1) {
				if ((i==k)&&(j==l)) {
					b.cell([i,j]).place(bombRed.clone());
					b.cell([i,j]).style({"background-color": colors[playerID]});
        } else if (flagMatrix[i][j]==1) {
					b.cell([i,j]).place(flag.clone());
        } else {
					b.cell([i,j]).place(bomb.clone());
				}				
			} else if (flagMatrix[i][j]==1) {
          b.cell([i,j]).place(falseFlag.clone());
      } else {
        aux = numberOfNearBombs(i,j);
        b.cell([i,j]).place(arrayNumbers[aux].clone());
			}
		}	
	}
  // show "Game Over" in HTML
  document.getElementById("mood").style.backgroundPosition = "-78px -72px"
	gameIsOver = true;
}

// verify if all cells are exlored (win scenario)
function isAllCellExplored(){
	for (var i=0; i<iMatrixSize; i++){
		for (var j=0; j<jMatrixSize; j++){
			if((bombMatrix[i][j]==0)&&(b.cell([i,j]).get()==="NL")){
				return false;
			}
		}	
	}
	return true;
}

function timer() {
  elapsed += 1;
  setDigits("p", elapsed);
}

function setDigits (target, value) {
  v1 = Math.floor(value / 100);
  document.getElementById(target+"1").style.backgroundPosition = "-"+String(v1*13)+"px -48px"
  v2 = Math.floor(value % 100 / 10)
  document.getElementById(target+"2").style.backgroundPosition = "-"+String(v2*13)+"px -48px"
  v3 = value % 10;
  document.getElementById(target+"3").style.backgroundPosition = "-"+String(v3*13)+"px -48px"
}

