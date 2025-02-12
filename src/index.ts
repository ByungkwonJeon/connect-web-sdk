/**
 * Connect Web SDK
 * Provides the main API for embedding authentication sessions via iframe or popup.
 */

import { createIframe, destroyIframe } from './iframeHandler';
import { openPopup } from './popupHandler';
import { initPostMessage } from './messageHandler';
import { defaultEventHandlers } from './eventHandlers';
import {POPUP_ACTION_TYPE} from "./constants";
import {destroySession} from "./destroy";

export interface GlobalConnectHandlers {
    onSuccess: (event: GlobalConnectSuccessEvent) => void;
    onCancel: (event: GlobalConnectCancelEvent) => void;
    onFailed: (event: GlobalConnectFailedEvent) => void;
    onAbandoned: (event: GlobalConnectAbandonedEvent) => void;
    onLinkExpired: (event: GlobalConnectLinkExpiredEvent) => void;
    onLoad?: () => void;
    onUrl?: (type: POPUP_ACTION_TYPE, url?: string) => void;
}

export interface GlobalConnectSuccessEvent {
    accountId: string;
    consentId: string;
    linkId: string;
    bankName?: string;
    last4AccountNumber?: string;
    accountBalance?: string;
    bankLogo?: string;
    accountType?: string;
}

export interface GlobalConnectCancelEvent {
    code: string;
    message: string;
}

export interface GlobalConnectFailedEvent {
    code: string;
    message: string;
}

export interface GlobalConnectAbandonedEvent {
    code: string;
    message: string;
}

export interface GlobalConnectLinkExpiredEvent {
    code: string;
    message: string;
}

export interface ConnectOptions {
    selector?: string;
    node?: Node;
    overlay?: string;
    popup?: boolean;
    popupOptions?: PopupOptions;
    redirectUrl?: string;
}

export interface PopupOptions {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
}

export const Connect = {
    /**
     * Launches the Connect session.
     * @param url The authentication or payment session URL.
     * @param eventHandlers Event handlers for session lifecycle.
     * @param options Configuration options for iframe or popup mode.
     */
    launch(url: string, eventHandlers: GlobalConnectHandlers, options: ConnectOptions = {}) {
        const handlers = { ...defaultEventHandlers, ...eventHandlers };
        const connectOrigin = new URL(url).origin;
        destroySession();
        if (options.popup) {
            const popup = openPopup(url);
            if (!popup) {
                handlers.onFailed({ code: '20001', message: 'Popup blocked' });
            } else {
                initPostMessage(popup, options, connectOrigin, handlers);
                handlers.onLoad && handlers.onLoad();
            }
        } else {
            createIframe(url, options, connectOrigin, handlers);
        }
    },

};