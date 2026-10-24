"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import {
  buildChartOption,
  RevenueTrendResponseOptional,
} from "@/src/lib/chartBuilder";

interface Props {
  data: RevenueTrendResponseOptional;
  isCompared: boolean;
}

export const RevenueChart = ({ data, isCompared }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Initialize the chart and observe container size.
  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      if (width <= 0 || height <= 0) return;

      if (!chartInstance.current) {
        chartInstance.current = echarts.init(container);
      }

      chartInstance.current.resize();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Update options whenever data or comparison settings change.
  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart) return;

    chart.setOption(buildChartOption(data, isCompared), true);
  }, [data, isCompared]);

  // Retry setting options after the chart is initialized.
  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      if (width <= 0 || height <= 0 || !chartInstance.current) return;

      chartInstance.current.setOption(buildChartOption(data, isCompared), true);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [data, isCompared]);

  return (
    <div className="w-full">
      <div ref={chartRef} className="w-full h-100" />
    </div>
  );
};
