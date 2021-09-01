//? PARTICLE ARRAYS
let raindrops = [];
let snowflakes = [];
let fireflys = [];
let sprays = [];

//? OBJECT ARRAYS
let objects = [];
let sprites = {};
let sun;
let moon;

//? Other Global Variables
let globalFog = { r: 200, g: 200, b: 200, a: 255, l: 0 };
let nextFog = { r: 200, g: 200, b: 200, a: 255, l: 0 };
let weatherType = 0;
// let weatherType = Math.round(Math.random() * 3);
let particleLimit = 2000;
let numberOfParticles;
let backgroundAlpha = 255;
let spriteDimentions = 512;
let zoomLevel = 512;
const isMobile = 'ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent);

function preload() {
    sprites.sun = loadImage(`public/img/sun.png`);
    sprites.moon = loadImage(`public/img/moon.png`);
    sprites.firefly = loadImage(`public/img/firefly.png`);

    sprites.background = loadImage(`public/img/backgroundMaster.png`);
    sprites.foreground = loadImage(`public/img/foregroundMaster.png`);

    sprites.lampCombindedOff = loadImage(`public/img/lampCombindedOff.png`);
    sprites.lampCombindedOn = loadImage(`public/img/lampCombindedOn.png`);

    sprites.sceneOff = loadImage(`public/img/sceneOff.png`);
    sprites.sceneOn = loadImage(`public/img/sceneOn.png`);
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    canvas.style('z-index', -1);
    if (isMobile) {
        spriteDimentions = 256;
        zoomLevel = 256;
    } else {
        spriteDimentions = 512;
    }
    objects = createObjects();
    sun = new Sun(spriteDimentions, 120);
    moon = new Moon(spriteDimentions, 100);

    getNumberOfParticles();

    weather();
    transitionEnd();
}

