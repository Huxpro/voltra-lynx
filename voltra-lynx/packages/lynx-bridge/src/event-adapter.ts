// Event Adapter — maps Voltra event names to Lynx GlobalEventEmitter
import type { EventSubscription } from './types';

/**
 * Lynx GlobalEventEmitter interface (available on background thread).
 * This is the global event bus in Lynx for cross-component communication.
 */
export interface LynxGlobalEventEmitter {
  addListener(
    event: string,
    listener: (...args: any[]) => void
  ): { remove: () => void };
  removeListener(event: string, listener: (...args: any[]) => void): void;
}

/**
 * Event adapter interface — same as what business logic expects from VoltraModule.addListener
 */
export interface VoltraEventAdapter {
  addListener(event: string, listener: (event: any) => void): EventSubscription;
}

const EVENT_PREFIX = 'voltra:';

/**
 * Creates an event adapter that maps Voltra event names to Lynx's GlobalEventEmitter.
 *
 * Business logic calls: `adapter.addListener("stateChange", cb)`
 * Under the hood:      `GlobalEventEmitter.addListener("voltra:stateChange", cb)`
 */
export function createEventAdapter(
  emitter: LynxGlobalEventEmitter
): VoltraEventAdapter {
  return {
    addListener(
      event: string,
      listener: (event: any) => void
    ): EventSubscription {
      const prefixedEvent = `${EVENT_PREFIX}${event}`;
      const subscription = emitter.addListener(prefixedEvent, listener);
      return {
        remove: () => subscription.remove(),
      };
    },
  };
}
