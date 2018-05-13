const jiraApiConnector = require('jira').JiraApi;
const config = require('../config');
const jiraConfig = config.jira;

class JiraAPi {
    constructor() {
        this.jiraApi = new jiraApiConnector(
            'https',
            jiraConfig.host,
            jiraConfig.port,
            jiraConfig.user,
            jiraConfig.password,
            '2.0.alpha1'
        );
    }

    getIssue(issueId) {
        return Promise.resolve({key: issueId, title: 'title', implementer: 'implementer', status: 'IN_PROGRESS'});

        return new Promise((resolve, reject) => {
            this.jiraApi.findIssue(issueId, function(error, issue) {
                console.log('Status: ' + issue, 'Error: ', error);

                if (error) {
                    reject(error);
                    return;
                }
                resolve(issue);
            });
        });
    }
}

module.exports = new JiraAPi();
