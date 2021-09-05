class Raindrop {
    constructor(initialX, initialY, acceleration, mass) {
        this.x = initialX;
        this.y = initialY;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = acceleration;
        this.mass = mass;
        this.lifespan = 180;
        this.reAcceleration = acceleration;

        this.collision;
    }

    init() {
        this.collision = allCollisions(this.x, this.y);
        if (!this.collision) console.error('no collisions is impossible');
    }

    update() {
        if (this.collision.y <= this.y && this.collision.object.x1 < this.x && this.collision.object.x2 > this.x) {
            let choice = Math.random();
            if (choice < 0.5) {
                let vel = {
                    x: random(-1, 1),
                    y: random(-2, -0.5)
                };
                this.velocity.y = vel.y;
                this.velocity.x = vel.x;
            } else if (choice > 0.9 && sprays.length < 250) {
                sprays.push(new Spray(this.x, this.y, { x: random(-2, 2), y: random(-2, -0.2) }));
            } else {
                this.lifespan = -1;
            }
        }

        if (this.velocity.y < 9.81) {
            this.velocity.x = this.velocity.x + this.acceleration.x;
            this.velocity.y = this.velocity.y + this.acceleration.y;
        }

        let oldX = this.x;
        let oldY = this.y;

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        line(this.x, this.y, oldX, oldY);

        this.lifespan--;
    }

    killCheck() {
        if (this.y > windowHeight || this.x > windowWidth) {
            this.x = random(0, windowWidth);
            this.y = 0;
            this.velocity = { x: 0, y: 0 };
            this.acceleration = this.reAcceleration;
            this.lifespan = 180;
            this.init();
        } else {
            if (this.lifespan < 0) {
                this.x = random(0, windowWidth);
                this.y = 0;
                this.velocity = { x: 0, y: 0 };
                this.acceleration = this.reAcceleration;
                this.lifespan = 180;
                this.init();
            }
            return;
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

class Smoke {
    constructor(x, y, width, height, velocity, sprite) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.sprite = sprite;

        this.width = width;
        this.height = height;
    }

    update() {
        this.x += this.velocity.x;
        this.y += (noise(this.y) - 0.5) / 2;

        image(this.sprite, this.x, this.y - this.height, this.width, this.height);

        if (this.y > windowHeight) {
            this.y = windowHeight - 100;
        } else if (this.x > windowWidth || this.x < -200) {
            this.x = 100;
        }
    }
}

class Sun {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rise = 0;
    }
    update(amount) {
        tint(255, 230, 230, this.rise);
        image(sprites.sun, this.x, this.y, 256, 256);

        if (amount === 1) {
            if (this.rise < 255) this.rise += amount;
        } else {
            if (this.rise > 0) this.rise += amount;
        }
    }
}

class Moon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rise = 0;
    }
    update(amount) {
        tint(255, 230, 230, this.rise);
        image(sprites.moon, this.x, this.y, 128, 128);

        if (amount === 1) {
            if (this.rise < 255) this.rise += amount;
        } else {
            if (this.rise > 0) this.rise += amount;
        }
    }
}

class Snowflake {
    constructor(initialX, initialY, acceleration, mass) {
        this.x = initialX;
        this.y = initialY;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = acceleration;
        this.mass = mass;
        this.lifespan = 1250;

        this.collision;
    }

    init() {
        this.collision = allCollisions(this.x, this.y);
        if (!this.collision) console.error('no collisions is impossible');
    }

    update() {
        if (this.collision.y <= this.y && this.collision.object.x1 < this.x && this.collision.object.x2 > this.x && Math.random() > 0.9) {
            this.velocity.y = 0;
            this.acceleration.y = 0;
        }

        if (this.velocity.y < 2 * (1 + this.mass)) {
            this.velocity.x = this.velocity.x + this.acceleration.x;
            this.velocity.y = this.velocity.y + this.acceleration.y;
        }

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        // strokeWeight(this.mass);
        fill(255, 255, 255, this.lifespan);
        circle(this.x, this.y, this.mass * 30);
        this.lifespan--;
    }

