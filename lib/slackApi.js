const jiraAPi = require('./jiraApi');
const {slack, jira} = require('../config');
const {WebClient, LogLevel} = require('@slack/client');
const _ = require('lodash');
const {RTMClient} = require('@slack/client');
const chalk = require('chalk');

const COMMANDS = {ADD_PROJECT: 'add_project', REMOVE_PROJECT: 'remove_project', ALL_PROJECTS: 'all_projects'};

class SlackBot {
    constructor() {
        this.projects = jira.projects || [];

        this.rtm = new RTMClient(slack.token, {logLevel: LogLevel.INFO});
        this.web = new WebClient(slack.token, {logLevel: LogLevel.INFO});

        this.rtm.on('hello', () => {
            console.log(chalk.green('started'));
        });

        this.rtm.on('message', data => {
            this.handleMessage(data);
        });

        this.updatePattern();
    }

    start() {
        this.rtm.start();
    }

    updatePattern() {
        this.pattern = this.projects.length ? `(${this.projects.join('|')})-[1-9][0-9]*` : null;
    }

    isMyBotId(userId) {
        if (!this.myId || this.myId !== userId) {
            return this.web.bots.info({bot: userId}).then(({bot}) => {
                if (bot.name === slack.botName) {
                    this.myId = bot.id;
                    return true;
                }
                throw new Error();
            });
        }
        return Promise.resolve(true);
    }

    updateBotOptions(message) {
        const messageText = message.text;
        const mentionRegexp = /^<@([\w\d]+)>/;
        if (!mentionRegexp.test(messageText)) {
            return;
        }

        const [userName, command, text] = messageText.split(' ');
        const userId = mentionRegexp.exec(userName)[1];

        this.isMyBotId(userId).then(() => {
            switch (command) {
                case COMMANDS.ADD_PROJECT:
                    this.projects.push(text);
                    break;
                case COMMANDS.REMOVE_PROJECT:
                    _.remove(this.projects, text);
                    break;
            }
            this.updatePattern();
            this.postMessage(`Слушаю про проекты: ${this.projects.join(', ')}`, message.channel);
        });
    }

    handleMessage(message) {
        console.log(message);
        this.updateBotOptions(message);

        const isMessageParsable =
            message.type === 'message' && message.text != null && message.subtype !== 'bot_message';

        if (!this.pattern || !isMessageParsable) {
            return;
        }

        const regExp = new RegExp(this.pattern);
        const shouldLookInJira = regExp.test(message.text);

        if (shouldLookInJira) {
            const issueId = regExp.exec(message.text)[0];
            jiraAPi.getIssue(issueId).then(data => {
                console.log('send data', data);

                const thread = jira.useThread ? message.ts : null;
                this.postMessage(this.generateMessage(data), message.channel, message.thread_ts || thread);
            });
        }
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

    generateMessage({key, title, assignee, implementer, status}) {
        const msg = [];
        msg.push(`>>> *${key}* ${title} `);
        msg.push(`*Status* ${status}`);
        msg.push(`*Implementer* ${implementer}`);
        return msg.join(' ');
    }
}

module.exports = SlackBot;
