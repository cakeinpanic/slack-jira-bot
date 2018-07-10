const jiraAPi = require('./jiraApi');
const {slack, jira} = require('../config');
const {WebClient, LogLevel} = require('@slack/client');
const _ = require('lodash');
const {RTMClient} = require('@slack/client');
const chalk = require('chalk');

class SlackBot {
    constructor() {
        this.rtm = new RTMClient(slack.token, {logLevel: LogLevel.INFO});
        this.web = new WebClient(slack.token, {logLevel: LogLevel.INFO});

        this.rtm.on('hello', () => {
            console.log(chalk.green('started'));
        });

        this.rtm.on('message', data => {
            this.handleMessage(data);
        });
    }

    start() {
        this.setProjects().then(() => {
            this.rtm.start();
        });
    }

    setProjects() {
        if (jira.projects) {
            this.projects = jira.projects;
            this.updatePattern();
            return Promise.resolve();
        } else {
            return jiraAPi.getAllMyProjects().then(projects => {
                this.projects = projects;
                this.updatePattern();
            });
        }
    }

    updatePattern() {
        this.pattern = this.projects.length ? `(${this.projects.join('|')})-[1-9][0-9]*` : null;
        console.log(chalk.green(`Pattern is ${this.pattern}`));
    }

    handleMessage(message) {
        console.log(message);

        const isMessageParsable =
            message.type === 'message' && message.text != null && message.subtype !== 'bot_message';

        if (!this.pattern || !isMessageParsable) {
            return;
        }

        const matches = this.getAllMatchingTickets(message).map(issueId => this.getJiraInfo(message, issueId));

        Promise.all(matches).then(reportTexts => {
            reportTexts = `${reportTexts.join('\n\n')}`;

            const thread = jira.useThread ? message.ts : null;

            console.log('send data', reportTexts);

            this.postMessage(reportTexts, message.channel, message.thread_ts || thread);
        });
    }

    postMessage(text, channel, thread_ts) {
        this.web.chat
            .postMessage({
                text,
                channel,
                thread_ts
            })
            .then(data => console.log(data))
            .catch(data => console.log('err', data));
    }

    generateLink(issue, summary = issue) {
        const link = jira.issueLink || `https://${jira.host}/browse/`;
        return `<${link}${issue}|${summary}>`;
    }

    generateMessage({key, summary, assignee, implementer, status, fixVersions}) {
        const msg = [];
        msg.push(`> *${this.generateLink(key, `${key} ${summary}`)}*`);
        if (implementer) {
            msg.push(`> *Implementer* ${implementer}`);
        }
        if (fixVersions.length) {
            msg.push(`> *Fix versions:* ${fixVersions.join(', ')}`);
        }
        msg.push(`> *Status* ${status}`);
        return msg.join('\n');
    }

    getAllMatchingTickets(message) {
        const regExp = new RegExp(this.pattern, 'g');
        return _.uniq(message.text.match(regExp));
    }

    getJiraInfo(message, issueId) {
        return jiraAPi
            .getIssue(issueId)
            .then(data => {
                return this.generateMessage(data);
            })
            .catch(() => {
                return `> Мы искали задачу ${this.generateLink(issueId)}, но не нашли`;
            });
    }
}

module.exports = SlackBot;
