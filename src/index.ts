import "dotenv/config";
import { chromium } from "patchright";
import logger from "./utils/logger.js";
import { FollowStreamerPage, KickSignUpPage } from "./pages/index.js";
import { GetAccessTokenPage } from "./pages/kick/get-access-token.page.js";
import { ConfigManagerService } from "./services/config-manager.service.js";

const streamers = ["zloyn", "lord-treputin", "klp666", "zubarefff"];

const users = await ConfigManagerService.loadUsers();

if (users.length === 0) {
  logger.warn("Пользователи не найдены в users.yml");
  process.exit(0);
}

for (const userConfig of users) {
  logger.info(`Обрабатываем пользователя: ${userConfig.username}`);
  logger.info("Запускаем новый браузер...");
  
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",
  });

  logger.info("Браузер успешно запущен.");
  
  const page = await browser.newPage();
  
  try {
    const signUpPage = await KickSignUpPage.build(page, userConfig);
    await signUpPage.execute();

    for (const streamer of streamers) {
      const followPage = await FollowStreamerPage.build(page, streamer);
      await followPage.execute();
    }

    const chatPage = await GetAccessTokenPage.build(page, userConfig);
    await chatPage.execute();

    await chatPage.waitForTimeout(10000);
    
    logger.info(`Пользователь ${userConfig.username} успешно обработан`);
  } catch (error: any) {
    logger.error(`Ошибка при обработке пользователя ${userConfig.username}: ${error.message}`);
  } finally {
    await browser.close();
    logger.info("Браузер закрыт.");
  }
}
