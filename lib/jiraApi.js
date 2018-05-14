const jiraApiConnector = require('jira').JiraApi;
const config = require('../config');
const jiraConfig = config.jira;
const _ = require('lodash');

class JiraAPi {
    constructor() {
        this.jiraApi = new jiraApiConnector(
            'https',
            jiraConfig.host,
            jiraConfig.port,
            jiraConfig.user,
            jiraConfig.password,
            'latest'
        );
    }

    getIssue(issueId) {
        return new Promise((resolve, reject) => {
            this.jiraApi.findIssue(issueId, function(error, issue) {
                console.log(issue);

                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    key: issueId,
                    status: _.get(issue.fields, 'status.name'),
                    implementer: _.get(issue.fields, 'customfield_10502.name'),
                    summary: issue.fields.summary
                });
            });
        });
    }
}

module.exports = new JiraAPi();
