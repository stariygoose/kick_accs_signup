import { Page } from "patchright";
import logger from "../../utils/logger.js";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  public abstract execute(): Promise<void>;
  public async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  protected async click(selector: string): Promise<void> {
    try {
      await this.page.waitForSelector(selector);
      logger.debug(`Кнопка с селектором ${selector} найдена.`);

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

      await this.page.type(selector, value, { delay: 100 });
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

  protected async scroll(
    selector: string,
    opts?: { step?: number; timeoutMs?: number; delay?: number },
  ) {
    const { step = 500, timeoutMs = 10000, delay = 100 } = opts || {};
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });

    await locator.evaluate(
      async (root, params) => {
        const { step, timeoutMs, delay } = params;
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        function isScrollable(el: HTMLElement): boolean {
          const computedStyle = window.getComputedStyle(el);
          const overflowY = computedStyle.overflowY;
          const hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
          const canScroll =
            ["scroll", "auto"].includes(overflowY) || overflowY === "overlay";

          return hasVerticalScrollbar && canScroll;
        }

        function findBestScrollableElement(
          container: HTMLElement,
        ): HTMLElement {
          if (isScrollable(container)) {
            return container;
          }

          const allElements = Array.from(
            container.querySelectorAll<HTMLElement>("*"),
          );
          let bestElement = container;
          let maxScrollableArea = 0;

          for (const el of allElements) {
            if (isScrollable(el)) {
              const scrollableArea = el.scrollHeight - el.clientHeight;
              if (scrollableArea > maxScrollableArea) {
                maxScrollableArea = scrollableArea;
                bestElement = el;
              }
            }
          }

          return bestElement;
        }

        const scrollEl = findBestScrollableElement(root as HTMLElement);

        if (!isScrollable(scrollEl)) {
          console.warn(
            "No scrollable element found, falling back to scrollTop assignment",
          );
          scrollEl.scrollTop = scrollEl.scrollHeight;
          return;
        }

        const start = Date.now();
        let lastScrollTop = scrollEl.scrollTop;
        let samePositionCount = 0;

        while (
          scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight &&
          Date.now() - start < timeoutMs
        ) {
          scrollEl.scrollBy(0, step);
          await sleep(delay);

          if (scrollEl.scrollTop === lastScrollTop) {
            samePositionCount++;
            if (samePositionCount >= 3) {
              console.warn(
                "Scroll position not changing, breaking out of loop",
              );
              break;
            }
          } else {
            samePositionCount = 0;
          }

          lastScrollTop = scrollEl.scrollTop;
        }

        scrollEl.scrollTop = scrollEl.scrollHeight;
      },
      { step, timeoutMs, delay },
    );
  }
}
