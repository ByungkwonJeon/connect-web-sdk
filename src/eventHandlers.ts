/**
 * Default Event Handlers
 * Provides default empty event handlers for safe execution.
 */

import { ConnectEventHandlers } from './index';

export const defaultEventHandlers: ConnectEventHandlers = {
    onLoad: () => {},
    onUser: () => {},
    onRoute: () => {},
    onDone: () => {},
    onCancel: () => {},
    onError: () => {},
};