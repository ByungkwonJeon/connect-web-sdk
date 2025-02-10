/**
 * Popup Handler
 * Manages the opening and positioning of popups.
 */

import { POPUP_WIDTH, POPUP_HEIGHT } from './constants';

/**
 * Opens a popup window for the Connect session.
 * @param url The URL to open in the popup.
 * @returns The created popup window or null if blocked.
 */
export const openPopup = (url: string): Window | null => {
    const popup = window.open(
        url,
        'connectPopup',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=100,left=100`
    );
    popup?.focus();
    return popup;
};