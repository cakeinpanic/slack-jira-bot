const {stash, slack} = require('./tokens');
const {getAllOpenPRs, getAllReviewNeededPRS} = require('./stashApi');
const _ = require('lodash');
const {WebClient} = require('@slack/client');

const {RTMClient} = require('@slack/client');

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(slack);
const web = new WebClient(slack);

getAllReviewNeededPRS().then((data) => {
    web.chat.postMessage({channel: 'general', text: _.keys(data).map(data => `@${data}`).join(', ')})
       .then((res) => {
           console.log(res)
       });
});
//
// web.users.list()
//    .then((users) => {
//        // Take any channel for which the bot is a member
//        return users.filter(user => !user.is_bot)
//    });