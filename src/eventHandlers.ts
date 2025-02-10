/**
 * Default Event Handlers
 * Provides default empty event handlers for safe execution.
 */

import {
    GlobalConnectAbandonedEvent,
    GlobalConnectCancelEvent,
    GlobalConnectFailedEvent,
    GlobalConnectHandlers, GlobalConnectLinkExpiredEvent,
    GlobalConnectSuccessEvent
} from './index';

export const defaultEventHandlers: GlobalConnectHandlers = {
    onSuccess: (event: GlobalConnectSuccessEvent) => {},
    onCancel: (event: GlobalConnectCancelEvent) => {},
    onFailed: (event: GlobalConnectFailedEvent) => {},
    onAbandoned: (event: GlobalConnectAbandonedEvent) => {},
    onLinkExpired: (event: GlobalConnectLinkExpiredEvent) => {},
    onLoad: () => {},
    // onRoute: () => {},
};