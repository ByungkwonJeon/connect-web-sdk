import React, { useEffect } from 'react';

const ConnectLauncher: React.FC = () => {
    useEffect(() => {
        const scriptId = 'connect-sdk-script';

        // Prevent duplicate script loading
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.src = '/connect.min.js'; // Assuming it's in public folder
        script.id = scriptId;
        script.async = true;
        script.onload = () => {
            console.log('Connect SDK loaded');
            initializeConnectSDK();
        };

        document.body.appendChild(script);

        return () => {
            // Optional cleanup
            const sdkScript = document.getElementById(scriptId);
            if (sdkScript) document.body.removeChild(sdkScript);
        };
    }, []);

    const initializeConnectSDK = () => {
        if (window.GlobalConnect) {
            const sdk = new window.GlobalConnect();

            sdk.launch({
                url: "https://your-launch-url.com", // your actual connect URL
                onSuccess: () => console.log("Connected successfully"),
                onCancel: () => console.log("User cancelled"),
                onFailure: (e: any) => console.error("Connection failed", e),
            });
        } else {
            console.error("GlobalConnect is not available.");
        }
    };

    return (
        <div>
            <h2>Launch Connect</h2>
            <button onClick={initializeConnectSDK}>Launch</button>
        </div>
    );
};

export default ConnectLauncher;