

var xhr = new XMLHttpRequest();
var selectionComplete = 0;
var colorPicked;
var strokePicked;

// Line seg is {mouseX, mouseY, pmouseX, pmouseY}
var path = {lineSegs: [], width: null, height: null, strokeColor: null, strokeWidth: 7};

// For local development you must run the post server and the website
var URL
// ='http://localhost:3000';
= 'http://50.1.86.208:3000/';


var pallete =
//Random Colors
//['#E6E6E6','#909090','#2A2A2A','#C1F6BE','#BEDAFF','#17B8FE','#40EDC8','#FF8235','#FF85B8'];
//Color brewer set 9 qualitative sets
//  ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9'];
//  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];
// HSL Pallette
["lightgrey",
"grey",
"black",
"red",
"slategrey",
"royalblue",
"green",
"Beige",
"purple",
"pink",
"yellow",
"lightblue"];
//Lighter Version
// ["#aabbea",
// "#b6c489",
// "#deb1e0",
// "#aad9a7",
// "#ecaaae",
// "#55cdd8",
// "#dfbc94",
// "#7cccee",
// "#e6e7af",
// "#80e4d6",
// "#a3daba",
// "#9cd9d4"]

function setup() {
   createCanvas(windowWidth, windowHeight); 
   path.height = windowHeight;
   path.width = windowWidth;
   strokeWeight(0);
   drawColorChoices();
   strokeWeight(+path.strokeWidth);
   noLoop();
}

var circleSize = 0;

var firstLoop = 0;

function draw(){
    //I hate p5 -> first loop conditional exit for tiny black circle
    if(!firstLoop){
        firstLoop = 1;
        return;
    }

    ellipse(windowWidth/2,windowHeight/2,circleSize,circleSize);

    if(circleSize > windowWidth*1.315 && circleSize > windowHeight*1.315){
        selectionComplete = 1;
        drawStage();
        noLoop();
    }
    circleSize = circleSize + 20;  
}

function drawStage() {
    fill("none");
    clear();
    circleSize = 0;
    setPen("black",4);
    drawStarterLine();
    setPen(colorPicked,+path.strokeWidth);
}


function drawColorChoices(){
    var color = 0;
    strokeWeight(0);
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 4; j++){
            fill(pallete[color]);
            rect(i * (windowWidth/3), j * (windowHeight/4), windowWidth/3, windowHeight/4);
            color++;
        }
    }
    strokeWeight(+path.strokeWidth);
}

function drawPenChoices(){
    clear();
    var color = 0;
    var size = 5;
    strokeWeight(0);
    for(var j = 0; j < 3; j++){
        for(var i = 0; i < 4; i++){
            fill(colorPicked);
            ellipse(j * (windowWidth/3) + (windowWidth/3)/2, i * (windowHeight/4) + windowHeight/8 , size,size);
            color++;
            size += 5;
        }
    }
    strokeWeight(+path.strokeWidth);

}

var secondStage = 0;
function touchStarted() {
    if(!selectionComplete && secondStage === 0) {
        colorPicked = get(mouseX,mouseY);
        stroke(colorPicked[0],colorPicked[1],colorPicked[2],colorPicked[3]);
    //    selectionComplete =
        fill("white");
        drawPenChoices();
        secondStage = 1;
        // loop();
        return false;
    } else if (secondStage === 1) {
        console.log("drawStage");
        strokePicked = getStroke((mouseX,mouseY));
        // drawStage()
        secondStage = 2;
        fill("none");
        loop();
        return false;
    }
    path.lineSegs = [];
    return false;
}

function getStroke(x, y){
    return 5;
}

function drawStarterLine(){
    line(windowWidth/8, windowHeight/2, 0, windowHeight/2);
    line(windowWidth - windowWidth/8, windowHeight/2, windowWidth, windowHeight/2);
}

var start,end, time;

function touchMoved() {
   if(!selectionComplete) return false;
   if(path.lineSegs.length === 0){
      pmouseX = mouseX;
      pmouseY = mouseY;
      start = new Date();
   } 
   line(mouseX, mouseY, pmouseX, pmouseY);
   end = new Date();
   time = end.getTime() - start.getTime();
   path.lineSegs.push({x:mouseX, y:mouseY, px:pmouseX, py: pmouseY, time: time});
   pmouseX = mouseX;
   pmouseY = mouseY;
   return false;
}

function touchEnded() {
    if(!selectionComplete) return false;
    end = new Date();
    path.lineSegs[path.lineSegs.length-1].time = end.getTime() - start.getTime();
    sendLineData();
    clear();
    selectionComplete = 0;
    secondStage = 0;
    drawColorChoices();
    return false;
 }

function success(){
    // loop();
} 

function sendLineData () {
        console.log(path);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        path.strokeColor = colorPicked;

        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
               //Flash Success!!
               success();
            } else {
               //Flash Failure!!
            }
        }

        xhr.send(JSON.stringify(path));
}


function setPen(color, width){
    strokeWeight(width);
    stroke(color);
}