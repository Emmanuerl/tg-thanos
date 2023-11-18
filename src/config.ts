export interface ApplicationEnv {
  bot_token: string;
  api_id: number;
  api_hash: string;
}

function loadEnv(): ApplicationEnv {
  require("dotenv").config();

  // for handling all required config
  const required = ["BOT_TOKEN", "API_ID", "API_HASH"];
  return required.reduce((cfg, key) => {
    if (!process.env[key]) throw new Error(key + " env not specified");
    cfg[key.toLowerCase()] = process.env[key];
    return cfg;
  }, <any>{});
}

const env = loadEnv();
export default env;
