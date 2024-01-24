import * as Pixi from './pixi.js';
import { state } from './state.js';

class Line {
    constructor(x1, y1, x2, y2, opacity = 1, depth = 0) {
        this.x1 = x1;
        this.y1 = y2;
        this.x2 = x2;
        this.y2 = y2;
        // The chance that the line will stop a thing
        this.opacity = opacity;
        // The variance in the stopping point
        this.depth = depth;
        this.quantity = 0;
    }
}

class Snowflake {
    constructor(sprite, pos, vel, mass) {
        this.initial = {};
        this.initial.y = pos.y;
        this.initial.x = pos.x;
        this.initial.alpha = sprite.alpha;
        this.pos = pos;
        this.vel = vel;
        this.acc = 0.001;
        this.maxVelocity = 0.1 * mass;
        this.finalPos = null;

        this.lifespan = 0;
        this.maxLifespan = 1200 + Math.round(Math.random() * 22000);
        this.sprite = sprite;
    }

    precalculate(lines) {
        let trajectory = {
            x1: this.pos.x,
            y1: this.pos.y,
            x2: this.pos.x,
            y2: 10_000
        };
        let closestPoint = null;
        let closestLine = null;
        for (let line of lines) {
            if (Math.random() > line.opacity) {
                continue;
            }
            let intercept = interceptLines(trajectory, line);
            if (intercept) {
                if (line.depth !== 0) {
                    intercept.y += Math.random() * line.depth;
                }
                if (!closestPoint || intercept.y < closestPoint.y) {
                    closestPoint = intercept;
                    closestLine = line;
                }
            }
        }
        if (closestPoint === null) return;
        closestLine.quantity++;
        this.finalPos = closestPoint;
    }

    reset() {
        this.pos.x = Math.random() * state.width;
        this.pos.y = this.initial.y;
        this.acc = 0.001;
        this.maxVelocity = 0.1 * this.initial.mass;
        this.lifespan = 0;
        this.sprite.alpha = this.initial.alpha;
    }

    fadout() {
        if (this.sprite.alpha > 0) {
            this.sprite.alpha -= 0.001;
        } else {
            this.reset();
        }
    }

    update(delta) {
        this.lifespan++;
        if (this.lifespan > this.maxLifespan) {
            this.fadout();
        }
        if (this.finalPos) {
            if (this.pos.y > this.finalPos.y) {
                this.pos.y = this.finalPos.y;
                return;
            }
        }
        // console.log(this.pos.y);
        // console.log(this.finalPos);
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;

        this.pos.x += this.vel.x * delta;
        this.pos.y += this.vel.y * delta;

        if (this.vel.y < this.maxVelocity) {
            this.vel.y += this.acc * delta;
        }
    }
}

function interceptLines(line, lineTwo) {
    let v1, v2, v3, u;
    v1 = {};
    v2 = {};
    v3 = {};
    v1.x = line.x2 - line.x1; // vector of line
    v1.y = line.y2 - line.y1;
    v2.x = lineTwo.x2 - lineTwo.x1; //vector of line2
    v2.y = lineTwo.y2 - lineTwo.y1;
    let c = v1.x * v2.y - v1.y * v2.x; // cross of the two vectors
    if (c !== 0) {
        let lambda = ((lineTwo.y2 - lineTwo.y1) * (lineTwo.x2 - line.x1) + (lineTwo.x1 - lineTwo.x2) * (lineTwo.y2 - line.y1)) / c;
        let gamma = ((line.y1 - line.y2) * (lineTwo.x2 - line.x1) + (line.x2 - line.x1) * (lineTwo.y2 - line.y1)) / c;
        if (!(0 < lambda && lambda < 1 && 0 < gamma && gamma < 1)) return false;

        v3.x = line.x1 - lineTwo.x1;
        v3.y = line.y1 - lineTwo.y1;
        u = (v2.x * v3.y - v2.y * v3.x) / c; // unit distance of intercept point on this line
        return { x: line.x1 + v1.x * u, y: line.y1 + v1.y * u };
    }
    return false;
}

function lineBuilder() {
    const x = (n) => n;
    const y = (n) => n;

    let lines = [
        // ground
        new Line(0, state.height, state.width, state.height, 1, -5),
        new Line(x(21), y(30), x(33), y(30), 0.5, 10)
    ];
    return lines;
}
function displayLines(lines) {
    let graphics = new Pixi.Graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    for (let line of lines) {
        graphics.moveTo(line.x1, line.y1);
        graphics.lineTo(line.x2, line.y2);
    }
    return graphics;
}

export class SnowShower {
    constructor(app) {
        this.limit = state.width * 10;
        this.app = app;
        this.graphics = new Pixi.Graphics();
        this.app.stage.addChild(this.graphics);

        this.snowflakeTexture = Pixi.Texture.from('public/img/snowflake.png');

        this.lines = lineBuilder();
        this.app.stage.addChild(displayLines(this.lines));

        this.snowflakes = [];
        for (let i = 0; i < this.limit; i++) {
            this.spawnSnowflake();
        }
    }

    recalculate() {
        this.limit = state.width * 10;
    }

    spawnSnowflake() {
        const snowflakeSprite = Pixi.Sprite.from(this.snowflakeTexture);

        let distance = Math.random();
        let randomSize = 1 + distance + Math.random();

        snowflakeSprite.width = randomSize;
        snowflakeSprite.height = randomSize;
        snowflakeSprite.tint = 0xffffff;
        snowflakeSprite.alpha = 0.1 + distance;
        snowflakeSprite.anchor.set(0.5);
        snowflakeSprite.rotation = Math.random() * Math.PI * 2;

        this.app.stage.addChild(snowflakeSprite);

        let randomHeight = Math.random() * state.width * 2;
        let randomWidth = Math.random() * state.width;
        let randomVelocity = (0.2 + Math.random() * 1) / 10;
        let randomMass = 0.1 + distance * 0.5 + Math.random() * 0.5;

        let s = new Snowflake(snowflakeSprite, { x: randomWidth, y: -randomHeight }, { x: 0, y: randomVelocity }, randomMass);
        s.precalculate(this.lines);
        s.update(1);
        this.snowflakes.push(s);
    }

    update(delta) {
        this.graphics.clear();
        for (let snowflake of this.snowflakes) {
            snowflake.update(delta);
        }

        if (this.snowflakes.length < this.limit) {
            this.spawnSnowflake();
        }
    }
}
