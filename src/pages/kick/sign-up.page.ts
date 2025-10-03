import { Page } from "patchright";

import { BasePage } from "../base/page.js";
import logger from "../../utils/logger.js";
import { UsernameGenerator } from "../../utils/username.generator.js";
import { Code, SignUpUserConfig } from "../../types/types.js";
import { gMailController } from "../../controllers/gmail-kick.controller.js";

export class KickSignUpPage extends BasePage {
  private constructor(
    page: Page,
    private readonly userConfig: SignUpUserConfig,
  ) {
    super(page);
    logger.debug("Страница регистрации на Kick создана");
  }

  static async build(
    page: Page,
    config: SignUpUserConfig,
  ): Promise<KickSignUpPage> {
    return new KickSignUpPage(page, config);
  }

  public async execute(): Promise<void> {
    logger.debug("Начинаем регистрацию на Kick.com");
    try {
      await this.clickSignUpButton();
      await this.enterInputs();
      await this.sendRegistrationForm();
      logger.info("Поля заполнены переходим на код.");

      const code = await gMailController.waitForNewKickCode();
      logger.info("Получен код подтверждения");
      await this.fillCodeInput(code);

      await this.acceptTerms();

      logger.info(
        `Регистрация завершена для юзера <${this.userConfig.email}: ${this.userConfig.username}>`,
      );
    } catch (e: any) {
      this.handlerError(e);
    }
  }

  private async clickSignUpButton(): Promise<void> {
    try {
      await this.page.goto(this.URL);
      await this.click("[data-testid='sign-up']");
      logger.info("Нажата кнопка регистрации");
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
        `${this.userConfig.birthday!.year}-${this.userConfig.birthday!.month.toString().padStart(2, "0")}-${this.userConfig.birthday!.day.toString().padStart(2, "0")}`,
      );
      await this.fill("[name='password']", this.userConfig.password!);
      await this.fill("[name='username']", this.userConfig.username!);
      logger.info("Форма регистрации заполнена");
    } catch (e: any) {
      logger.error("Не удалось заполнить поля для регистрации юзера.");
      throw e;
    }
  }

  private async sendRegistrationForm(): Promise<void> {
    try {
      await this.click("[data-testid='sign-up-submit']");
      logger.info("Форма регистрации отправлена");

      await this.page.waitForTimeout(2000);

      await this.click("[data-testid='sign-up-submit']");
      logger.info("Повторный клик кнопки регистрации выполнен");
    } catch (e: any) {
      logger.error("Не удалось отправить форму регистрации.");
      throw e;
    }
  }

  private async fillCodeInput(code: Code): Promise<void> {
    try {
      await this.fill("[name='code']", code);
      logger.info("Код подтверждения введен");
    } catch (e) {
      logger.error("Не удалось заполнить поле для ввода кода.");
      throw e;
    }
  }

  private checkIsConfigExists(): void {
    if (!this.userConfig.email) {
      throw new Error("Необходимо указать email");
    }

    if (!this.userConfig.password) {
      const defaultPasswod = process.env.DEFAULT_PASSWORD;

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

  private async acceptTerms(): Promise<void> {
    try {
      await this.scroll("div[dir='ltr'].overflow-y-scroll");
      await this.click('button:has-text("I accept")');
      await this.click('button:has-text("Get Started")');
      logger.info("Условия приняты и регистрация завершена");
    } catch (e) {
      throw e;
    }
  }

  private handlerError(e: any): void {
    logger.error(e.message);
    throw e;
  }
}
