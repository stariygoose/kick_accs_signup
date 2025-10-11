import * as fs from "fs";
import logger from "./logger.js";

export function appendTokenToFile(
  filePath: string,
  username: string,
  token: string
): void {
  try {
    const tokenLine = `${username}=${token}\n`;
    fs.appendFileSync(filePath, tokenLine, "utf8");
    logger.info(`Token для ${username} успешно записан в ${filePath}`);
  } catch (error) {
    logger.error(`Ошибка при записи токена: ${error}`);
    throw error;
  }
}
