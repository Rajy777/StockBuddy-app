'use client';
import React, { memo, useEffect } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps {
    title?: string;
    scriptUrl: string;
    config: Record<string, unknown>;
    height?: number;
    className?: string;
}

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className }: TradingViewWidgetProps) => {
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    useEffect(() => {
        console.log(`[DEBUG] Widget initialized with config for:`, config.symbol);
    }, [config]);

    return (
        <div className="w-full">
            {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}
            <div className={cn('tradingview-widget-container', className)} ref={containerRef} style={{ height }}>
                {/* Hook will manage internal structure to avoid re-initialization conflicts */}
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);