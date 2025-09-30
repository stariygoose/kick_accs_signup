import gmail from "gmail-getter";
import { Code, StoredCode } from "../types/types.js";
import { isSixDigitsCode } from "../utils/isSixDigitsCode.js";
import logger from "../utils/logger.js";

class GMailController {
  private _lastCode: StoredCode;
  private readonly _emailKick = "noreply@email.kick.com";

  private constructor(_lastCode: Code) {
    this._lastCode = { value: _lastCode, __newCode: false };
  }

  static async build(): Promise<GMailController> {
    const tempGMailController = new GMailController("000000" as Code);

    const code = await tempGMailController.checkLastKickCodeMessage();
    return new GMailController(code);
  }

  get lastCode(): StoredCode {
    return this._lastCode;
  }

  public async checkLastKickCodeMessage(): Promise<Code> {
    try {
      const accessToken = await this.generateAccessToken();

      const email = await gmail.checkInbox({
        token: accessToken,
        query: `subject:Sign Up Verification Code`,
      });

      const code = email.snippet.match(/\d{6}/);
      if (!code) throw new Error("No code found in email");

      const sixDigitsCode = isSixDigitsCode(code[0]);

      this._lastCode.value === sixDigitsCode
        ? (this._lastCode = { value: sixDigitsCode, __newCode: false })
        : (this._lastCode = { value: sixDigitsCode, __newCode: true });

      return sixDigitsCode;
    } catch (e) {
      throw e;
    }
  }

  public async waitForNewKickCode(timeoutMs: number = 300000): Promise<Code> {
    const startTime = Date.now();
    const initialCode = this._lastCode.value;

    while (Date.now() - startTime < timeoutMs) {
      try {
        const code = await this.checkLastKickCodeMessage();

        if (this._lastCode.__newCode && code !== initialCode) {
          return code;
        }
      } catch (error: any) {
        logger.warn(`Ошибка пока проверяем новый код: ${error.message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error(`Timeout waiting for new Kick code after ${timeoutMs}ms`);
  }

  private async generateAccessToken(): Promise<string> {
    try {
      this.checkCredentials();

      const maxRetries = 3;
      let lastError: any;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          logger.debug(
            `Attempting to get access token (attempt ${attempt}/${maxRetries})`,
          );

          return await gmail.getAccessToken(
            process.env.CLIENT_ID!,
            process.env.CLIENT_SECRET!,
            process.env.REFRESH_TOKEN!,
          );
        } catch (error: any) {
          lastError = error;
          logger.warn(
            `Access token attempt ${attempt} failed: ${error.message}`,
          );

          if (attempt < maxRetries) {
            const delayMs = attempt * 2000; // Progressive delay: 2s, 4s
            logger.warn(`Retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }

      throw lastError;
    } catch (e) {
      throw e;
    }
  }

  private checkCredentials(): void {
    if (!process.env.CLIENT_ID)
      throw new Error(
        "No CLIENT_ID provided in .env\nCan be found in credentials.json",
      );
    if (!process.env.CLIENT_SECRET)
      throw new Error(
        "No CLIENT_SECRET provided in .env\nCan be found in credentials.json",
      );
    if (!process.env.REFRESH_TOKEN)
      throw new Error(
        "No REFRESH_TOKEN provided in .env\nHave to run: npx gmail-getter get-refresh-token",
      );
  }
}

export const gMailController = await GMailController.build();
