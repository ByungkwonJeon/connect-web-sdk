/**
 * Iframe Handler
 * Handles the creation, injection, and removal of iframes.
 */

import { IFRAME_ID, STYLES_ID } from './constants';
import {GlobalConnectHandlers} from "./index";
import {initPostMessage} from "./messageHandler";

/**
 * Creates and injects an iframe for embedding the Connect session.
 * @param url The URL to load in the iframe.
 * @param options Additional configuration options.
 * @param onLoad Callback function triggered when the iframe loads.
 */
export const createIframe = (url: string, options: any, connectOrigin: string, handlers: GlobalConnectHandlers) => {
    destroyIframe(); // Ensure no duplicate iframes

    if (!document.getElementById(STYLES_ID)) {
        const style = document.createElement('style');
        style.id = STYLES_ID;
        style.type = 'text/css';
        style.innerHTML = `#${IFRAME_ID} {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          background: rgba(0,0,0,0.8);
        }`;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    let metaArray = document.querySelectorAll('meta[name="viewport"]');
    if (metaArray.length === 0) {
        const metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=1');
        document.head.appendChild(metaEl);
    }

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.id = IFRAME_ID;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.ariaLabel = 'Launching Modal';
    iframe.title = 'Launching Modal';

    if (options.overlay) {
        iframe.style.background = options.overlay;
    }

    if (options.node) {
        options.node.appendChild(iframe);
    } else {
        // NOTE: attach to selector if specified
        const parentEl = !!options.selector
            ? document.querySelector(options.selector)
            : document.body;
        if (parentEl) {
            parentEl.appendChild(iframe);
        } else {
            console.warn(
                `Couldn't find any elements matching "${options.selector}", appending "iframe" to "body" instead.`
            );
            document.body.appendChild(iframe);
        }
    }

    iframe.onload = () => {
        const targetWindow = iframe.contentWindow;
        if (targetWindow) {
            initPostMessage(targetWindow, options, connectOrigin, handlers);
        } else {
            console.error('Failed to initialize post message: iframe contentWindow is null.');
        }
        handlers.onLoad && handlers.onLoad();
    };
    return iframe;

};

/**
 * Destroys the currently active iframe.
 */
export const destroyIframe = () => {
    const iframe = document.getElementById(IFRAME_ID);
    if (iframe) iframe.remove();
};