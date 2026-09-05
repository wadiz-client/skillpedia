import { useCallback, useEffect, useRef } from 'react';

import EventTracker from './EventTracker';
import type { TrackingOptions } from './EventTracker';

export const useTrackingEventRef = (options: TrackingOptions) => {
  const refObject = useRef<HTMLElement | undefined>(undefined);

  // 콜백 ref는 요소가 바뀌는 시점에만 실행하고, options 변경은 아래 useEffect에서 반영합니다.
  const ref = useCallback((element: HTMLElement | null) => {
    if (element) {
      EventTracker.unobserve(refObject.current);
      EventTracker.observe(element, options);
    }

    refObject.current = element ?? undefined;
  }, []);

  useEffect(() => {
    if (refObject.current) {
      EventTracker.update(refObject.current, options);
    }
  }, [options]);

  return { ref, refObject };
};
