import "dotenv/config";
import { chromium } from "patchright";
import logger from "./utils/logger.js";
import { KickSignUpPage } from "./pages/index.js";

logger.info("Запускаем браузер...");

const browser = await chromium.launch({
  headless: false,
  channel: "chrome",
});

logger.info("Браузер успешно запущен.");

const signUpPage = await KickSignUpPage.build(browser, {
  email: "xweqixms@gmail.com",
  username: "xweqixms",
});

await signUpPage.execute();

await signUpPage.waitForTimeout(100000);

await browser.close();
