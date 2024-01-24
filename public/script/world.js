import * as PIXI from './pixi.js';
import { state } from './state.js';

export class World {
    constructor(app) {
        this.app = app;

        this.addScenery();
    }
    getSprite(url) {
        let sprite = PIXI.Sprite.from(url);
        sprite.anchor.set(0, 1);

        sprite.x = 0;
        sprite.y = state.height;
        return sprite;
    }

    createGradTexture() {
        const quality = 512;
        const canvas = document.createElement('canvas');

        canvas.width = quality;
        canvas.height = 1;

        const ctx = canvas.getContext('2d');
        const grd = ctx.createLinearGradient(0, 0, quality, 0);

        grd.addColorStop(0, 'rgb(255,255,255)');
        grd.addColorStop(0.5, 'rgb(100, 100, 100)');
        grd.addColorStop(1, 'rgb(10, 10, 10)');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, quality, 1);
        let gradient = new PIXI.Sprite(PIXI.Texture.from(canvas));

        gradient.anchor.set(0.5, 0.5);
        gradient.x = state.width / 2;
        gradient.y = state.height / 2;
        gradient.width = state.height;
        gradient.height = state.width;
        gradient.rotation = Math.PI / 2;
        return gradient;
    }

    recalculate() {
        this.gradient.x = state.width / 2;
        this.gradient.y = state.height / 2;
        this.gradient.width = state.height;
        this.gradient.height = state.width;
    }

    addScenery() {
        this.gradient = this.createGradTexture();
        let backgroundFar = this.getSprite('/public/img/backgroundMaster.png');
        backgroundFar.x = 20;
        backgroundFar.alpha = 0.3;

        let background = this.getSprite('/public/img/backgroundMaster.png');
        background.alpha = 0.8;
        background.x = -20;
        let foreground = this.getSprite('/public/img/foregroundMaster.png');
        foreground.x = -20;
        let dark = this.getSprite('/public/img/sceneOff.png');
        let light = this.getSprite('/public/img/sceneOn.png');
        dark.x = 10;
        light.x = 10;

        this.app.stage.addChild(this.gradient);
        this.app.stage.addChild(backgroundFar);
        this.app.stage.addChild(background);
        this.app.stage.addChild(foreground);
        this.app.stage.addChild(dark);
        // this.app.stage.addChild(light);
    }
}
