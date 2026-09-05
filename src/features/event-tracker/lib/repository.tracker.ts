import { trackingEvent } from './trackingEvent';

/*
 * 사이드바 문서 목록
 */

export const trackingSidebarDocumentLinkClick = (repository: string, path: string) => {
  trackingEvent('sidebar_document_link_click', { repository, path });
};

/*
 * 문서 본문 코드 블록
 */

export const trackingCodeBlockCopyButtonClick = (language: string) => {
  trackingEvent('code_block_copy_button_click', { language });
};
