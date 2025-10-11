import { Page } from "patchright";
import logger from "../../utils/logger.js";
import { BasePage } from "../base/page.js";

export class GetAccessTokenPage extends BasePage {
  private constructor(
    page: Page,
    private readonly user: string,
  ) {
    super(page);
    logger.debug("Страница получения access token создана");
  }

  static async build(
    previousPage: Page,
    streamer: string,
  ): Promise<GetAccessTokenPage> {
    return new GetAccessTokenPage(previousPage, streamer);
  }

  private setupRequestListener(): void {
    this.page.on("request", (request) => {
      const url = request.url();
      const regex = /https:\/\/kick\.com\/api\/v2\/messages\/send\/\d+/;

      if (regex.test(url)) {
        const headers = request.headers();
        const authHeader = headers["authorization"];

        if (authHeader) {
          const token = authHeader.split(" ")[1];
          logger.info(`Access Token: ${token}`);
        }
      }
    });
  }

  public async execute(): Promise<void> {
    logger.debug("Начинаем получение access token");
    try {
      this.setupRequestListener();

      await this.page.goto(`https://kick.com/${this.user}`);

      await this.click("[data-testid='accept-cookies']");

      await this.click("[data-testid='chat-input']");
      await this.fill("[data-testid='chat-input']", "t");
      logger.debug("Ввели сообщение");

      await this.click('[id="send-message-button"]');
      logger.debug("Отправили сообщение");

      logger.info(`Получили access token для юзера ${this.user}`);
    } catch (e: any) {
      logger.error(e.message);
      throw e;
    }
  }
}
