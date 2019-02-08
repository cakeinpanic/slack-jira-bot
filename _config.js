const {
    SLACK_TOKEN,
    SLACK_BOT_NAME,
    JIRA_HOST,
    JIRA_PORT,
    JIRA_USER,
    JIRA_PASSWORD,
    JIRA_PROJECT,
    JIRA_THREAD,
    JIRA_LINK
} = process.env;

module.exports = {
    slack: {
        token: SLACK_TOKEN,
        botName: SLACK_BOT_NAME // your bot display name
    },
    jira: {
        host: JIRA_HOST,
        port: JIRA_PORT,
        user: JIRA_USER,
        password: JIRA_PASSWORD,
        projects: JIRA_PROJECT.split(','), // ** optional ** list of project keys. If not provided, all user's project would be used
        useThread: Boolean(JIRA_THREAD), //  ** optional(default false) ** publish issue info into thread or directly in channel,
        issueLink: JIRA_LINK // ** optional ** , otherwise link to issue would be combined like https://{host}/browse/
    }
};
