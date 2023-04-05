const cron = require('node-cron');
const FileShareService = require('./services/FileShareService');

const fileShareService = new FileShareService();
// schedule tasks to be run on the server
cron.schedule('* * 1 * *', () => {
    console.log('running every minute 1, 2, 4 and 5');
    fileShareService.resetUses().then(r => {

    })
});

