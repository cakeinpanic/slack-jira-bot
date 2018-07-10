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

    getAllMyProjects() {
        return new Promise(resolve => {
            this.jiraApi.listProjects(function(error, projects) {
                if (error) {
                    resolve([]);
                    return;
                }
                const projectsList = projects.map(({key}) => key);
                resolve(projectsList);
            });
        });
    }

    getIssue(issueId) {
        return new Promise((resolve, reject) => {
            this.jiraApi.findIssue(issueId, function(error, issue) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    key: issueId,
                    status: _.get(issue.fields, 'status.name'),
                    implementer: _.get(issue.fields, 'customfield_10502.name'),
                    fixVersions: _.get(issue.fields, 'fixVersions', []).map(({name}) => name),
                    summary: issue.fields.summary,
                    original: issue
                });
            });
        });
    }

    getIssueHistory(issueId) {
        return new Promise((resolve, reject) => {
            this.jiraApi.findIssue(`${issueId}?expand=changelog`, function(error, data) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(
                    data.changelog.histories
                        .map(log => ({items: log.items.filter(item => item.field === 'status'), created: log.created}))
                        .filter(({items}) => items.length)
                        .map(({items, created}) => ({from: items[0].fromString, to: items[0].toString, time: created}))
                );
            });
        });
    }

    getIssuesByFixVersion(fixVersion) {
        return new Promise(resolve => {
            return this.jiraApi.searchJira(`project=IBULF AND fixVersion = ${fixVersion}`, null, (error, data) => {
                if (error) {
                    resolve([]);
                }
                resolve(data.issues);
            });
        });
    }

    getAllIssuesByFixVersion(version) {
        return this.getIssuesByFixVersion(version).then(issues => {
            // issues.length = 1;
            const historyPromises = issues.map(issue =>
                this.getIssueHistory(issue.id).then(history => {
                    return {key: issue.key, history};
                })
            );

            return Promise.all(historyPromises);
        });
    }
}

module.exports = new JiraAPi();