function weather() {
    let body = document.getElementsByTagName('body')[0];
    switch (weatherType) {
        case 0:
            //Sun
            nextFog = { r: 255, g: 240, b: 220, l: 0 };
            body.style.background = 'linear-gradient(hsl(224, 60%, 57%), hsl(22, 50%, 44%)) fixed';
            break;

        case 1:
            //Rain
            nextFog = { r: 140, g: 180, b: 180, l: 200 };
            body.style.background = 'linear-gradient(hsl(221, 25%, 24%), hsl(230, 10%, 5%)) fixed';
            break;

        case 2:
            //Snow
            nextFog = { r: 200, g: 200, b: 200, l: 0 };
            body.style.background = 'linear-gradient(hsl(225, 26%, 45%), hsl(0, 0%, 45%)) fixed';
            break;

        case 3:
            //Night
            nextFog = { r: 40, g: 50, b: 60, l: 255 };
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
    if (isMobile) {
        if (windowWidth / 2 < particleLimit) {
            numberOfParticles = windowWidth / 2;
        } else {
            numberOfParticles = particleLimit;
        }
    } else {
        if (windowWidth < particleLimit) {
            numberOfParticles = windowWidth;
        } else {
            numberOfParticles = particleLimit;
        }
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

    if (globalFog.l !== nextFog.l) {
        if (globalFog.l < nextFog.l) {
            globalFog.l++;
        } else {
            globalFog.l--;
        }
    }
}

function draw() {
    clear();
    // debug();
    noSmooth();

    worldRenderer();

    switch (weatherType) {
        //? sun
        case 0:
            sun.update(1);

            strokeWeight(2);
            fill(200, 200, 255);
            stroke(200, 200, 255);
            drawRaindrops(true);

            fill(255, 255, 255);
            noStroke();
            drawSnowflakes(true);

            drawFireflys(false, true);

            moon.update(-1);
            break;
        //? rain
        case 1:
            strokeWeight(2);
            fill(120, 140, 255);
            stroke(120, 140, 255);
            drawRaindrops(false);

            fill(255, 255, 255);
            noStroke();
            drawSnowflakes(true);

            drawFireflys(false, true);

            sun.update(-1);
            moon.update(-1);
            break;
        //? snow
        case 2:
            fill(255, 255, 255);
            noStroke();
            drawSnowflakes(false);

            strokeWeight(2);
            fill(120, 140, 255);
            stroke(120, 140, 255);
            drawRaindrops(true);

            drawFireflys(false, true);

            sun.update(-1);
            moon.update(-1);
            break;
        //? night
        case 3:
            moon.update(1);
            drawFireflys(false, false);

            strokeWeight(2);
            fill(140, 150, 255);
            stroke(140, 150, 255);
            drawRaindrops(true);

            fill(255, 255, 255);
            noStroke();
            drawSnowflakes(true);

            sun.update(-1);
            drawSnowflakes(true);
            break;
        default:
            break;
    }

    fogTransition(nextFog);
    // drawHitboxes();
}

function drawRaindrops(stop) {
    if (raindrops.length < numberOfParticles && !stop) {
        for (let i = 0; i < 2; i++) {
            let mass = random(1, 4);
            let newRaindrop = new Raindrop(random(0, windowWidth), 0, { x: 0, y: mass / 20 }, mass);
            newRaindrop.init();
            raindrops.push(newRaindrop);
        }
    } else if (raindrops.length > numberOfParticles || stop) {
        raindrops.pop();
        raindrops.pop();
    }
    for (let i = raindrops.length - 1; i >= 0; i--) {
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

function drawSnowflakes(stop) {
    if (snowflakes.length < numberOfParticles / 1.5 && !stop) {
        if (Math.random() > 0) {
            let mass = random(0.1, 0.4);
            let newSnowflakes = new Snowflake(random(0, windowWidth), -20, { x: 0, y: mass / 50 }, mass);
            newSnowflakes.init();
            snowflakes.push(newSnowflakes);
        }
    } else if (snowflakes.length > numberOfParticles || stop) {
        snowflakes.pop();
        snowflakes.pop();
    }
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        snowflakes[i].update();
        snowflakes[i].killCheck();
    }
}

function drawFireflys(zLevel, stop) {
    if (isMobile) {
        fireflyAmount = 16;
    } else {
        fireflyAmount = 52;
    }
    if (fireflys.length < fireflyAmount && !stop) {
        if (Math.random() > 0.5) {
            let newFirefly = new Firefly(random(0, windowWidth), random(windowHeight - 400, windowHeight), random([true, false]));
            fireflys.push(newFirefly);
        }
    } else if (stop) {
        fireflys.pop();
    }
    for (let i = fireflys.length - 1; i >= 0; i--) {
        fireflys[i].update(zLevel);
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
    console.log(`%c ${mouseX}  :  ${windowHeight - mouseY}`, 'color: #ff5599');
}

function createObjects() {
    let objects = [];
    let scaler = zoomLevel / 512;

    let titleBoundary = document.querySelector('#welcome').getBoundingClientRect();
    let titleObj = {
        x1: titleBoundary.x,
        y1: titleBoundary.y + titleBoundary.height / 4,
        x2: titleBoundary.x + titleBoundary.width,
        y2: titleBoundary.y + titleBoundary.height / 4
    };
    let floor = {
        x1: 0,
        y1: windowHeight - 10,
        x2: windowWidth,
        y2: windowHeight - 10
    };

    objects.push(titleObj);

    if (isMobile) {
        objects.push(titleObj);
        objects.push(floor);
        return objects;
    }

    //? bustop
    objects.push({
        x1: 1323 * scaler,
        y1: windowHeight - 255 * scaler,
        x2: 1592 * scaler,
        y2: windowHeight - 255 * scaler
    });

    objects.push({
        x1: 733 * scaler,
        y1: windowHeight - 361 * scaler,
        x2: 816 * scaler,
        y2: windowHeight - 481 * scaler
    });

    //? tree 2
    objects.push({
        x1: 691 * scaler,
        y1: windowHeight - 224 * scaler,
        x2: 725 * scaler,
        y2: windowHeight - 256 * scaler
    });

    objects.push({
        x1: 733 * scaler,
        y1: windowHeight - 361 * scaler,
        x2: 816 * scaler,
        y2: windowHeight - 481 * scaler
    });

    objects.push({
        x1: 816 * scaler,
        y1: windowHeight - 482 * scaler,
        x2: 913 * scaler,
        y2: windowHeight - 410 * scaler
    });

    objects.push({
        x1: 915 * scaler,
        y1: windowHeight - 345 * scaler,
        x2: 950 * scaler,
        y2: windowHeight - 319 * scaler
    });

    //? tree 1
    objects.push({
        x1: 376 * scaler,
        y1: windowHeight - 268 * scaler,
        x2: 450 * scaler,
        y2: windowHeight - 375 * scaler
    });

    objects.push({
        x1: 449 * scaler,
        y1: windowHeight - 374 * scaler,
        x2: 555 * scaler,
        y2: windowHeight - 234 * scaler
    });

    objects.push(floor);
    return objects;
}
