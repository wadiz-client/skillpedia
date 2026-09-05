import { trackingEvent } from './trackingEvent';

/*
 * 히어로 섹션
 */

export const trackingHeroSubmitButtonClick = (repository: string, isExample: boolean) => {
  trackingEvent('hero_submit_button_click', { repository, is_example: isExample });
};

/*
 * 저장소 둘러보기 섹션
 */

export const trackingRepositoryCardClick = (repository: string, rank: number) => {
  trackingEvent('repository_card_click', { repository, rank });
};

export const trackingRepositoryCardImpression = (repository: string, rank: number) => {
  trackingEvent('repository_card_impression', { repository, rank });
};
