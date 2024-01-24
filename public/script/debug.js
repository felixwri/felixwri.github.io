let averageFramesPerSecond = [];
let currentAverage = 60;
let fps = 0;

function debug() {
    let average = (array) => {
        let sum = array.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        result = sum / array.length || 0;

        return result;
    };

    fps = frameRate();
    averageFramesPerSecond.push(fps);

    if (averageFramesPerSecond.length % 60 === 0 && averageFramesPerSecond.length !== 0) {
        currentAverage = Math.round(average(averageFramesPerSecond));
        console.log(currentAverage);
        averageFramesPerSecond = [];
        if (currentAverage < 40) {
            numberOfParticles = 100;
        }
    }
}

export { debug };
