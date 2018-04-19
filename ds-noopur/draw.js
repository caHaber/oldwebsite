

var xhr = new XMLHttpRequest();
var selectionComplete = 0;
var colorPicked;
var strokePicked;
var button;
var canvas;
// Line seg is {mouseX, mouseY, pmouseX, pmouseY}
var path = {lineSegs: [], width: null, height: null, strokeColor: null, strokeWidth: 7};

// For local development you must run the post server and the website
var URL
// ='http://localhost:3000';
= 'http://50.1.86.208:3000/';


var pallete = ['#fc331c','#ff8f00','#edff5b','#52e000','#00b22c','#00c4da','#4643bb','#610c8c','#d223fe','#e5e3e3','#777777','#AAAAAA'];
shuffleA(pallete);

var sent = 0;


//Color brewer set 9 qualitative sets
//  ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9'];
//  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];
// HSL Pallette
// ["lightgrey",
// "grey",
// "black",
// "red",
// "slategrey",
// "royalblue",
// "green",
// "Beige",
// "purple",
// "pink",
// "yellow",
// "lightblue"];
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
//UGLY RAINBOW
// ['#ff3311',
// '#feae2d',
// '#d0c310',
// '#69d025',
// '#11aabb',
// '#4444dd',
// '#3311bb' ,
// '#442299',
// '#FFFFFF',
// '#3311bb' ,
// '#442299',
// '#FFFFFF'];

function setup() {
   canvas = createCanvas(windowWidth, windowHeight); 
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
        if (sent > 0){
            drawStarterLine();
            noLoop();
        }else {
            selectionComplete = 1;
            drawStage();
            noLoop();
        }

    }
    circleSize = circleSize + 20;  
}

function drawStage() {
    fill("none");
    clear();
    circleSize = 0;
    drawStarterLine();
}


function drawColorChoices(){
    var cr = 0;
    strokeWeight(0);
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 4; j++){
            var c = pallete[cr];
            fill(c);
            rect(i * (windowWidth/3), j * (windowHeight/4), windowWidth/3, windowHeight/4);
            cr++;
        }
    }
    strokeWeight(+path.strokeWidth);
}

function drawPenChoices(){
    clear();

    var scaps = [ROUND,SQUARE,PROJECT];
    var color = 1;
    fill(colorPicked);
    for(var j = 0; j < 3; j++){
        // strokeCap(scaps[j]);
        for(var i = 0; i < 4; i++){
            strokeWeight(color);
            line(j * (windowWidth/3) + (windowWidth/3)/2, i * (windowHeight/4) + windowHeight/8 , j * (windowWidth/3) + (windowWidth/3)/2 + 20,i * (windowHeight/4) + windowHeight/8 + 20);
            color++;
        }
    }
    strokeWeight(+path.strokeWidth);

}



function drawStarterLine(){
    setPen("black",4);
    line(windowWidth/8, windowHeight/2, 0, windowHeight/2);
    line(windowWidth - windowWidth/8, windowHeight/2, windowWidth, windowHeight/2);

    if(sent === 0){
        addButton(button, '<span>Send!</span>', bgNext, windowWidth * .7, windowHeight * .8, 'btn');
        addButton(button, '<span>Clear</span>', bgClear, windowWidth * .1, windowHeight * .8, 'btn red');
    }

    setPen(colorPicked,+path.strokeWidth);

}

function getStroke(x, y){
    var width = (windowWidth/3);
    var height = (windowHeight/4);
    var count = 1;
    for(var j = 1; j < 4; j++){
        for(var i = 1; i < 5; i++){
            if (x < width*j && y < height*i && x > width * (j-1) && y > height * (i-1)){
                console.log(count);
                return count;

            }
               
            count++;
        }
    } 

    return 5;
}


var secondStage = 0;
var started = 0;

var start,end, last, time;

function touchStarted() {
    if(!selectionComplete && secondStage === 0) {
        colorPicked = get(mouseX,mouseY);
        stroke(colorPicked[0],colorPicked[1],colorPicked[2],colorPicked[3]);

        fill("white");
        drawPenChoices();
        secondStage = 1;
        // loop();
        return false;
    } else if (secondStage === 1) {
        console.log("drawStage");
        strokePicked = getStroke(mouseX,mouseY);
        // drawStage()
        path.strokeWidth = strokePicked;
        secondStage = 2;
        fill("none");
        loop();
        return false;
    } 

    
    started = 1;
    if (started){
        pmouseX = mouseX;
        pmouseY = mouseY;
    }

    if(path.lineSegs.length !== 0){
        pmouseX = mouseX;
        pmouseY = mouseY;
     } 
     else {
        start = new Date();
     }
    return false;
}

function touchMoved() {
   if(!selectionComplete) return false;
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
    if(path.lineSegs.length !== 0)
        path.lineSegs[path.lineSegs.length-1].time = end.getTime() - start.getTime();
    return false;
 }

function success(){
    // loop();
} 

function sendLineData () {

        if(pathEmpty()) return;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        path.strokeColor = colorPicked;

        console.log(path);
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

function addButton(b, content, action, width, height, clss){
    b = createButton(content);
    b.position(width , height);
    b.mousePressed(action);
    b.addClass(clss);
}

function bgNext(){
    sent++;
    sendLineData();
    bgClear();
}

function bgClear(){
    clear();
    secondStage = 2;
    circleSize = 0;
    path.lineSegs = [];
    loop();
    // sendLineData();
}

//HELPER METHODS
function setPen(color, width){
    strokeWeight(width);
    stroke(color);
}

function shuffleA(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pathEmpty(){
    return path.lineSegs.length === 0 ? true : false 
}