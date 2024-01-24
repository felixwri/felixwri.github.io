import * as Pixi from './pixi.js';

class Snowflake {
    constructor(sprite, pos, vel, mass) {
        this.pos = pos;
        this.vel = vel;
        this.acc = 0.001;
        this.maxVelocity = 0.1 * mass;
        this.finalPos = null;

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
        for (let line of lines) {
            let intercept = interceptLines(trajectory, line);
            if (intercept) {
                if (!closestPoint || intercept.y < closestPoint.y) {
                    closestPoint = intercept;
                }
            }
        }

        this.finalPos = closestPoint;
    }

    update() {
        // console.log(this.pos.y);
        // console.log(this.finalPos);
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.vel.y < this.maxVelocity) {
            this.vel.y += this.acc;
        }
        if (this.finalPos) {
            if (this.pos.y > this.finalPos.y) {
                this.pos.y = this.finalPos.y;
            }
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

export class SnowShower {
    constructor(app) {
        this.LIMIT = 2000;
        this.app = app;
        this.graphics = new Pixi.Graphics();
        this.app.stage.addChild(this.graphics);

        this.snowflakeTexture = Pixi.Texture.from('public/img/snowflake.webp');

        this.dimensions = {
            width: window.innerWidth / app.stage.scaleFactor,
            height: window.innerHeight / app.stage.scaleFactor
        };

        let ground = {
            x1: 0,
            y1: 126,
            x2: this.dimensions.width,
            y2: 126
        };

        let tree = {
            x1: 20,
            y1: 47,
            x2: 28,
            y2: 47
        };
        let tree2 = {
            x1: 14,
            y1: 56,
            x2: 20,
            y2: 47
        };

        this.lines = [ground, tree, tree2];

        this.snowflakes = [];
        for (let i = 0; i < 2000; i++) {
            this.spawnSnowflake();
        }
    }

    spawnSnowflake() {
        const snowflakeSprite = Pixi.Sprite.from(this.snowflakeTexture);

        let randomSize = 1 + Math.random() * 2;

        snowflakeSprite.width = randomSize;
        snowflakeSprite.height = randomSize;
        snowflakeSprite.tint = 0xffffff;
        snowflakeSprite.alpha = Math.random();
        snowflakeSprite.anchor.set(0.5);
        snowflakeSprite.rotation = Math.random() * Math.PI * 2;

        this.app.stage.addChild(snowflakeSprite);

        let randomHeight = Math.random() * this.dimensions.width * 2;
        let randomWidth = Math.random() * this.dimensions.width;
        let maxVelocity = (0.2 + Math.random() * 1) / 10;
        let randomMass = 0.5 + Math.random();

        let s = new Snowflake(snowflakeSprite, { x: randomWidth, y: -randomHeight }, { x: 0, y: maxVelocity }, randomMass);
        s.precalculate(this.lines);
        this.snowflakes.push(s);
    }

    update() {
        this.graphics.clear();
        for (let snowflake of this.snowflakes) {
            snowflake.update();
        }
    }
}
