import { Page } from "patchright";
import logger from "../../utils/logger.js";
import { BasePage } from "../base/page.js";

export class GetAccessTokenPage extends BasePage<string> {
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

  private capturedToken: string | null = null;

  private setupRequestListener(): void {
    this.page.on("request", (request) => {
      const url = request.url();
      const regex = /https:\/\/kick\.com\/api\/v2\/messages\/send\/\d+/;

      if (regex.test(url)) {
        const headers = request.headers();
        const authHeader = headers["authorization"];

        if (authHeader) {
          const token = authHeader.split(" ")[1];
          this.capturedToken = token;
          logger.info(`Access Token: ${token}`);
        }
      }
    });
  }

  public async execute(): Promise<string> {
    logger.debug("Начинаем получение access token");
    try {
      this.setupRequestListener();

      // Конвертируем username в URL формат (заменяем _ на -)
      const urlUsername = this.user.replace(/_/g, "-");
      await this.page.goto(`https://kick.com/${urlUsername}`);

      await this.click("[data-testid='accept-cookies']");

      await this.click("[data-testid='chat-input']");
      await this.fill("[data-testid='chat-input']", "t");
      logger.debug("Ввели сообщение");

      await this.click('[id="send-message-button"]');
      logger.debug("Отправили сообщение");

      // Ждем, пока токен будет захвачен
      await this.page.waitForTimeout(2000);

      if (!this.capturedToken) {
        throw new Error("Не удалось получить access token");
      }

      logger.info(`Получили access token для юзера ${this.user}`);
      return this.capturedToken;
    } catch (e: any) {
      logger.error(e.message);
      throw e;
    }
  }
}
