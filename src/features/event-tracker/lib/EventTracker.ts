const IMPRESSION_INTERVAL_TIME = 100;
const IMPRESSION_THRESHOLD = 0.5;
const IMPRESSION_TIME = 1000;

const IMPRESSION_FIRED_ATTRIBUTE = 'data-impression-fired';
const IMPRESSION_ONCE_ATTRIBUTE = 'data-impression-once';
const IMPRESSION_TIME_ATTRIBUTE = 'data-impression-time';

export interface TrackingOptions {
  clickCallback?: () => void;
  impressionCallback?: () => void;
  shouldTrackImpressionOnce?: boolean;
}

class EventTracker {
  private clickMap = new Map<HTMLElement, () => void>();
  private impressionMap = new Map<HTMLElement, () => void>();
  private impressionQueue = new Set<HTMLElement>();
  private impressionQueueTimeout: ReturnType<typeof setInterval> | null = null;
  // 서버에서 모듈을 평가하는 시점에는 IntersectionObserver가 없으므로 첫 관찰 시점에 만듭니다.
  private observer: IntersectionObserver | null = null;

  static reset(element: HTMLElement) {
    if (element.getAttribute(IMPRESSION_FIRED_ATTRIBUTE) === '1' && element.getAttribute(IMPRESSION_ONCE_ATTRIBUTE) !== '1') {
      element.setAttribute(IMPRESSION_TIME_ATTRIBUTE, '0');
      element.removeAttribute(IMPRESSION_FIRED_ATTRIBUTE);
    }
  }

  private getObserver() {
    this.observer ??= new IntersectionObserver(this.handleIntersect.bind(this), { threshold: IMPRESSION_THRESHOLD });

    return this.observer;
  }

  private handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;

      if (entry.isIntersecting) {
        this.impressionQueue.add(target);
        this.startImpressionQueue();

        return;
      }

      this.impressionQueue.delete(target);

      if (target.getAttribute(IMPRESSION_ONCE_ATTRIBUTE) === '1' && target.getAttribute(IMPRESSION_FIRED_ATTRIBUTE) === '1') {
        observer.unobserve(target);
      }

      EventTracker.reset(target);
    });
  }

  private startImpressionQueue() {
    if (this.impressionQueueTimeout) {
      return;
    }

    this.impressionQueueTimeout = setInterval(() => {
      if (this.impressionQueue.size === 0) {
        this.stopImpressionQueue();

        return;
      }

      this.impressionQueue.forEach((element) => {
        if (element.getAttribute(IMPRESSION_FIRED_ATTRIBUTE) === '1') {
          return;
        }

        const elapsedTime = Number(element.getAttribute(IMPRESSION_TIME_ATTRIBUTE) ?? 0) + IMPRESSION_INTERVAL_TIME;

        element.setAttribute(IMPRESSION_TIME_ATTRIBUTE, `${elapsedTime}`);

        if (elapsedTime >= IMPRESSION_TIME) {
          this.impressionMap.get(element)?.();
          element.setAttribute(IMPRESSION_FIRED_ATTRIBUTE, '1');
        }
      });
    }, IMPRESSION_INTERVAL_TIME);
  }

  private stopImpressionQueue() {
    if (this.impressionQueueTimeout) {
      clearInterval(this.impressionQueueTimeout);
    }

    this.impressionQueueTimeout = null;
  }

  observe(element: HTMLElement, options: TrackingOptions) {
    if (options.clickCallback) {
      this.clickMap.set(element, options.clickCallback);
      element.addEventListener('click', options.clickCallback);
    }

    if (options.impressionCallback) {
      this.impressionMap.set(element, options.impressionCallback);
      this.getObserver().observe(element);

      if (options.shouldTrackImpressionOnce) {
        element.setAttribute(IMPRESSION_ONCE_ATTRIBUTE, '1');
      }
    }
  }

  update(element: HTMLElement, options: TrackingOptions) {
    if (options.clickCallback) {
      this.clickMap.set(element, options.clickCallback);
    }

    if (options.impressionCallback) {
      this.impressionMap.set(element, options.impressionCallback);
    }
  }

  unobserve(element?: HTMLElement) {
    if (!element) {
      return;
    }

    this.getObserver().unobserve(element);
    this.impressionQueue.delete(element);
    this.impressionMap.delete(element);

    element.removeAttribute(IMPRESSION_TIME_ATTRIBUTE);
    element.removeAttribute(IMPRESSION_FIRED_ATTRIBUTE);

    const clickCallback = this.clickMap.get(element);

    if (clickCallback) {
      element.removeEventListener('click', clickCallback);
    }

    this.clickMap.delete(element);
  }
}

export default new EventTracker();
