const longPollClient = require('./PollClient');
const WorkerInterval = require('./Monitor');

module.exports = {
    WorkerInterval: WorkerInterval,
    longPollClient: longPollClient
};

/* Usage of a WorkerInterval*/
const { appendFile, readFile } = require('fs').promises;
const fs = require('fs');
let prev_size = 0;

async function changeFile() {
    console.log('Changing the file');
    await appendFile('./a.txt', 'Hello world\n', 'utf-8');
}

async function readForUpdates() {
    console.log('dedicated callback called');
    const stats = fs.statSync('./a.txt');
    console.log(prev_size, stats.size);
    if (stats.size > prev_size) {
        prev_size = stats.size;
        console.log('File changed, Updated content: ', await readFile('./a.txt', 'utf-8'));
    }
    return true;
}

const fileReadMonitor = new WorkInterval(readForUpdates, 5);
fileReadMonitor.start();
const fChangeInterval = setInterval(changeFile, 10000);

setTimeout(async () => {
    await fileReadMonitor.shutdown();
    clearInterval(fChangeInterval);
}, 20000);