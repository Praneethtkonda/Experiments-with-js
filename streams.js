const { Writable, Transform } = require('stream');
class MyWritableStream extends Writable {
    constructor() {
        super();
        this.data = "";
        this.count = 0;
    }

    _write(chunk, encoding, callback) {
        // Here you can have your expect statement
        console.log(chunk.toString());
        this.count += 1;
        callback();
    }
}
const write = new MyWritableStream();
const upperCaseTr = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});
const { createReadStream } = require('fs');

const read = createReadStream('./a.txt');
read.pipe(upperCaseTr).pipe(write);
