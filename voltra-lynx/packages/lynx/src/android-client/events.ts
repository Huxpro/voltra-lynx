// Lynx-specific events for Android
import { createEventAdapter, isAndroid } from '../bridge/index.js';
import type {
  EventSubscription,
  VoltraEventMap,
  LynxGlobalEventEmitter,
} from '../bridge/index.js';

export type {
  BasicVoltraEvent,
  VoltraActivityState,
  VoltraActivityTokenReceivedEvent,
  VoltraActivityPushToStartTokenReceivedEvent,
  VoltraActivityUpdateEvent,
  VoltraInteractionEvent,
  VoltraEventMap,
} from '../bridge/index.js';

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
  // On Android client, iOS-only events return no-op
  if (!isAndroid()) {
    console.warn(`[Voltra] Event '${event}' is only supported on iOS. Returning no-op subscription.`)
    return noopSubscription
  }

  return eventAdapter.addListener(event, listener);
}
