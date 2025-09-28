import { Browser, Page } from "playwright";
import { BasePage } from "../base/page.js";
import logger from "../../utils/logger.js";
import { UsernameGenerator } from "../../utils/username.generator.js";
import { Code } from "../../types/types.js";
import { gMailController } from "../../controllers/gmail-kick.controller.js";

interface SignUpUserConfig {
  email: string;
  username?: string;
  birthday?: { day: number; month: number; year: number };
  password?: string;
}

export class KickSignUpPage extends BasePage {
  private readonly URL: string = "https://kick.com/";

  private constructor(
    page: Page,
    private readonly userConfig: SignUpUserConfig,
  ) {
    super(page);
    logger.debug("KickSignUpPage created");
  }

  static async build(
    browser: Browser,
    config: SignUpUserConfig,
  ): Promise<KickSignUpPage> {
    const page = await browser.newPage();
    return new KickSignUpPage(page, config);
  }

  public async execute(): Promise<void> {
    logger.debug("Начинаем регистрацию на Kick.com");
    try {
      await this.clickSignUpButton();
      await this.enterInputs();
      await this.sendRegistrationForm();

      this.page.waitForTimeout(1000);

      const code = await gMailController.checkLastKickCodeMessage();
      // TODO: get code from gmail
      await this.fillCodeInput(code);
    } catch (e: any) {
      this.handlerError(e);
    }
  }

  private async clickSignUpButton(): Promise<void> {
    try {
      await this.page.goto(this.URL);
      await this.click("[data-testid='sign-up']");
    } catch (e: any) {
      throw e;
    }
  }

  private async enterInputs(): Promise<void> {
    try {
      this.checkIsConfigExists();

      await this.fill("[name='email']", this.userConfig.email);
      await this.fill(
        "[name='birthdate']",
        `${this.userConfig.birthday!.day}${this.userConfig.birthday!.month}${this.userConfig.birthday!.year}`,
      );
      await this.fill("[name='password']", this.userConfig.password!);
      await this.fill("[name='username']", this.userConfig.username!);
    } catch (e: any) {
      logger.error("Не удалось заполнить поля для регистрации юзера.");
      throw e;
    }
  }

  private async sendRegistrationForm(): Promise<void> {
    try {
      await this.click("[data-testid='sign-up-submit']");
    } catch (e) {
      logger.error("Не удалось отправить форму регистрации.");
      throw e;
    }
  }

  private async fillCodeInput(code: Code): Promise<void> {
    try {
      await this.fill("[name='code']", code);
    } catch (e) {
      logger.error("Не удалось заполнить поле для ввода кода.");
      throw e;
    }
  }

  private checkIsConfigExists(): void {
    if (!this.userConfig.email) {
      throw new Error("Email is required");
    }

    if (!this.userConfig.password) {
      const defaultPasswod = process.env.DEFAULT_PASSWORD;

      console.log(process.env);
      if (!defaultPasswod) {
        throw new Error(
          "Нужно добавить DEFAULT_PASSWORD в .env\nПример: DEFAULT_PASSWORD=password",
        );
      }
      this.userConfig.password = defaultPasswod;
    }

    if (!this.userConfig.birthday) {
      this.userConfig.birthday = {
        day: 10,
        month: 12,
        year: 2000,
      };
    }

    if (!this.userConfig.username) {
      this.userConfig.username = UsernameGenerator.generate();
    }
  }

  private handlerError(e: any): void {
    logger.error(e.message);
    throw e;
  }
}
