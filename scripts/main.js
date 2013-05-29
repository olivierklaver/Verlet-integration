/**
 * Blob
 *
 * Verlet integration, natural soft-body implementation research
 *
 * @author Olivier Klaver
 * @version 1.0
 */

"use strict";

var backgroundColor = "#eee";
var blobColor       = "#78FFD0";
var renderMode      = 2;

var ratio;
var pointList  = [];
var springList = [];

var RELAXATION = 5;

var xSpeed = 10;
var ySpeed = 10;



/**
 * Sketchpad - init()
 */

function init() {

    window.canvasContainerSelector = "#stage";
}


/**
 * Sketchpad - setup()
 */

function setup() {

    // configure canvas
    window.frameRate = 60;

    var w = 700;
    var h = 600;

    // define canvas ratio - http://www.html5rocks.com/en/tutorials/canvas/hidpi/
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    ratio = devicePixelRatio / backingStoreRatio;

    // set canvas size
    size(w * ratio, h * ratio);
    context.canvas.style.width = w + 'px';
    context.canvas.style.height = h + 'px';


    // add parameters
    parameter("frameRate", "FPS:", 0, 60);
    parameter("renderMode", "Render mode:", 0, 2);

    createBlob();
}


/**
 * A bunch of loops to create the Blob skeleton
 */

function createBlob() {

    // start position
    var posX = 200;
    var posY = 270;

    Spring.stiffness = 0.02;

    var segments = 60;
    var radius   = 190;

    var partner = 12;

    // define the outer ring in points
    (function drawRim(segments, radius, xoffset, yoffset) {

        for (var i = 0; i < segments; i++) {

            var angle = (360 / segments) * i;
            angle = (angle - 90) * Math.PI / 180;
            var x = Math.cos(angle) * radius + xoffset;
            var y = Math.sin(angle) * radius + yoffset;

            pointList.push(new Point(x, y));
        }
    })(segments, radius, posX, posY);

    // connect the Points with Strings
    // outer ring
    for (var i = 0; i < segments - 1; i++) {

        springList.push(new Spring(pointList[i], pointList[i + 1]));
    }
    springList.push(new Spring(pointList[i], pointList[0]));

    // support strings
    for (i = 0; i < segments; i++) {

        // beams 1 (long)
        springList.push(new Spring(pointList[i], pointList[normalize(i - partner)]));

        // beams 2
        springList.push(new Spring(pointList[i], pointList[normalize(i - partner / 1.5)]));

        // beams 3
        springList.push(new Spring(pointList[i], pointList[normalize(i - partner / 2)]));

        // beams 4 (short)
        springList.push(new Spring(pointList[i], pointList[normalize(i - partner / 4)]));
    }

    function normalize(s) {

        s = Math.floor(s);
        if (s < 0) return s + segments;
        if (s > segments - 1) return s - segments;
        return s;
    }

    // add the center Point and connect it to the outer ring
    pointList.push(new Point(posX, posY));

    for (i = 0; i < segments; i++) {

        springList.push(new Spring(pointList[i], pointList[segments]));
    }
}


/**
 * Sketchpad - draw()
 */

function draw() {

    // move Blob
    pointList[pointList.length - 1].x += xSpeed;
    pointList[pointList.length - 1].y += ySpeed;

    // update Points
    for (var i = 0; i < pointList.length; i++) {

        pointList[i].refresh();
    }

    // Resolve String constrains X RELAXATION
    for (i = RELAXATION; i > 0; i--) {

        for (var j = 0; j < springList.length; j++) {

            springList[j].contract();
        }
    }

    // clear canvas
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    switch(renderMode){
        case 0:
            renderShape();
            debugDraw();
            break;
        case 1:
            debugDraw();
            break;
        default:
            renderShape();
    }
}


function renderShape() {

    context.lineWidth = 20;
    context.strokeStyle = "#ffffff";
    context.fillStyle = blobColor;

    context.beginPath();
    context.moveTo(pointList[0].x * ratio, pointList[0].y * ratio);

    var x;
    var y;

    for (var i = 1; i < pointList.length - 1; i++) {

        x = pointList[i].x * ratio;
        y = pointList[i].y * ratio;
        context.lineTo(x, y);

        // round values for non GPU accelerated canvases
        // context.lineTo(~~ (0.5 + x), ~~ (0.5 + y));
    }

    context.closePath();
    context.fill();
    //context.stroke();
}


function debugDraw() {

    context.lineWidth = .3;
    context.strokeStyle = "rgba(0, 0, 0, .5)";

    for (var i = 0; i < springList.length; i++) {

        drawLine(springList[i].pointa, springList[i].pointb);
    }

    function drawLine(p1, p2) {
        context.beginPath();
        context.moveTo(p1.x * ratio, p1.y * ratio);
        context.lineTo(p2.x * ratio, p2.y * ratio);
        context.stroke();
        context.closePath();
    }
}