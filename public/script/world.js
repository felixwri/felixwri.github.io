function worldRenderer() {
    let spriteDimentions = 512;

    tint(200, 200, 200, 100);

    image(sprites.backgroundTwo, -50, windowHeight - spriteDimentions / 2, spriteDimentions * 4, spriteDimentions / 2);

    tint(200, 200, 200, 140);

    image(sprites.backgroundOne, -50, windowHeight - spriteDimentions * 1.5, spriteDimentions * 4, spriteDimentions * 1.5);

    tint(200, 200, 200, 200);

    image(sprites.birchTwo, 100, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    tint(200, 200, 200, 255);

    image(sprites.birchOne, 550, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    tint(255, 255);

    // smokeOne.update();

    image(sprites.lamp, 550, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    image(sprites.firOne, -100, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.firOne, 1200, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.firTwo, 700, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.firThree, 400, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    image(sprites.floorOne, 0, windowHeight - spriteDimentions, spriteDimentions * 2, spriteDimentions);
    image(sprites.floorTwo, 800, windowHeight - spriteDimentions, spriteDimentions * 2, spriteDimentions);
    image(sprites.floorOne, 700, windowHeight - spriteDimentions, spriteDimentions * 2, spriteDimentions);
}

const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } });

function changeBackground() {
    console.log('running');
    timeline.fromTo(
        '#defaultCanvas0',
        { backgroundColor: 'rgba(33, 33, 33, 1)' },
        { backgroundColor: 'rgba(33, 33, 33, 0)', duration: 1.5 },
        '+=0.1'
    );
}
