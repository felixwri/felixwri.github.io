let secondAverageFramesPerSecond = [];
let minuteAverageFramesPerSecond = [];
let performanceReport = {};
let fps = 0;

function debug() {
    let average = (array) => {
        let sum = array.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        result = sum / array.length || 0;

        return result;
    };

    fps = frameRate();
    secondAverageFramesPerSecond.push(fps);

    if (minuteAverageFramesPerSecond.length % 60 === 0 && minuteAverageFramesPerSecond.length !== 0) {
        // console.clear();
        performanceReport.averageMinute = average(minuteAverageFramesPerSecond);
        console.log(`MINUTE REPORT\nRecent Minute: ${performanceReport.averageMinute}\n`);
        minuteAverageFramesPerSecond = [];
    }

    if (secondAverageFramesPerSecond.length % 60 === 0 && secondAverageFramesPerSecond.length !== 0) {
        performanceReport.averageSecond = average(secondAverageFramesPerSecond);
        minuteAverageFramesPerSecond.push(performanceReport.averageSecond);
        secondAverageFramesPerSecond = [];
    }

    if (
        secondAverageFramesPerSecond.length % 60 === 0 &&
        minuteAverageFramesPerSecond.length % 10 === 0 &&
        minuteAverageFramesPerSecond.length !== 0
    ) {
        performanceReport.averageMinute = average(minuteAverageFramesPerSecond);
        console.log(`Current Average: ${performanceReport.averageMinute}\n`);
    }
    // fill(255);
    // stroke(0);
    // text(`Average FPS: ${previousAverageFrames} `, 20, 20);
    // text(`${mouseX} ${mouseY}`, windowWidth / 3, windowHeight / 3);
}
