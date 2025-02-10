/**
 * Connect Web SDK
 * Provides the main API for embedding authentication sessions via iframe or popup.
 */

import { createIframe, destroyIframe } from './iframeHandler';
import { openPopup } from './popupHandler';
import { initPostMessage } from './messageHandler';
import { defaultEventHandlers } from './eventHandlers';

export interface ConnectEventHandlers {
    onDone: (event: any) => void;
    onCancel: (event: any) => void;
    onError: (event: any) => void;
    onRoute?: (event: any) => void;
    onUser?: (event: any) => void;
    onLoad?: () => void;
}

export interface ConnectOptions {
    popup?: boolean;
}

export const Connect = {
    /**
     * Launches the Connect session.
     * @param url The authentication or payment session URL.
     * @param eventHandlers Event handlers for session lifecycle.
     * @param options Configuration options for iframe or popup mode.
     */
    launch(url: string, eventHandlers: ConnectEventHandlers, options: ConnectOptions = {}) {
        const handlers = { ...defaultEventHandlers, ...eventHandlers };

        if (options.popup) {
            const popup = openPopup(url);
            if (!popup) {
                handlers.onError({ message: 'Popup blocked' });
            } else {
                const intervalId = initPostMessage(popup, options);
                popup.onbeforeunload = () => clearInterval(intervalId);
            }
        } else {
            destroyIframe();
            createIframe(url, options, handlers.onLoad || (() => {}));
        }
    },

    /**
     * Destroys the active iframe or popup session.
     */
    destroy() {
        destroyIframe();
    },
};