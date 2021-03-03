const states = ['Init', 'started', 'stopped', 'paused', 'idle', 'busy'];
/*                 0       1          2           3        4       5     */

/* Private methods */
const _fnExec = async function () {
    this.state = states[5];
    const result = await this.fn();
    this.cb(result);
    this.state = states[4];
}

const _processQ = async function () {
    if (this.fnQ.length !== 0) {
        console.log('Processing queue elements');
        this.fnQ.shift();
        await _fnExec.call(this);
    }
}

const _startFn = async function () {
    try {
        if (this.state === states[5]) {
            console.log('Monitor is busy, so queuing the request');
            this.fnQ.push(this.place_holder);
            return true;
        }
        await _fnExec.call(this);
        await _processQ.call(this); // Check for previous pending functions
    } catch (err) {
        console.log('Error occured in the monitor: ', err);
        this.shutdown(true);
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
        this.place_holder = 'FN';
        this.cb = function () { };
        if (options && options.cb && typeof options.cb === 'function') {
            this.cb = options.cb;
        }
    }

    start() {
        this.state = states[1];
        this.interval = setInterval(async () => await _startFn.call(this), this.poll_interval);
    }

    pause() {
        console.log(`Pausing the monitor...`);
        this.state = states[3];
        clearInterval(this.interval);
    }

    resume() {
        console.log(`Resuming the monitor...`);
        this.start();
    }

    changeInterval(newInterval) {
        if (newInterval !== this.poll_interval) {
            clearInterval(this.interval);
            this.poll_interval = newInterval;
            this.interval = setInterval(_startFn.bind(this), this.poll_interval);
        }
    }

    async shutdown(force = false) {
        try {
            clearInterval(this.interval);
            console.log(`${!force ? 'Gracefully ' : ''}Shutting down the monitor... ${this.fnQ}`);
            while (!force && this.fnQ.length !== 0) {
                this.fnQ.shift();
                await _fnExec.call(this);
            }
            this.state = states[2];
            this.fnQ = [];
        } catch (e) {
            console.log(`Error occured while shutting down the monitor: ${e}`);
        }
    }
}


/* ------------------- USAGE ----------------------*/
// function apple() {
//     console.log('hello');
// }

// function appleProm() {
//     return new Promise((resolve) => setTimeout(() => {
//         console.log('Inside apple prom');
//         resolve('Bonjour');
//     }, 5000));
// }

// // const myMonitor = new Monitor(apple, 2, {
// const myMonitor = new Monitor(appleProm, 2, {
//     cb: (data) => {
//         console.log('Callback called with data: ', data);
//     }
// });

// myMonitor.start();
// setTimeout(async () => {
//     await myMonitor.shutdown();
// }, 20000);


module.exports = Monitor;
