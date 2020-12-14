const longPollClient = require('./PollClient');
const workInterval = require('./Monitor');

module.exports = {
    workInterval: workInterval,
    longPollClient: longPollClient
};