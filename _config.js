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
        projects: ['PROJ'], // ** optional ** list of project keys. If not provided, all user's project would be used
        useThread: true, //  ** optional(default false) ** publish issue info into thread or directly in channel,
        issueLink: 'https://jira.mycompany.com/browse/' // ** optional ** , otherwise link to issue would be combined like https://{host}/browse/
    }
};
