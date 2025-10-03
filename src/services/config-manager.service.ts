import fs from "fs/promises";
import yaml from "yaml";
import logger from "../utils/logger.js";
import { SignUpUserConfig } from "../types/types.js";

interface UsersConfig {
  users: SignUpUserConfig[];
}

export class ConfigManagerService {
  private static readonly CONFIG_FILE = "users.yml";

  static async loadUsers(): Promise<SignUpUserConfig[]> {
    try {
      const fileContent = await fs.readFile(this.CONFIG_FILE, "utf8");
      const config: UsersConfig = yaml.parse(fileContent);
      return config.users || [];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        logger.warn("Конфигурационный файл пользователей не найден");
        return [];
      }
      logger.error(`Не удалось загрузить конфигурацию пользователей: ${error.message}`);
      throw error;
    }
  }

  static async removeUser(userToRemove: SignUpUserConfig): Promise<void> {
    try {
      const users = await this.loadUsers();
      const filteredUsers = users.filter(
        user => !(user.username === userToRemove.username && user.email === userToRemove.email)
      );

      const config: UsersConfig = { users: filteredUsers };
      const yamlContent = yaml.stringify(config);
      
      await fs.writeFile(this.CONFIG_FILE, yamlContent, "utf8");
      logger.info(`Пользователь удалён из конфигурации: ${userToRemove.username}`);
    } catch (error: any) {
      logger.error(`Не удалось удалить пользователя из конфигурации: ${error.message}`);
      throw error;
    }
  }

  static async getConfigFilePath(): Promise<string> {
    return this.CONFIG_FILE;
  }
}