import { ApplicationEnv } from "config";
import { StringSession } from "telegram/sessions";
import { TelegramClient } from "telegram";
import fs from "fs/promises";
import input from "input";

export async function initTelegram(env: ApplicationEnv) {
  const token = (await getTokenFromFile()) ?? "";
  const stringSession = new StringSession(token);

  const client = new TelegramClient(stringSession, +env.api_id, env.api_hash, {
    connectionRetries: 5,
  });

  if (token === "") {
    console.log("We noticed you didn't provided a token....Let's log you in: ");
    await client.start({
      phoneNumber: async () => await input.text("Phone number (intl format):"),
      password: async () => await input.text("Password:"),
      phoneCode: async () => await input.text("Code:"),
      onError: (err) => console.log(err),
    });
    console.log(
      "We'll cache this session, so you don't have to go through this process next time!"
    );
    await cacheToken(client.session.save() as unknown as string);
  } else {
    console.log(
      "AUTH_TOKEN variable is set... we'll be reusing this token for this session"
    );

    if ((await client.connect()) === false) {
      throw new Error("unable to authenticate with Telegram!");
    }
  }

  console.log("Successfully initiated Telegram client!");
  return client;
}

const tokenFilePath = process.cwd() + "/tmp/token";

async function getTokenFromFile(): Promise<string> {
  try {
    const token = await fs.readFile(tokenFilePath);
    return token.toString("utf-8");
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.log("Error while fetching token", err);
    }
    return null;
  }
}

export async function cacheToken(token: string): Promise<void> {
  try {
    await fs.writeFile(tokenFilePath, token);
  } catch (err) {
    console.log("Error while trying to cache token for future use", err.code);
  }
}
