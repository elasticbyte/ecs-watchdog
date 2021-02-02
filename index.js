'use strict';

const { IncomingWebhook } = require('@slack/webhook');

if(! process.env.SLACK_WEBHOOK_URL) {
    console.error('missing required environment variable SLACK_WEBHOOK_URL.');
    process.exit(3);
}

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookUrl);

exports.handler = async (event, context) => {
    const account = event.account;
    const region = event.region;
    const service = event.detail.group;
    const lastStatus = event.detail.lastStatus;
    const stopCode = event.detail.stopCode || null;
    const stoppedReason = event.detail.stoppedReason;

    // stopCode = ServiceSchedulerInitiated is normal and expected. Caused by deployments of the service.
    if(lastStatus === 'STOPPED' && stopCode !== 'ServiceSchedulerInitiated') {
        console.error(`[acct: ${account}] service ${service} in ${region} STOPPED unexpectedly with code ${stopCode}. Reason: ${stoppedReason}.`);

        await webhook.send({
            text: `_[acct: ${account}]_ service *${service}* in ${region} *STOPPED* unexpectedly with code ${stopCode}.\n\t*Reason:* ${stoppedReason}.`
        });
    } else {
        console.log(`[acct: ${account}] service ${service} in ${region} is ${lastStatus} with code ${stopCode}.`);
    }
};
