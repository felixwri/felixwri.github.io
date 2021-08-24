function worldRenderer() {
    let spriteDimentions = 512;

    tint(33, 33, 33, 50);

    image(sprites.farOne, 100, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.farOne, 612, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.farOne, 1124, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.farOne, 1636, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    tint(33, 33, 33, 100);

    image(sprites.backgroundOne, 0, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.backgroundTwo, 512, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.backgroundOne, 1024, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.backgroundTwo, 1536, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);

    tint(33, 33, 33, 255);

    image(sprites.treeOne, 0, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.treeTwo, 400, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.bushOne, 0, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.bushOne, 900, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
    image(sprites.bushOne, 1200, windowHeight - spriteDimentions, spriteDimentions, spriteDimentions);
}
