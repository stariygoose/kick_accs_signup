import { Page } from "playwright";
import logger from "../../utils/logger.js";

export abstract class BasePage {
  private timeout: number = 5000;
  constructor(protected readonly page: Page) {}

  public abstract execute(): Promise<void>;
  public async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  protected async click(selector: string): Promise<void> {
    try {
      await this.page.waitForSelector(selector);
      logger.debug(`Кнопка с селектором ${selector} найдена.`);

      await this.page.mouse.move(780, 800, { steps: 200 });

      await this.page.hover(selector);
      logger.debug(`Ведем курсор к кнопке с селектором ${selector}.`);

      await this.page.click(selector);
      logger.debug(`Кнопка с селектором ${selector} кликнута.`);
    } catch (e) {
      logger.error(
        `Не удалось найти либо нажать на кнопку с селектором ${selector}.`,
      );
      throw e;
    }
  }

  protected async fill(selector: string, value: string): Promise<void> {
    try {
      await this.page.waitForSelector(selector);
      logger.debug(`Поле с селектором ${selector} найдено.`);

      await this.page.waitForTimeout(this.timeout);
      await this.page.hover(selector);
      logger.debug(`Ведем курсор к полю с селектором ${selector}.`);

      await this.page.click(selector);

      await this.page.type(selector, value, { delay: 200 });
      logger.debug(
        `Поле с селектором ${selector} заполнено значением ${value}.`,
      );
    } catch (e) {
      logger.error(
        `Не удалось найти либо заполнить поле с селектором ${selector} значением ${value}.`,
      );
      throw e;
    }
  }
}