    killCheck() {
        if (this.lifespan < 0 || this.y > windowHeight || this.x > windowWidth) {
            this.x = random(0, windowWidth);
            this.y = -30;
            this.velocity = { x: 0, y: random(0, 0.1) };
            this.acceleration = { x: 0, y: this.mass / 50 };
            this.lifespan = random(1000, 2000);
            this.init();
        }
        return;
    }
}

class Firefly {
    constructor(initialX, initialY, zLevel) {
        this.x = initialX;
        this.y = initialY;
        this.velocity = { x: random(-0.1, 0.1), y: random(-0.1, 0.1) };
        this.zLevel = zLevel;

        this.lifespan = 0;

        this.size = random([16, 24, 32]);
    }

    update(zLevel) {
        if (this.zLevel !== zLevel) return;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        if (Math.random() > 0.999) {
            this.velocity = { x: random(-0.1, 0.1), y: random(-0.1, 0.1) };
        }

        if (this.lifespan < 255) {
            this.lifespan++;
        }

        tint(255, 255, 255, this.lifespan);

        if (isMobile) {
            smooth();
            image(sprites.firefly, this.x * (spriteDimentions / 256), this.y, spriteDimentions / this.size, spriteDimentions / this.size);
        } else {
            smooth();
            image(sprites.firefly, this.x * (spriteDimentions / 512), this.y, spriteDimentions / this.size, spriteDimentions / this.size);
        }
    }
}

function reflection(collisionLine, collisionPoint) {
    // calculate the normal to the collision line
    let dx = collisionLine.x2 - collisionLine.x1;
    let dy = collisionLine.y2 - collisionLine.y1;

    let normal = {
        x1: -dy + collisionPoint.x,
        y1: dx + collisionPoint.y,
        x2: dy + collisionPoint.x,
        y2: -dx + collisionPoint.y
    };
    line(normal.x1, normal.y1, normal.x2, normal.y2);

    let p0 = collisionPoint;

    let x0 = normal.x1;
    let y0 = normal.y1;

    let x1 = normal.x2;
    let y1 = normal.y2;

    dx = x1 - x0;
    dy = y1 - y0;

    let a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
    let b = (2 * dx * dy) / (dx * dx + dy * dy);

    let x2 = Math.round(a * (p0.x - x0) + b * (p0.y - y0) + x0);
    let y2 = Math.round(b * (p0.x - x0) - a * (p0.y - y0) + y0);

    let p1 = {
        x: x2,
        y: y2
    };

    line(p0.x, p0.y, p1.x, p1.y);

    let velocity = {
        x: p1.x - p0.x,
        y: -(p1.y - p0.y)
    };
    // console.log(velocity);
    return velocity;
}

function allCollisions(x, y) {
    let trajectory = {
        x1: x,
        y1: y,
        x2: x,
        y2: windowHeight + 20
    };

    for (let i = 0; i < objects.length; i++) {
        let collision = raycaster(trajectory, objects[i]);
        if (collision !== false) return collision;
    }

    console.error('no collision');
    return false;
}

//* 54.769
//* 71.985

function raycaster(lineOne, lineTwo) {
    const x1 = lineOne.x1;
    const y1 = lineOne.y1;
    const x2 = lineOne.x2;
    const y2 = lineOne.y2;

    const x3 = lineTwo.x1;
    const y3 = lineTwo.y1;
    const x4 = lineTwo.x2;
    const y4 = lineTwo.y2;

    // line(x1, y1, x2, y2);
    // line(x3, y3, x4, y4);

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
        return false;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
        const pt = {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1),
            path: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            },
            object: {
                x1: x3,
                y1: y3,
                x2: x4,
                y2: y4
            }
        };

        if (x3 < pt.x && pt.x < x4) {
            return pt;
        }

        return false;
    } else {
        return false;
    }
}
