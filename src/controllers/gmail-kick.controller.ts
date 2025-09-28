import gmail from "gmail-getter";
import { Code, StoredCode } from "../types/types.js";
import { isSixDigitsCode } from "../utils/isSixDigitsCode.js";

class GMailController {
  private _lastCode: StoredCode | null = null;
  private readonly _emailKick = "noreply@email.kick.com";

  get lastCode(): StoredCode | null {
    return this._lastCode;
  }

  public async checkLastKickCodeMessage(): Promise<Code> {
    try {
      const accessToken = await this.generateAccessToken();

      const email = await gmail.checkInbox({
        token: accessToken,
        query: `from:${this._emailKick}`,
      });

      const code = email.snippet.match(/\d{6}/);
      if (!code) throw new Error("No code found in email");

      const sixDigitsCode = isSixDigitsCode(code[0]);

      this._lastCode?.value === sixDigitsCode
        ? (this._lastCode = { value: sixDigitsCode, __newCode: false })
        : (this._lastCode = { value: sixDigitsCode, __newCode: true });

      return sixDigitsCode;
    } catch (e) {
      throw e;
    }
  }

  private async generateAccessToken(): Promise<string> {
    try {
      this.checkCredentials();

      return await gmail.getAccessToken(
        process.env.CLIENT_ID!,
        process.env.CLIENT_SECRET!,
        process.env.REFRESH_TOKEN!,
      );
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

export const gMailController = new GMailController();
