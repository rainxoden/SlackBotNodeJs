const { App } = require("@slack/bolt");
require("dotenv").config({ path: `../.env` });

const env = process.env;

const app = new App({
  logLevel: "debug",
  socketMode: true,
  token: env.SLACK_BOT_TOKEN,
  appToken: env.SLACK_APP_TOKEN,
});

// グローバルショートカット
app.shortcut("takahashi-socket-slackbot", async ({ ack, body, client }) => {
  await ack();
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: "modal",
      callback_id: "modal-id",
      title: {
        type: "plain_text",
        text: "タスク登録",
      },
      submit: {
        type: "plain_text",
        text: "送信",
      },
      close: {
        type: "plain_text",
        text: "キャンセル",
      },
      blocks: [
        {
          type: "input",
          block_id: "input-task",
          element: {
            type: "plain_text_input",
            action_id: "input",
            placeholder: {
              type: "plain_text",
              text: "タスクの詳細・期限などを書いてください",
            },
          },
          label: {
            type: "plain_text",
            text: "タスク",
          },
        },
      ],
    },
  });
});

app.view("modal-id", async ({ ack, view, logger }) => {
  logger.info(`Submitted data: ${view.state.values}`);
  await ack();
});

// イベント API
app.message("こんにちは", async ({ message, say }) => {
  await say(`:wave: こんにちは <@${message.user}>！`);
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();
