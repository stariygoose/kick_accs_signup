import "dotenv/config";
import { chromium } from "patchright";
import logger from "./utils/logger.js";
import { FollowStreamerPage, KickSignUpPage } from "./pages/index.js";
import { GetAccessTokenPage } from "./pages/kick/get-access-token.page.js";
import { readUsersFromYaml } from "./utils/yaml-reader.js";
import { appendTokenToFile } from "./utils/token-writer.js";
import { removeUserFromYaml } from "./utils/yaml-writer.js";
import path from "path";

logger.info("Загружаем пользователей из users.yml...");
const usersFilePath = path.join(process.cwd(), "users.yml");
const tokensFilePath = path.join(process.cwd(), "tokens.txt");
const usersConfig = readUsersFromYaml(usersFilePath);
const users = usersConfig.users;

const streamers = ["zloyn", "lord-treputin", "klp666", "zubarefff"];

for (const user of users) {
  logger.info(
    `Начинаем обработку пользователя: ${user.username} (${user.email})`,
  );

  try {
    logger.info("Запускаем браузер...");
    const browser = await chromium.launch({
      headless: false,
      channel: "chrome",
    });

    logger.info("Браузер успешно запущен.");

    const page = await browser.newPage();

    const signUpPage = await KickSignUpPage.build(page, {
      email: user.email,
      username: user.username,
    });
    await signUpPage.execute();

    for (const streamer of streamers) {
      const followPage = await FollowStreamerPage.build(page, streamer);
      await followPage.execute();
    }

    const getAccessPage = await GetAccessTokenPage.build(page, user.username);
    const token = await getAccessPage.execute();

    await browser.close();

    // Записываем токен в файл
    appendTokenToFile(tokensFilePath, user.username, token);

    // Удаляем пользователя из users.yml после успешного сохранения токена
    removeUserFromYaml(usersFilePath, user.username);

    logger.info(`Завершена обработка пользователя: ${user.username}`);
  } catch (error) {
    logger.error(
      `Ошибка при обработке пользователя ${user.username}: ${error}`,
    );
    // Не удаляем пользователя из списка в случае ошибки
  }
}
