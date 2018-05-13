module.exports = {
    slack: {
        token: '****-************-************************',
        botName: 'myBotName' // your bot display name
    },
    jira: {
        host: 'jira.mycompany.com',
        port: '80',
        user: '***',
        password: '***',
        projects: ['IBULF'], // in MPR-554 'MPR' would be a project name
        useThread: true // publish issue info into thread or directly in channel
    }
};
