/**
 * Connect Web SDK Constants
 * This file contains all constant values used across the SDK.
 */

export const IFRAME_ID = 'connect-iframe';
export const STYLES_ID = 'connect-styles';

export const POPUP_WIDTH = 600;
export const POPUP_HEIGHT = 800;
export const CONNECT_POPUP_WIDTH = 400;
export const CONNECT_POPUP_HEIGHT = 600;

// Event types for communication via postMessage
export const ACK_EVENT = 'ACK_EVENT';
export const CANCEL_EVENT = 'CANCEL_EVENT';
export const URL_EVENT = 'URL_EVENT';
export const DONE_EVENT = 'DONE_EVENT';
export const ERROR_EVENT = 'ERROR_EVENT';
export const PING_EVENT = 'PING_EVENT';
export const WINDOW_EVENT = 'WINDOW_EVENT';
export const ROUTE_EVENT = 'ROUTE_EVENT';
export const USER_EVENT = 'USER_EVENT';
export const CLOSE_POPUP_EVENT = 'CLOSE_POPUP_EVENT';

// Platform identification for debugging
export const PLATFORM_POPUP = 'PLATFORM_POPUP';
export const PLATFORM_IFRAME = 'PLATFORM_IFRAME';

// SDK version
export const CONNECT_SDK_VERSION = '1.0.0';