/**
 * Message Handler
 * Handles postMessage communication between the SDK and the parent window.
 */

import {
    ACK_EVENT,
    URL_EVENT,
    CANCEL_EVENT,
    FAILED_EVENT,
    ROUTE_EVENT,
    USER_EVENT,
    CLOSE_POPUP_EVENT,
    SUCCESS_EVENT,
    PING_EVENT,
    CONNECT_SDK_VERSION,
    PLATFORM_IFRAME,
    PLATFORM_POPUP,
    POPUP_ACTION_TYPE,
    ABANDONED_EVENT,
    LINK_EXPIRED_EVENT
} from './constants';
import {ConnectOptions, GlobalConnectHandlers} from './index';
import {destroySession} from "./destroy";
import {openPopup} from "./popupHandler";

let onMessageFn: (event: MessageEvent) => void; // ✅ Restore missing reference
let targetWindow: Window | null = null;
let targetOrigin: string = '*'; // Default origin, should be restricted for security

/**
 * Initializes postMessage communication.
 * @param windowRef The target window (popup or iframe).
 * @param options Additional options.
 */
export const initPostMessage = (windowRef: Window, options: ConnectOptions, connectOrigin: string,  handlers: GlobalConnectHandlers) => {

    targetWindow = windowRef;
    targetOrigin = connectOrigin;

    // NOTE: ping connect until it responds
    const intervalId = setInterval(() => {
        const data: Record<string, any> = {
            type: PING_EVENT,
            selector: options.selector,
            sdkVersion: CONNECT_SDK_VERSION,
            platform: `${options.popup ? PLATFORM_POPUP : PLATFORM_IFRAME}`,
        };
        if (options.redirectUrl) data['redirectUrl'] = options.redirectUrl;

        postMessage("redirectUrl", data);
    }, 1000);

    onMessageFn = (event: MessageEvent) => {
        const payload = event.data.data;
        const eventType = event.data.type;

        // Ensure the message is coming from a trusted source
        if (event.origin != connectOrigin) {
            console.warn('Untrusted origin:', event.origin);
            return;
        }


        // NOTE: If onUrl is present in eventHandlers, then SDK won't handle (open/close) the popups.
        // The default behavior for popups remains unchanged if an onUrl handler is not supplied.
        const handlePopups = !!handlers.onUrl;

        // Handle different event types from the iframe or popup
        switch (eventType) {
            case ACK_EVENT:
                console.log('ACK received');
                clearInterval(intervalId);
                break;
            case URL_EVENT:
                console.log('Redirecting:', payload.url);
                if (event.data?.url && typeof event.data.url === 'string') {
                    if (handlers.onUrl) {
                        handlers.onUrl(POPUP_ACTION_TYPE.OPEN, event.data.url);
                    } else {
                        openPopup(event.data.url);
                    }
                } else {
                    console.error('Invalid URL received:', event.data.url);
                }
                break;
            case SUCCESS_EVENT:
                handlers.onSuccess?.(payload);
                break;
            case CANCEL_EVENT:
                handlers.onCancel?.(payload);
                destroySession();
                break;
            case FAILED_EVENT:
                handlers.onFailed?.(payload);
                destroySession();
                break;
            case ABANDONED_EVENT:
                handlers.onAbandoned?.(payload);
                destroySession();
                break;
            case LINK_EXPIRED_EVENT:
                handlers.onLinkExpired?.(payload);
                destroySession();
                break;
            default:
                console.warn('Unhandled event:', eventType);
        }
    };

    // Attach the event listener
    window.addEventListener('message', onMessageFn);
};

/**
 * Sends a message to the target window.
 * @param type The message event type.
 * @param data The payload to be sent.
 */
export const postMessage = (type: string, data: any = {}) => {
    if (!targetWindow) {
        console.error('Target window is not initialized.');
        return;
    }

    const message = {
        type,
        data,
        sdkVersion: CONNECT_SDK_VERSION,
    };

    targetWindow?.postMessage(message, targetOrigin);
};

/**
 * Removes the message event listener.
 */
export const destroyPostMessage = () => {
    window.removeEventListener('message', onMessageFn);
};