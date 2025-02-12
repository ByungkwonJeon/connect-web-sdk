/**
 * Popup Handler
 * Manages the opening and positioning of popups.
 */

import {POPUP_WIDTH, POPUP_HEIGHT, WINDOW_EVENT} from './constants';

/**
 * ClosePopup Module
 * Handles closing of the popup window and related cleanup.
 */

let popupWindow: Window | null = null;

/**
 * Opens a popup window for the Connect session.
 * @param url The URL to open in the popup.
 * @returns The created popup window or null if blocked.
 */
export const openPopup = (url: string): Window | null => {
    const top =
        window.self.outerHeight / 2 + window.self.screenY - POPUP_HEIGHT / 2;
    const left =
        window.self.outerWidth / 2 + window.self.screenX - POPUP_WIDTH / 2;
    popupWindow = window.open(
        url,
        'targetWindow',
        `toolbar=no,location=no,status=no,menubar=no,width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left}`
    );

    if (popupWindow) {
        popupWindow.focus();
        const intervalId = setInterval(() => {
            // clear itself if window no longer exists or has been closed
            if (popupWindow?.closed) {
                // window closed, notify connect
                clearInterval(intervalId);
                postMessage({
                    type: WINDOW_EVENT,
                    closed: true,
                    blocked: false,
                });
            }
        }, 1000);
    } else {
        postMessage({
            type: WINDOW_EVENT,
            closed: true,
            blocked: true,
        });
    }
    popupWindow?.focus();
    return popupWindow;
};

/**
 * Closes the currently open popup window if it exists.
 */
export const closePopup = () => {
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
        console.log('Popup window closed successfully.');
    } else {
        console.warn('No active popup window to close.');
    }
    popupWindow = null;
};