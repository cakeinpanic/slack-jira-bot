Bot that looks up for jira issues mentioned and adds information about them

# How to use it without Docker:
1. Fill `env.list` with your credentials
2. run `npm run start:dev` in console
3. wait for `start` to appear in console
#### How to avoid pushing my credentials
1. Just pass them as node env variables in your CI (For example, at Heroku you can make it using [Config Vars](https://devcenter.heroku.com/articles/config-vars))
2. And then user `npm run start:ci` on the CI


# How to use with Docker:
1. Fill `env.list` with your credentials
2. Run `npm run docker:build`
3. Run `npm run docker:start`

