const {stash, stashUrl} = require('./tokens');
const got = require('got');
const _ = require('lodash');

function makeRequest(url) {
    return got(url, {
        json: true,
        headers: {authorization: `Bearer ${stash}`}
    })
        .then((res) => {
            return res.body.values;
        })
        .catch(() => []);
}

function getAllOpenPRs() {
    return makeRequest(`${stashUrl}pull-requests`);
}

function getListOfNewReviewers(pr) {
    return pr.reviewers.filter(reviewer => reviewer.status === 'UNAPPROVED').map(({user}) => user.slug);
}

function getAllReviewNeededPRS() {
    return getAllOpenPRs()
        .then(prList => {
            const flatList = _.flatten(prList.map(pr => getListOfNewReviewers(pr).map(reviewer => ({pr, reviewer}))))
            return _.groupBy(flatList, ({reviewer}) => reviewer)
        })
        // .then(data => console.log(data));
}

module.exports = {
    getAllOpenPRs,
    getAllReviewNeededPRS
}