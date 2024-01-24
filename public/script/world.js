import * as PIXI from './pixi.js';
export function buildWorld(app) {
    function getSprite(url) {
        let sprite = PIXI.Sprite.from(url);
        sprite.anchor.set(0, 1);

        sprite.x = 0;
        sprite.y = 128;
        return sprite;
    }

    function createGradTexture() {
        const quality = 512;
        const canvas = document.createElement('canvas');

        canvas.width = quality;
        canvas.height = 1;

        const ctx = canvas.getContext('2d');
        const grd = ctx.createLinearGradient(0, 0, quality, 0);

        grd.addColorStop(0, 'rgb(105, 112, 125)');
        grd.addColorStop(1, 'rgb(36, 36, 36)');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, quality, 1);
        let gradient = new PIXI.Sprite(PIXI.Texture.from(canvas));

        gradient.anchor.set(0.5, 0.5);
        gradient.x = virtualWidth / 2;
        gradient.y = 64;
        gradient.width = 128;
        gradient.height = virtualWidth;
        gradient.rotation = Math.PI / 2;
        return gradient;
    }

    const virtualWidth = window.innerWidth / app.stage.scaleFactor;

    let gradient = createGradTexture();

    let background = getSprite('/public/img/backgroundMaster.png');
    let foreground = getSprite('/public/img/foregroundMaster.png');
    let dark = getSprite('/public/img/sceneOff.png');
    let light = getSprite('/public/img/sceneOn.png');

    app.stage.addChild(gradient);
    app.stage.addChild(background);
    app.stage.addChild(foreground);
    app.stage.addChild(dark);
    app.stage.addChild(light);
}
