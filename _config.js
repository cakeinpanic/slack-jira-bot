module.exports = {
    slack: {
        token: '****-************-************************',
        botName: 'myBotName' // your bot display name
    },
    jira: {
        host: 'https://jira.mycompany.com',
        port: '80',
        user: '***',
        password: '***',
        projects: ['IBULF'], // in MPR-554 'MPR' would be a project name
        useThread: true, // publish issue info into thread or directly in channel,
        issueLink: 'https://jira.mycompany.com/browse/' // optional, otherwise link to issue would be combined like https://{host}/browse/
    }
};
