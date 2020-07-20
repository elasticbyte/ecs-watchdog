'use strict';

const { IncomingWebhook } = require('@slack/webhook');

if(! process.env.SLACK_WEBHOOK_URL) {
    console.error('Missing required environment variable SLACK_WEBHOOK_URL');
    process.exit(3);
}

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookUrl);

exports.handler = async (event, context) => {
    const account = event.account;
    const region = event.region;
    const service = event.detail.group;
    const lastStatus = event.detail.lastStatus;
    const stoppedReason = event.detail.stoppedReason;

    if(lastStatus === "STOPPED") {
        const message = `_[${account}]_ *${service}* in ${region} is *STOPPED*.\n\n*Reason:* ${stoppedReason}.`;
        console.error(message);

        await webhook.send({
            text: message
        });
    } else {
        console.log(`[${account}] ${service} in ${region} is ${lastStatus}`);
    }
};
