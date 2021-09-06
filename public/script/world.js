function worldRenderer() {
    const offset = -100;
    tint(globalFog.r, globalFog.g, globalFog.b);
    image(sprites.background, offset, windowHeight - spriteDimentions * 1.5, spriteDimentions * 4, spriteDimentions * 1.5);
    if (!isMobile) {
        image(sprites.background, spriteDimentions * 3 + offset, windowHeight - spriteDimentions * 1.5, spriteDimentions * 4, spriteDimentions * 1.5);

        if (weatherType === 3) {
            drawFireflys(true, false);
            noSmooth();
            tint(globalFog.r, globalFog.g, globalFog.b);
        }
        image(sprites.foreground, offset, windowHeight - spriteDimentions, spriteDimentions * 4, spriteDimentions);
        image(sprites.sceneOff, spriteDimentions / 1.5 + offset, windowHeight - spriteDimentions, spriteDimentions * 3, spriteDimentions);

        tint(255, globalFog.l);

        image(sprites.sceneOn, spriteDimentions / 1.5 + offset, windowHeight - spriteDimentions, spriteDimentions * 3, spriteDimentions);
    } else if (windowWidth > 925) {
        image(sprites.background, spriteDimentions * 3 + offset, windowHeight - spriteDimentions * 1.5, spriteDimentions * 4, spriteDimentions * 1.5);
    }
}

const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } });

function transitionStart(from, to) {
    timeline.fromTo('#defaultCanvas0', { backgroundColor: `${from}` }, { backgroundColor: `${to}`, duration: 0.5 });
}

function transitionEnd(from, to) {
    timeline.fromTo('#defaultCanvas0', { backgroundColor: `${from}` }, { backgroundColor: `${to}`, duration: 0.5 });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
