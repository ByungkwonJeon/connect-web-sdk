/**
 * Iframe Handler
 * Handles the creation, injection, and removal of iframes.
 */

import { IFRAME_ID, STYLES_ID } from './constants';

/**
 * Creates and injects an iframe for embedding the Connect session.
 * @param url The URL to load in the iframe.
 * @param options Additional configuration options.
 * @param onLoad Callback function triggered when the iframe loads.
 */
export const createIframe = (url: string, options: any, onLoad: () => void) => {
    destroyIframe(); // Ensure no duplicate iframes

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.id = IFRAME_ID;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    document.body.appendChild(iframe);
    iframe.onload = () => onLoad();
    return iframe;
};

/**
 * Destroys the currently active iframe.
 */
export const destroyIframe = () => {
    const iframe = document.getElementById(IFRAME_ID);
    if (iframe) iframe.remove();
};