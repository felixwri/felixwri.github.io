class State {
    constructor() {
        this.app = null;
        this.scaleFactor = null;
        this.worldHeight = 100;
        this.assetHeight = 128;
        this.aspectRatio = this.worldHeight / this.assetHeight;
    }

    init(app) {
        this.app = app;
        this.scale();
    }

    scale(virtualHeight = this.worldHeight) {
        this.scaleFactor = window.innerHeight / virtualHeight;
        this.app.stage.scale = { x: this.scaleFactor, y: this.scaleFactor };
    }

    get height() {
        return window.innerHeight / this.scaleFactor;
    }

    get width() {
        return window.innerWidth / this.scaleFactor;
    }
}

let state = new State();

export { state };
