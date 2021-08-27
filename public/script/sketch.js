//? PARTICLE ARRAYS
let raindrops = [];
let sprays = [];

//? OBJECT ARRAYS
let objects = [];
let sprites = {};
let smokeOne;

//? Other Global Variables
backgroundAlpha = 255;

function preload() {
    sprites.smokeOne = loadImage(`public/img/smokeOne.png`);
    sprites.smokeTwo = loadImage(`public/img/smokeTwo.png`);

    sprites.backgroundOne = loadImage(`public/img/backgroundOne.png`);
    sprites.backgroundTwo = loadImage(`public/img/backgroundTwo.png`);

    sprites.floorOne = loadImage(`public/img/floorOne.png`);
    sprites.floorTwo = loadImage(`public/img/floorTwo.png`);
    sprites.lamp = loadImage(`public/img/lamp.png`);

    sprites.firOne = loadImage(`public/img/firOne.png`);
    sprites.firTwo = loadImage(`public/img/firTwo.png`);
    sprites.firThree = loadImage(`public/img/firThree.png`);

    sprites.birchOne = loadImage(`public/img/birchOne.png`);
    sprites.birchTwo = loadImage(`public/img/birchTwo.png`);

    sprites.firOneSkeleton = loadImage(`public/img/firOneSkeleton.png`);
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    canvas.style('z-index', -1);
    objects = createObjects();
    smokeOne = new Smoke(0, windowHeight, 256, 256, { x: 0.2, y: 0.1 }, sprites.smokeOne);
    changeBackground();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    objects = createObjects();
}

function draw() {
    clear();
    debug();
    noSmooth();
    worldRenderer();

    fill(100, 100, 255);
    stroke(100, 100, 255);

    strokeWeight(2);

    drawRaindrops();
    // drawHitboxes();
}

function drawRaindrops() {
    if (raindrops.length < 2400) {
        for (let i = 0; i < 2; i++) {
            let mass = random(1, 4);
            let newRaindrop = new Raindrop(random(0, windowWidth), 0, { x: 0, y: mass / 20 }, mass);
            newRaindrop.init();
            raindrops.push(newRaindrop);
        }
    }

    // noLoop();

    for (let i = raindrops.length - 1; i >= 0; i--) {
        // allCollisions(raindrops[i]);
        raindrops[i].update();
        raindrops[i].killCheck();
    }

    for (let i = sprays.length - 1; i >= 0; i--) {
        sprays[i].update();
        if (sprays[i].isExpired()) {
            const index = sprays.indexOf(sprays[i]);
            if (index > -1) {
                sprays.splice(index, 1);
            }
        }
    }
}

function drawHitboxes() {
    for (let i = 0; i < objects.length; i++) {
        strokeWeight(2);
        stroke(200, 60, 60);
        line(objects[i].x1, objects[i].y1, objects[i].x2, objects[i].y2);
    }
}

function mousePressed() {
    console.log(mouseX, mouseY);
}

function createObjects() {
    let objects = [];

    let titleBoundary = document.querySelector('#welcome').getBoundingClientRect();
    let titleObj = {
        x1: titleBoundary.x,
        y1: titleBoundary.y + titleBoundary.height / 4,
        x2: titleBoundary.x + titleBoundary.width,
        y2: titleBoundary.y + titleBoundary.height / 4
    };

    let treeOneLeftTwo = {
        x1: 1341,
        y1: windowHeight - 380,
        x2: 1377,
        y2: windowHeight - 395
    };

    let treeOneLeft = {
        x1: 1376,
        y1: windowHeight - 440,
        x2: 1444,
        y2: windowHeight - 510
    };

    let treeOneCenter = {
        x1: 1443,
        y1: windowHeight - 510,
        x2: 1524,
        y2: windowHeight - 440
    };

    let treeOneRight = {
        x1: 1521,
        y1: windowHeight - 400,
        x2: 1561,
        y2: windowHeight - 380
    };

    let treeTwoLeftTwo = {
        x1: 831,
        y1: windowHeight - 287,
        x2: 891,
        y2: windowHeight - 385
    };

    let treeTwoLeft = {
        x1: 878,
        y1: windowHeight - 420,
        x2: 954,
        y2: windowHeight - 506
    };

    let treeTwoCenter = {
        x1: 952,
        y1: windowHeight - 506,
        x2: 1043,
        y2: windowHeight - 390
    };

    let treeTwoRight = {
        x1: 1045,
        y1: windowHeight - 360,
        x2: 1091,
        y2: windowHeight - 350
    };

    let treeThreeRight = {
        x1: 582,
        y1: windowHeight - 331,
        x2: 651,
        y2: windowHeight - 416
    };

    let treeThreeCenter = {
        x1: 648,
        y1: windowHeight - 417,
        x2: 734,
        y2: windowHeight - 317
    };

    let floor = {
        x1: 0,
        y1: windowHeight - 10,
        x2: windowWidth,
        y2: windowHeight - 10
    };

    //? Height Order

    objects.push(titleObj);

    objects.push(treeThreeRight);
    objects.push(treeThreeCenter);

    objects.push(treeTwoRight);
    objects.push(treeTwoCenter);
    objects.push(treeTwoLeft);
    objects.push(treeTwoLeftTwo);

    objects.push(treeOneLeft);
    objects.push(treeOneLeftTwo);
    objects.push(treeOneCenter);
    objects.push(treeOneRight);

    objects.push(floor);
    return objects;
}
