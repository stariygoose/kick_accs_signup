import { Browser, Page } from "patchright";
import logger from "../../utils/logger.js";
import { BasePage } from "../base/page.js";

export class FollowStreamerPage extends BasePage {
  private readonly URL: string;
  private constructor(page: Page, streamer: string) {
    super(page);
    this.URL = `https://kick.com/${streamer}`;
    logger.debug("FollowStreamerPage created");
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
      await this.page.goto(this.URL);
      await this.click("[data-testid='follow-button']");
    } catch (e: any) {
      logger.error(e.message);
      throw e;
    }
  }
}
