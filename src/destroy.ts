/**
 * Destroy Module
 * Handles cleanup of iframes, popups, and event listeners.
 */

import { destroyIframe } from './iframeHandler';
import { closePopup } from './popupHandler';
import { destroyPostMessage } from './messageHandler';

let intervalId: number | null = null;

/**
 * Destroys active session components (iframe, popup, and event listeners).
 */
export const destroySession = () => {
    destroyIframe();
    closePopup();
    destroyPostMessage();
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    console.log('Session destroyed successfully.');
};

/**
 * Sets the interval ID to be managed for cleanup.
 * @param id Interval ID to be cleared on session destruction.
 */
export const setIntervalId = (id: number) => {
    intervalId = id;
};
