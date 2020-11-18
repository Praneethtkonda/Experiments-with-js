const fetch = require('node-fetch');
const stateEnum = ['started', 'stopped', 'paused', 'resumed'];

/**
 * This is a http long polling client.
 * It takes url as a parameter.
 * USAGE:-
 * ------
 * const poll_client = new PollClient('http://127.0.0.1/your_url');
 * Starting the poll client => poll_client.start();
 * To pause the poll client => poll_client.pause();
 * Resuming the poll client => poll_client.resume();
 * Stopping the poll client => poll_client.stop();
 */
class PollClient {
    constructor(url, options) {
        this.url = url;
        this.state = null;
        this.processQ = [];
    }

    // TODO: Add response_cb
    start(response_cb) {
        if (!this.state) {
            this.state = stateEnum[0];
            this._poll();
        }
    }

    stop() {
        console.log('Stopping the poll client..');
        this.state = stateEnum[1];
    }

    pause() {
        console.log('Resuming the poll client..');
        this.state = stateEnum[2];
    }

    resume() {
        console.log('Resuming the poll client..');
        this.state = stateEnum[3];
        this._poll();
    }

    async _poll() {
        if (this.state === stateEnum[1]) { // stop
            console.log('Stopped the poll client..');
            return;
        }
        else if (this.state === stateEnum[2]) { // pause
            const pauseInterval = setInterval(() => {
                if (this.state !== stateEnum[2]) {
                    this.state = stateEnum[3];
                    clearInterval(pauseInterval);
                } else {
                    console.log('Poll client still paused :)');
                }
            }, 5000);
        } else {
            try {
                const res = await fetch(this.url);
                console.log(`Received response: `, await res.json());
            } catch (err) {
                console.log(`Error occured: ${err.message}`);
            } finally {
                this._poll();
            }
        }
    }
}

module.exports = PollClient;