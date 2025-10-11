import * as fs from "fs";
import * as yaml from "js-yaml";
import { UsersConfig, User } from "../types/types.js";
import logger from "./logger.js";

export function removeUserFromYaml(filePath: string, username: string): void {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as UsersConfig;

    if (!data || !data.users) {
      throw new Error("Invalid YAML structure");
    }

    const originalLength = data.users.length;
    data.users = data.users.filter((user: User) => user.username !== username);

    if (data.users.length === originalLength) {
      logger.warn(`Пользователь ${username} не найден в ${filePath}`);
      return;
    }

    const yamlContent = yaml.dump(data);
    fs.writeFileSync(filePath, yamlContent, "utf8");
    logger.info(`Пользователь ${username} успешно удален из ${filePath}`);
  } catch (error) {
    logger.error(`Ошибка при удалении пользователя из YAML: ${error}`);
    throw error;
  }
}
