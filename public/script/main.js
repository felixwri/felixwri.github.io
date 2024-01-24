import * as PIXI from './pixi.js';
import { state } from './state.js';
import { World } from './world.js';
import { SnowShower } from './classes.js';
const app = new PIXI.Application({ resizeTo: window });
document.getElementById('canvas-container').appendChild(app.view);

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

app.renderer.background.color = 0x333333;

state.init(app);

let world = new World(app);
let snow = new SnowShower(app);

app.ticker.add((delta) => {
    snow.update(delta);
});

document.documentElement.style.setProperty('--welcome-color', 'rgb(128, 128, 128)');

window.addEventListener('click', (e) => {
    let x = Math.round(e.clientX / state.scaleFactor);
    let y = Math.round(e.clientY / state.scaleFactor);

    console.log(x, y);
});

window.addEventListener('resize', (e) => {
    state.scale();
    snow.recalculate();
    world.recalculate();
});
