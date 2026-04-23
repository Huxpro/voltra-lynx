// Lynx-specific events — replaces Expo's Platform + addListener pattern
import { createEventAdapter, assertRunningOnIOS } from '../bridge/index.js';
import type {
  EventSubscription,
  VoltraEventMap,
  LynxGlobalEventEmitter,
} from '../bridge/index.js';

// Re-export event types for consumers
export type {
  BasicVoltraEvent,
  VoltraActivityState,
  VoltraActivityTokenReceivedEvent,
  VoltraActivityPushToStartTokenReceivedEvent,
  VoltraActivityUpdateEvent,
  VoltraInteractionEvent,
  VoltraEventMap,
} from '../bridge/index.js';

// Lynx GlobalEventEmitter is available on the background thread
declare const GlobalEventEmitter: LynxGlobalEventEmitter;

const noopSubscription: EventSubscription = {
  remove: () => {},
};

const eventAdapter = createEventAdapter(
  typeof GlobalEventEmitter !== 'undefined'
    ? GlobalEventEmitter
    : { addListener: () => ({ remove: () => {} }), removeListener: () => {} }
);

export function addVoltraListener<K extends keyof VoltraEventMap>(
  event: K,
  listener: (event: VoltraEventMap[K]) => void
): EventSubscription {
  if (!assertRunningOnIOS()) {
    return noopSubscription;
  }

  return eventAdapter.addListener(event, listener);
}
