import { Page } from "patchright";
import { SignUpUserConfig } from "src/types/types.js";
import { BasePage } from "../base/page.js";
import logger from "../../utils/logger.js";
import { underscoresToDashes } from "../../utils/underscoreToDashes.js";
import { TokenStorageService } from "../../services/token-storage.service.js";

export class GetAccessTokenPage extends BasePage {
	private constructor(prevPage: Page, private readonly config: SignUpUserConfig) {
		super(prevPage);
	}

	static async build(
			previousPage: Page,
			user: SignUpUserConfig,
		): Promise<GetAccessTokenPage> {
			return new GetAccessTokenPage(previousPage, user);
		}

	public async execute(): Promise<void> {
		try {
			await this.openChat();
			this.startListening();

			await this.writeMessage("test");
		} catch (e: any) {
			this.handlerError(e);
		}
	}

	private async openChat(): Promise<void> {
		try {
			const url = underscoresToDashes(`${this.URL}/${this.config.username}`);
			await this.page.goto(url);
			logger.info("Открыли страницу чата");
		} catch (e: any) {
			throw e;
		}
	}

	private startListening() {
		this.page.on("request", async (request) => {
			if (request.url().includes("/api/v2/messages/send/")) {
				const auth = request.headers()["authorization"];
				console.log("Заголовок авторизации:", auth);
				
				if (auth && this.config.username) {
					await TokenStorageService.saveToken(this.config.username, auth, this.config);
				}
			}
		});
	}

	private async writeMessage(msg: string) {
		try {
			await this.acceptCookies();
			await this.click("[data-testid='chat-input']")
			await this.fill("[data-testid='chat-input']", msg);
			await this.page.waitForTimeout(10000);
			await this.click("[id='send-message-button']")
			logger.info("Отправили сообщение в чат");
		} catch (e: any) {
			throw e;
		}
	}

	private async acceptCookies(): Promise<void> {
		try {
			await this.click("[data-testid='accept-cookies']");
			logger.info("Приняли cookies");
		} catch (e: any) {
			logger.debug("Кнопка принятия cookies не найдена или уже нажата");
		}
	}

	private handlerError(e: any): void {
    logger.error(e.message);
    throw e;
  }
}
