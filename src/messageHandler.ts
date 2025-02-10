/**
 * Message Handler
 * Manages communication between the iframe, popup, and the main window.
 */

import { PING_EVENT, CONNECT_SDK_VERSION, PLATFORM_POPUP, PLATFORM_IFRAME } from './constants';

/**
 * Initializes postMessage communication.
 * @param targetWindow The target window to send messages to.
 * @param options Additional configuration options.
 * @returns The interval ID of the message loop.
 */
export const initPostMessage = (targetWindow: Window, options: any) => {
    const intervalId = setInterval(() => {
        targetWindow.postMessage({
            type: PING_EVENT,
            sdkVersion: CONNECT_SDK_VERSION,
            platform: options.popup ? PLATFORM_POPUP : PLATFORM_IFRAME,
        }, '*');
    }, 1000);

    return intervalId;
};