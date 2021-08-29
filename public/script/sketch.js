//? PARTICLE ARRAYS
let raindrops = [];
let snowflakes = [];
let sprays = [];

//? OBJECT ARRAYS
let objects = [];
let sprites = {};
let sun;

//? Other Global Variables
let globalFog = { r: 200, g: 200, b: 200, a: 255 };
let nextFog = { r: 200, g: 200, b: 200, a: 255 };
let weatherType = Math.round(Math.random() * 3);
let particleLimit = 2000;
let numberOfParticles;
let backgroundAlpha = 255;

function preload() {
    sprites.sun = loadImage(`public/img/sun.png`);

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
    sun = new Sun(1000, 120);

    getNumberOfParticles();

    weather();
    transitionEnd();
}

function weather() {
    let body = document.getElementsByTagName('body')[0];
    switch (weatherType) {
        case 0:
            //Sun
            nextFog = { r: 255, g: 255, b: 255, a: 255 };
            body.style.background = 'linear-gradient(hsl(224, 82%, 57%), hsl(22, 50%, 44%)) fixed';
            break;

        case 1:
            //Rain
            nextFog = { r: 150, g: 150, b: 200, a: 200 };
            body.style.background = 'linear-gradient(hsl(221, 25%, 24%), hsl(230, 10%, 5%)) fixed';
            break;

        case 2:
            //Snow
            nextFog = { r: 255, g: 255, b: 255, a: 160 };
            body.style.background = 'linear-gradient(hsl(225, 26%, 45%), hsl(0, 0%, 45%)) fixed';
            break;

        case 3:
            //Night
            nextFog = { r: 60, g: 60, b: 60, a: 200 };
            body.style.background = 'linear-gradient(hsl(221, 25%, 12%), hsl(0, 0%, 0%)) fixed';
            break;

        default:
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    objects = createObjects();
    getNumberOfParticles();
}

function getNumberOfParticles() {
    if (windowWidth + 100 < particleLimit) {
        numberOfParticles = windowWidth + 100;
    } else {
        numberOfParticles = particleLimit;
    }
}

function fogTransition(nextFog) {
    if (globalFog.r !== nextFog.r) {
        if (globalFog.r < nextFog.r) {
            globalFog.r++;
        } else {
            globalFog.r--;
        }
    }

    if (globalFog.g !== nextFog.g) {
        if (globalFog.g < nextFog.g) {
            globalFog.g++;
        } else {
            globalFog.g--;
        }
    }

    if (globalFog.b !== nextFog.b) {
        if (globalFog.b < nextFog.b) {
            globalFog.b++;
        } else {
            globalFog.b--;
        }
    }

    if (globalFog.a !== nextFog.a) {
        if (globalFog.a < nextFog.a) {
            globalFog.a++;
        } else {
            globalFog.a--;
        }
    }
}

// setInterval(() => {
//     document.getElementById('quantity-display').textContent = raindrops.length;
// }, 500);

function draw() {
    clear();
    debug();
    noSmooth();

    if (weatherType === 0) {
        sun.update(1);
    } else {
        sun.update(-1);
    }

    worldRenderer();

    if (weatherType === 1) {
        strokeWeight(2);
        fill(100, 100, 255);
        stroke(100, 100, 255);
        drawRaindrops();
    } else if (weatherType === 2) {
        fill(255, 255, 255);
        noStroke();
        drawSnowflakes();
    }

    if (weatherType !== 1) {
        raindrops.pop();
    }
    if (weatherType !== 2) {
        snowflakes.pop();
    }

    fogTransition(nextFog);
    // drawHitboxes();
}

function drawRaindrops() {
    if (raindrops.length < numberOfParticles) {
        for (let i = 0; i < 2; i++) {
            let mass = random(1, 4);
            let newRaindrop = new Raindrop(random(0, windowWidth), 0, { x: 0, y: mass / 20 }, mass);
            newRaindrop.init();
            raindrops.push(newRaindrop);
        }
    } else if (raindrops.length > numberOfParticles) {
        raindrops.pop();
        raindrops.pop();
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

function drawSnowflakes() {
    if (snowflakes.length < numberOfParticles / 2) {
        if (Math.random() > 0.5) {
            let mass = random(0.1, 0.4);
            let newSnowflakes = new Snowflake(random(0, windowWidth), -20, { x: 0, y: mass / 50 }, mass);
            newSnowflakes.init();
            snowflakes.push(newSnowflakes);
        }
    } else if (snowflakes.length > numberOfParticles) {
        snowflakes.pop();
        snowflakes.pop();
    }

    // noLoop();

    for (let i = snowflakes.length - 1; i >= 0; i--) {
        // allCollisions(raindrops[i]);
        snowflakes[i].update();
        snowflakes[i].killCheck();
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

    let treeThreeLeft = {
        x1: 582,
        y1: windowHeight - 350,
        x2: 651,
        y2: windowHeight - 425
    };

    let treeThreeCenter = {
        x1: 648,
        y1: windowHeight - 425,
        x2: 734,
        y2: windowHeight - 320
    };

    let floor = {
        x1: 0,
        y1: windowHeight - 10,
        x2: windowWidth,
        y2: windowHeight - 10
    };

    //? Height Order

    objects.push(titleObj);

    objects.push(treeThreeLeft);
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
