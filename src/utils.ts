/**
 * Utility Functions
 * Provides helper methods used across the SDK.
 */

/**
 * Debounces a function to limit its execution rate.
 * @param func The function to debounce.
 * @param delay Delay time in milliseconds.
 */
export const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>; // ✅ Supports both Node.js & Browsers

    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Detects if the user is on a mobile device.
 * @returns Boolean indicating if the device is mobile.
 */
export const isMobile = (): boolean => window.innerWidth < 768;