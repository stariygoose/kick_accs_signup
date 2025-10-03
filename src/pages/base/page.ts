import { Page } from "patchright";
import logger from "../../utils/logger.js";

export abstract class BasePage {
  private timeout: number = 5000;
	protected readonly URL: string = "https://kick.com/";

  constructor(protected readonly page: Page) {}

  public abstract execute(): Promise<void>;
  public async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // Проверка готовности элемента к взаимодействию
  protected async waitForElementReady(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForFunction(
      (sel) => {
        const element = document.querySelector(sel) as HTMLElement;
        if (!element) return false;
        
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        return (
          element.offsetParent !== null && // элемент видимый
          !element.hasAttribute('disabled') && // не отключен
          style.pointerEvents !== 'none' && // можно кликать
          style.opacity !== '0' && // непрозрачный
          rect.width > 0 && rect.height > 0 // имеет размеры
        );
      },
      selector,
      { timeout }
    );
  }

  // Проверка видимости элемента в viewport
  protected async isElementInViewport(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }

  protected async click(selector: string, options?: { timeout?: number; retries?: number }): Promise<void> {
    const { timeout = this.timeout, retries = 3 } = options || {};
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Ждём элемент и проверяем его готовность
        await this.page.waitForSelector(selector, { timeout, state: 'visible' });
        logger.debug(`Кнопка с селектором ${selector} найдена (попытка ${attempt}/${retries}).`);

        // Ждём чтобы элемент стал интерактивным
        await this.page.waitForFunction(
          (sel) => {
            const element = document.querySelector(sel) as HTMLElement;
            return element && 
                   !element.hasAttribute('disabled') && 
                   getComputedStyle(element).pointerEvents !== 'none' &&
                   element.offsetParent !== null; // элемент видим
          },
          selector,
          { timeout: 2000 }
        );

        // Прокручиваем к элементу если нужно
        await this.page.locator(selector).scrollIntoViewIfNeeded();
        
        // Небольшая задержка для стабилизации
        await this.page.waitForTimeout(200);
        
        // Кликаем
        await this.page.click(selector, { timeout: 3000 });
        logger.debug(`Кнопка с селектором ${selector} успешно кликнута.`);
        return;
        
      } catch (e) {
        logger.warn(`Попытка ${attempt}/${retries} клика по ${selector} неудачна: ${(e as Error).message}`);
        
        if (attempt === retries) {
          logger.error(`Не удалось нажать на кнопку с селектором ${selector} после ${retries} попыток.`);
          throw e;
        }
        
        // Ждём перед повторной попыткой
        await this.page.waitForTimeout(1000 * attempt);
      }
    }
  }

  protected async fill(selector: string, value: string, options?: { timeout?: number; retries?: number; clearFirst?: boolean }): Promise<void> {
    const { timeout = this.timeout, retries = 2, clearFirst = true } = options || {};
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Ждём элемент и проверяем его готовность
        await this.page.waitForSelector(selector, { timeout, state: 'visible' });
        logger.debug(`Поле с селектором ${selector} найдено (попытка ${attempt}/${retries}).`);

        // Проверяем что поле готово к вводу
        await this.page.waitForFunction(
          (sel) => {
            const element = document.querySelector(sel) as HTMLInputElement;
            return element && 
                   !element.hasAttribute('disabled') && 
                   !element.hasAttribute('readonly') &&
                   getComputedStyle(element).pointerEvents !== 'none' &&
                   element.offsetParent !== null;
          },
          selector,
          { timeout: 2000 }
        );

        // Проверяем, не заполнено ли поле уже
        const currentValue = await this.page.inputValue(selector);
        if (currentValue === value) {
          logger.debug(`Поле с селектором ${selector} уже содержит нужное значение "${value}".`);
          return;
        }

        // Фокусируемся на элементе
        await this.page.focus(selector);
        await this.page.waitForTimeout(100);

        // Очищаем поле если нужно
        if (clearFirst && currentValue) {
          await this.page.fill(selector, '');
          await this.page.waitForTimeout(100);
        }

        // Вводим текст с помощью fill (более надежный метод)
        await this.page.fill(selector, value);
        await this.page.waitForTimeout(200);
        
        // Проверяем что значение действительно введено
        const actualValue = await this.page.inputValue(selector);
        if (actualValue === value) {
          logger.debug(`Поле с селектором ${selector} успешно заполнено значением "${value}".`);
          return;
        } else {
          // Более мягкая проверка - если значение содержит нужный текст, считаем успешным
          if (actualValue.includes(value) && attempt === retries) {
            logger.debug(`Поле с селектором ${selector} содержит ожидаемое значение: "${actualValue}".`);
            return;
          }
          throw new Error(`Значение не совпадает: ожидалось "${value}", получено "${actualValue}"`);
        }
        
      } catch (e) {
        logger.warn(`Попытка ${attempt}/${retries} заполнения ${selector} неудачна: ${(e as Error).message}`);
        
        if (attempt === retries) {
          logger.error(`Не удалось заполнить поле ${selector} значением "${value}" после ${retries} попыток.`);
          throw e;
        }
        
        // Ждём перед повторной попыткой
        await this.page.waitForTimeout(500);
      }
    }
  }

  protected async scroll(
    selector: string,
    opts?: { step?: number; timeoutMs?: number; delay?: number; retries?: number },
  ): Promise<void> {
    const { step = 500, timeoutMs = 10000, delay = 100, retries = 3 } = opts || {};
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`Попытка прокрутки ${attempt}/${retries} для селектора ${selector}`);
        
        const locator = this.page.locator(selector);
        await locator.waitFor({ state: "visible", timeout: 5000 });

        // Проверяем результат прокрутки
        const scrollResult = await locator.evaluate(
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
            const initialScrollTop = scrollEl.scrollTop;

            if (!isScrollable(scrollEl)) {
              console.warn(
                "Прокручиваемый элемент не найден, используем назначение scrollTop",
              );
              scrollEl.scrollTop = scrollEl.scrollHeight;
              return { success: true, scrolled: scrollEl.scrollTop > initialScrollTop };
            }

            const start = Date.now();
            let lastScrollTop = scrollEl.scrollTop;
            let samePositionCount = 0;
            let actuallyScrolled = false;

            while (
              scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight &&
              Date.now() - start < timeoutMs
            ) {
              const beforeScroll = scrollEl.scrollTop;
              scrollEl.scrollBy(0, step);
              await sleep(delay);

              if (scrollEl.scrollTop > beforeScroll) {
                actuallyScrolled = true;
              }

              if (scrollEl.scrollTop === lastScrollTop) {
                samePositionCount++;
                if (samePositionCount >= 3) {
                  console.warn(
                    "Позиция прокрутки не изменяется, выходим из цикла",
                  );
                  break;
                }
              } else {
                samePositionCount = 0;
              }

              lastScrollTop = scrollEl.scrollTop;
            }

            // Финальная прокрутка до конца
            scrollEl.scrollTop = scrollEl.scrollHeight;
            
            return { 
              success: true, 
              scrolled: actuallyScrolled || scrollEl.scrollTop > initialScrollTop,
              finalScrollTop: scrollEl.scrollTop,
              scrollHeight: scrollEl.scrollHeight
            };
          },
          { step, timeoutMs, delay },
        );

        if (scrollResult.success && scrollResult.scrolled) {
          logger.debug(`Прокрутка успешно выполнена для ${selector}`);
          return;
        } else if (scrollResult.success && !scrollResult.scrolled) {
          logger.warn(`Элемент ${selector} уже прокручен до конца`);
          return;
        }
        
      } catch (e) {
        logger.warn(`Попытка ${attempt}/${retries} прокрутки ${selector} неудачна: ${(e as Error).message}`);
        
        if (attempt === retries) {
          logger.error(`Не удалось прокрутить элемент ${selector} после ${retries} попыток.`);
          throw e;
        }
        
        // Ждём перед повторной попыткой
        await this.page.waitForTimeout(1000 * attempt);
      }
    }
  }
}
