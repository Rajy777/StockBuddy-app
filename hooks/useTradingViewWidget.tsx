'use client';
import { useEffect, useRef } from "react";

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const configString = JSON.stringify(config);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clean up everything from previous runs
        container.innerHTML = '';

        // Create the widget div
        const containerId = (config.container_id as string) || `tradingview_${Math.random().toString(36).substring(7)}`;
        const widgetDiv = document.createElement('div');
        widgetDiv.id = containerId;
        widgetDiv.className = 'tradingview-widget-container__widget';
        widgetDiv.style.width = '100%';
        widgetDiv.style.height = `${height}px`;
        container.appendChild(widgetDiv);

        // Create and append the script
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.type = "text/javascript";
        script.async = true;

        // For embed-widget-* scripts, the config goes inside the script tag
        script.innerHTML = JSON.stringify({
            ...config,
            container_id: containerId,
            width: "100%",
            height: height
        });

        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [scriptUrl, configString, height]);

    return containerRef;
};
export default useTradingViewWidget