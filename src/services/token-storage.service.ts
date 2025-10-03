import fs from "fs/promises";
import path from "path";
import logger from "../utils/logger.js";
import { SignUpUserConfig } from "../types/types.js";
import { ConfigManagerService } from "./config-manager.service.js";

export class TokenStorageService {
  private static readonly TOKENS_FILE = "tokens.txt";

  static async saveToken(username: string, authHeader: string, userConfig?: SignUpUserConfig): Promise<void> {
    try {
      const token = authHeader.replace(/^Bearer\s+/i, "");
      const tokenEntry = `${username}=${token}\n`;
      await fs.appendFile(this.TOKENS_FILE, tokenEntry, "utf8");
      logger.info(`Токен сохранён для пользователя: ${username}`);

      if (userConfig) {
        await ConfigManagerService.removeUser(userConfig);
      }
    } catch (error: any) {
      logger.error(`Не удалось сохранить токен для ${username}: ${error.message}`);
      throw error;
    }
  }

  static async getTokensFilePath(): Promise<string> {
    return path.resolve(this.TOKENS_FILE);
  }

  static async fileExists(): Promise<boolean> {
    try {
      await fs.access(this.TOKENS_FILE);
      return true;
    } catch {
      return false;
    }
  }
}