import { Browser, Page } from "patchright";
import logger from "../../utils/logger.js";
import { BasePage } from "../base/page.js";

export class FollowStreamerPage extends BasePage {
  private constructor(page: Page, private readonly streamer: string) {
    super(page);
    logger.debug("Страница подписки на стримера создана");
  }

  static async build(
    previousPage: Page,
    streamer: string,
  ): Promise<FollowStreamerPage> {
    return new FollowStreamerPage(previousPage, streamer);
  }

  public async execute(): Promise<void> {
    logger.debug("Начинаем подписку на стримера");
    try {
      await this.page.goto(`${this.URL}${this.streamer}`);
      await this.click("[data-testid='follow-button']");
      logger.info(`Подписались на стримера ${this.streamer}`);
    } catch (e: any) {
      logger.error(e.message);
      throw e;
    }
  }
}
