import { Api, TelegramClient } from "telegram";

import { Context, Telegraf } from "telegraf";
import env from "./config";
import { initTelegram } from "./telegram.client";

async function start() {
  const client = await initTelegram(env);
  const bot = new Telegraf(env.bot_token);

  bot.command("purge", async (ctx) => await purgeGroup(ctx, client));
  bot.command("help", usage);

  await bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
start();

async function purgeGroup(ctx: Context, client: TelegramClient) {
  const chatId: any = +Math.abs(ctx.chat.id);
  const members = await getChatMembers(client, chatId);

  for (const member of members["participants"].participants) {
    if (+member.userId == ctx.botInfo.id) continue;
    if (member.className == "ChatParticipantCreator") continue;

    await client.invoke(
      new Api.messages.DeleteChatUser({
        chatId: chatId,
        userId: new Api.InputUser(<any>{ userId: Math.abs(member.userId) }),
      })
    );
    console.log("successfully removed user " + JSON.stringify(member, null, 2)); // prints the result
  }
}

async function getChatMembers(client: TelegramClient, chatId: any) {
  const result = await client.invoke(new Api.messages.GetFullChat({ chatId }));
  return result.fullChat;
}

async function usage(ctx: Context) {
  await ctx.reply(`
  Hi, I'm Thanos, your favorite group cleaner 👹

  /purge - remove all users from the group
  /quit - remove me from the group

  created with ❤️ by Kruse
  `);
}
