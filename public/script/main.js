import * as PIXI from './pixi.js';
import { buildWorld } from './world.js';
import { SnowShower } from './classes.js';
const app = new PIXI.Application({ resizeTo: window });
document.getElementById('canvas-container').appendChild(app.view);

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

app.renderer.background.color = 0x333333;

function scale(virtualHeight = 128) {
    let SCALE_FACTOR = window.innerHeight / virtualHeight;
    app.stage.scaleFactor = SCALE_FACTOR;
    app.stage.scale = { x: app.stage.scaleFactor, y: app.stage.scaleFactor };
}

scale();
buildWorld(app);
let snow = new SnowShower(app);

app.ticker.add(() => {
    snow.update();
});

window.addEventListener('click', (e) => {
    let sf = window.innerHeight / 128;
    console.log(e.clientX / sf, e.clientY / sf);
});
