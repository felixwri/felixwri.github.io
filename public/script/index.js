let raindrops = [];
let sprays = [];
let objects = [];
let sprites = {};

// let windowWidth = globalThis.window.outerWidth;
// let windowHeight = globalThis.window.outerHeight;
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    // let canvas = createCanvas(globalThis.window.outerWidth, globalThis.window.outerHeight);
    canvas.parent('canvas-container');
    canvas.style('z-index', -1);
    objects = createObjects();
}

function windowResized() {
    // windowWidth = globalThis.window.outerWidth;
    // windowHeight = globalThis.window.outerHeight;

    objects = createObjects();

    resizeCanvas(windowWidth, windowHeight, true);

    // console.log(windowWidth, windowHeight, globalThis.window.outerWidth, globalThis.window.outerHeight);
}

function draw() {
    background('hsl(0, 0%, 13%)');
    noSmooth();

    let fps = frameRate();
    fill(255);
    stroke(0);

    worldRenderer();

    text('FPS: ' + fps.toFixed(2), 20, 20);
    // text(`${mouseX} ${mouseY}`, windowWidth / 2, windowHeight / 2);

    fill(100, 100, 255);
    stroke(100, 100, 255);

    if (raindrops.length < 500) {
        for (let i = 0; i < 5; i++) {
            let mass = random(1, 4);
            raindrops.push(new Raindrop(random(0, windowWidth), 0, { x: 0, y: mass / 20 }, mass));
        }
    }

    for (let i = raindrops.length - 1; i >= 0; i--) {
        allCollisions(raindrops[i]);
        raindrops[i].update();
        if (raindrops[i].killCheck()) {
            const index = raindrops.indexOf(raindrops[i]);
            if (index > -1) {
                raindrops.splice(index, 1);
            }
        }
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

    // frameRate(60);
}

function allCollisions(raindrop) {
    for (let i = 0; i < objects.length; i++) {
        raindrop.collisionTest(objects[i]);

        // line(objects[i].a.x, objects[i].a.y, objects[i].b.x, objects[i].b.y);
    }
}

function createObjects() {
    let objects = [];

    let titleBoundary = document.querySelector('#welcome').getBoundingClientRect();
    let titleObj = {
        left: titleBoundary.x,
        top: titleBoundary.y + 15,
        right: titleBoundary.x + titleBoundary.width,
        bottom: titleBoundary.y + titleBoundary.height
    };

    let floor = {
        left: 0,
        top: windowHeight - 5,
        right: windowWidth,
        bottom: windowHeight
    };

    objects.push(titleObj);
    objects.push(floor);
    return objects;
}

class Raindrop {
    constructor(initialX, initialY, acceleration, mass) {
        this.x = initialX;
        this.y = initialY;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = acceleration;
        this.mass = mass;
        this.lifespan = 180;
    }

    update() {
        if (this.velocity.y < 9.81) {
            this.velocity.x = this.velocity.x + this.acceleration.x;
            this.velocity.y = this.velocity.y + this.acceleration.y;
        }

        let oldX = this.x;
        let oldY = this.y;

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        strokeWeight(this.mass);
        line(this.x, this.y, oldX, oldY);
        this.lifespan--;
    }

    collisionTest(object) {
        if (this.x > object.left && this.x < object.right && this.y > object.top && this.y < object.bottom) {
            this.velocity.y = random(-3, -1);
            this.velocity.x = random(-2, 2);

            if (Math.random() > 0.9 && sprays.length < 300) {
                sprays.push(new Spray(this.x, this.y, this.velocity));
            }
        }
    }

    killCheck() {
        if (this.y > windowHeight || this.x > windowWidth) {
            return true;
        } else {
            if (this.lifespan < 0) {
                return true;
            }
            return false;
        }
    }
}

class Spray {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;

        this.mass = random(10, 30);

        this.lifespan = 100;
    }

    update() {
        this.x = this.x + this.velocity.x / 2;
        this.y = this.y + this.velocity.y / 2;

        fill(100, 100, 255, this.lifespan / 4);
        noStroke();
        circle(this.x, this.y, this.mass);

        this.lifespan--;
    }

    isExpired() {
        if (this.lifespan <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
