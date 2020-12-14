const states = ['Unknown', 'started', 'stopped', 'paused', 'idle', 'busy'];

const _startFn = async function () {
    try {
        // if (this.fnQ.length !== 0) {
        //     const fnFromQ = this.fnQ.shift();
        // }
        await this.fn();
    } catch (err) {

    }
};

class Monitor {
    /**
     * 
     * @param {*} fn
     * @param {*} poll_interval
     * @param {*} options
     */
    constructor(fn, poll_interval, options) {
        this.fnQ = [];
        this.state = states[0];
        this.fn = fn;
        this.poll_interval = poll_interval * 1000;
        this.interval = null;
        //TODO: Utilize options
    }

    _processQ() {

    }

    start() {
        this.state = states[1];
        this.interval = setInterval(_startFn.bind(this), this.poll_interval);
    }

    pause() {
        this.state = states[3];
    }

    changeInterval(newInterval) {
        if (newInterval !== this.poll_interval) {
            this.poll_interval = newInterval;
        }
    }

    shutdown() {
        console.log(`Shutting down the monitor...`);
        this.state = states[2];
        clearInterval(this.interval);
    }
}

/* ------------------- USAGE ----------------------*/
function apple() {
    console.log('hello');
}

function appleProm() {
    return new Promise((resolve) => setTimeout(resolve, 5000));
}

const myMonitor = new Monitor(apple, 2);
myMonitor.start();
setTimeout(() => {
    myMonitor.shutdown();
}, 20000);


module.exports = Monitor;
