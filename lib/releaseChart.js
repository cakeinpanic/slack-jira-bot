const jiraApi = require('./jiraApi');
const makeChart = require('./chartsApi');
const moment = require('moment');

// const STATUSES = ['Specification', 'Architecture', 'ToDo', 'Assigned', 'In Progress', 'Review', 'Resolved', 'Testing', 'Ready', 'Released'];
const STATUSES = ['ToDo', 'Assigned', 'In Progress', 'Review', 'Resolved', 'Testing', 'Ready', 'Released'];

function prepareDataForChart(issueLog) {
    let logMap = issueLog
        .map(log => ({status: log.to, time: moment(log.time).dayOfYear()}))
        .reduce((acc, current) => ({...acc, ...{[current.status]: current.time}}), {});

    return STATUSES.map((status, i) => logMap[status] || logMap[STATUSES[i + 1]]).map(
        (time, i, timeArray) => time - timeArray[0]
    );
}

function makeReleaseChart(fixVersion) {
    return jiraApi.getAllIssuesByFixVersion(fixVersion).then(issues => {
        const statusLog = issues.map(issue => ({
            name: issue.key,
            value: prepareDataForChart(issue.history)
        }));

        return makeChart(statusLog, STATUSES, fixVersion);
    });
}

module.exports = makeReleaseChart;
