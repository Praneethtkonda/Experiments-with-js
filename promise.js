/* TSS's Promise implementation */
const stateEnum = ["Pending", "Fulfilled", "Rejected"];
class TSSPromise {
    constructor(cb) {
        this.state = stateEnum[0];
        this.Q = [];
        this.handleError = () => { };
        cb(this.resolveFn.bind(this), this.rejectFn.bind(this));
    }

    resolveFn(value) {
        console.log(`Inside resolver: ${value}`);
        this.state = stateEnum[1];
        let storedValue = value;
        for (let i = 0; i < this.Q.length; i++) {
            const callback_function = this.Q[i];
            if (typeof storedValue === 'object') {
                const self = this;
                if (storedValue.then) {
                    storedValue.then((ret_value) => {
                        storedValue = callback_function.call(self, ret_value);
                    });
                } else {
                    storedValue = callback_function.call(self, storedValue);
                }
            } else {
                storedValue = callback_function(storedValue);
                console.log('stored_val: ', storedValue);
            }
        }
    }

    rejectFn() {
        this.state = stateEnum[2];
    }

    then(cb) {
        console.log('Initial state', this.state);
        this.Q.push(cb.bind(this));
        return this;
    }

    catch(err_cb) {
        this.handleError = err_cb;
        return this;
    }

    static all(promises) {
        const out = [];
        let completed = 0;
        return new TSSPromise((resolve, reject) => {
            promises.forEach((async_function, index) => {
                async_function().then((data) => {
                    out[index] = data;
                    completed += 1;
                    if (completed === promises.length) {
                        resolve(out);
                    }
                }).catch((err) => reject(err));
            });
        });
    }

    static allSettled(promises) {

    }

    static any(promises) {

    }
}

function async_me() {
    return new TSSPromise((resolve, reject) => {
        setTimeout(() => {
            resolve(2);
        }, 5000);
    });
}

function async_me_3() {
    return new TSSPromise((resolve, reject) => {
        setTimeout(() => {
            resolve(8);
        }, 8000);
    });
}


function sync_function() {
    return 98 + 1;
}

(() => {
    async_me().then((data) => {
        console.log(`Data is: ${data}`);
        return async_me();
    }).then((data) => {
        console.log('Hello world: ', data);
        return 4;
    }).then((data) => {
        console.log('Goodnight folks!! ', data);
    });

    TSSPromise.all([async_me, async_me_3, async_me]).then((data) => {
        console.log(`From promise all: ${data}`);
    });
})();



// const target = {
//   message1: "hello",
//   message2: "everyone"
// };

// const handler = {};
// const proxy = new Proxy(target, handler); // Used in frameworks for dom manipulation