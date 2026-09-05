import { sendGTMEvent } from '@next/third-parties/google';

type EventParameters = Record<string, boolean | number | string>;

export const trackingEvent = (eventName: string, parameters: EventParameters = {}) => {
  if (process.env.NODE_ENV === 'production') {
    sendGTMEvent({ event: eventName, ...parameters });
  }
};
