import * as echarts from 'echarts';
import { RevenueTrendItem, RevenueTrendResponse } from '../api';
import { formatLargeNumber, getDayName } from './format';
import { COLORS } from './constants';

export type RevenueTrendItemOptional = {
    metricDate: string;
} & Partial<Omit<RevenueTrendItem, 'metricDate'>>;

export type RevenueTrendResponseOptional = {
    currentWeek: RevenueTrendItemOptional[];
    lastWeek?: RevenueTrendItemOptional[];
};

export function filterRevenueFields(
    data: RevenueTrendResponse,
    fields: (keyof Omit<RevenueTrendItem, "metricDate">)[]
): RevenueTrendResponseOptional {
    const filterItems = (
        items: RevenueTrendItem[]
    ): RevenueTrendItemOptional[] =>
        items.map(item => {
            const result: RevenueTrendItemOptional = {
                metricDate: item.metricDate,
            };

            fields.forEach(field => {
                result[field] = item[field];
            });

            return result;
        });

    return {
        currentWeek: filterItems(data.currentWeek),
        ...(data.lastWeek && {
            lastWeek: filterItems(data.lastWeek),
        }),
    };
}


export const buildChartOption = (
    data: RevenueTrendResponseOptional,
    isCompareMode: boolean
): echarts.EChartsOption => {
    const xAxisData = data.currentWeek.map(d =>
        getDayName(d.metricDate)
    );

    const hasPos =
        data.currentWeek.some(d => d.posRevenue != null) ||
        data.lastWeek?.some(d => d.posRevenue != null);

    const hasEatclub =
        data.currentWeek.some(d => d.eatclubRevenue != null) ||
        data.lastWeek?.some(d => d.eatclubRevenue != null);

    const hasLabour =
        data.currentWeek.some(d => d.labourCosts != null) ||
        data.lastWeek?.some(d => d.labourCosts != null);

    const legendData: string[] = [];
    const series: echarts.SeriesOption[] = [];

    // current week data
    if (hasPos) {
        legendData.push('POS Revenue');

        series.push({
            name: 'POS Revenue',
            type: 'bar',
            stack: 'currentRevenue',
            data: data.currentWeek.map(d => d.posRevenue ?? 0),
            itemStyle: {
                color: COLORS.pos
            },
            barWidth: '18%'
        });
    }

    if (hasEatclub) {
        legendData.push('Eatclub Revenue');

        series.push({
            name: 'Eatclub Revenue',
            type: 'bar',
            stack: 'currentRevenue',
            data: data.currentWeek.map(d => d.eatclubRevenue ?? 0),
            itemStyle: {
                color: COLORS.eatclub,
                borderRadius: [4, 4, 0, 0]
            },
            barWidth: '18%'
        });
    }

    if (hasLabour) {
        legendData.push('Labour Costs');

        series.push({
            name: 'Labour Costs',
            type: 'bar',
            stack: 'currentLabour',
            data: data.currentWeek.map(d => d.labourCosts ?? 0),
            itemStyle: {
                color: COLORS.labour,
                borderRadius: [4, 4, 0, 0]
            },
            barWidth: '18%'
        });
    }

    // last week data
    if (isCompareMode && data.lastWeek) {
        if (hasPos) {
            legendData.push('Last Week POS Revenue');

            series.push({
                name: 'Last Week POS Revenue',
                type: 'bar',
                stack: 'lastRevenue',
                data: data.lastWeek.map(d => d.posRevenue ?? 0),
                itemStyle: {
                    color: COLORS.prevPos
                },
                barWidth: '18%'
            });
        }

        if (hasEatclub) {
            legendData.push('Last Week Eatclub Revenue');

            series.push({
                name: 'Last Week Eatclub Revenue',
                type: 'bar',
                stack: 'lastRevenue',
                data: data.lastWeek.map(d => d.eatclubRevenue ?? 0),
                itemStyle: {
                    color: COLORS.prevEatclub,
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: '18%'
            });
        }

        if (hasLabour) {
            legendData.push('Last Week Labour Costs');

            series.push({
                name: 'Last Week Labour Costs',
                type: 'bar',
                stack: 'lastLabour',
                data: data.lastWeek.map(d => d.labourCosts ?? 0),
                itemStyle: {
                    color: COLORS.prevLabour,
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: '18%'
            });
        }
    }

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        legend: {
            bottom: 0,
            icon: 'circle',
            data: legendData
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: true,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        },

        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#eee'
                }
            },
            axisLabel: {
                formatter: (value: number) =>
                    formatLargeNumber(value)
            }
        },

        series
    };
};