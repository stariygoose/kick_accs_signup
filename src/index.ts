import "dotenv/config";
import { chromium } from "patchright";
import logger from "./utils/logger.js";
import { FollowStreamerPage, KickSignUpPage } from "./pages/index.js";

logger.info("Запускаем браузер...");
const streamers = ["zloyn", "lord-treputin", "klp666", "zubarefff"];

const browser = await chromium.launch({
  headless: false,
  channel: "chrome",
});

logger.info("Браузер успешно запущен.");

const page = await browser.newPage();

const signUpPage = await KickSignUpPage.build(page, {
  email: "mixes-newt-4d@icloud.com",
  username: "mixes_new_228",
});
await signUpPage.execute();

for (const streamer of streamers) {
  const followPage = await FollowStreamerPage.build(page, streamer);
  await followPage.execute();
}

signUpPage.waitForTimeout(100000);

await browser.close();
