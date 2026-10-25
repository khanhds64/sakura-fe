"use client";

import { useQuery } from "@tanstack/react-query";
import { RevenueChart } from "../components/chart/RevenueChart";
import { apiClient } from "../api/config-api";
import {
  DashboardSummary,
  RevenueTrendItem,
  RevenueTrendResponse,
} from "../api";
import { Checkbox } from "../components/core/Checkbox";
import { Body } from "../components/core/Body";
import { ChartColumn, Minus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Heading } from "../components/core/Heading";
import Button from "../components/core/Button";
import { calculatePercentageChange, formatNumberComma } from "../lib/format";
import { filterRevenueFields } from "../lib/chartBuilder";
import classNames from "classnames";

const schema = Yup.object().shape({
  posRevenue: Yup.boolean(),
  eatclubRevenue: Yup.boolean(),
  labourCosts: Yup.boolean(),
  isCompared: Yup.boolean(),
});
const DashboardPageView = () => {
  const { register, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      posRevenue: true,
      eatclubRevenue: true,
      labourCosts: true,
      isCompared: false,
    },
  });

  const watcher = watch();

  const revenueTrend = useQuery<RevenueTrendResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.getDashboardRevenueTrend(true);
      return response.data;
    },
    retry: false,
  });

  const dashboardSummary = useQuery<DashboardSummary>({
    queryKey: ["dashboard sumamry"],
    queryFn: async () => {
      const response = await apiClient.getDashboardSummary();
      return response.data;
    },
    retry: false,
  });

  const selectedFields: (keyof Omit<RevenueTrendItem, "metricDate">)[] = [
    ...(watcher.posRevenue ? ["posRevenue" as const] : []),
    ...(watcher.eatclubRevenue ? ["eatclubRevenue" as const] : []),
    ...(watcher.labourCosts ? ["labourCosts" as const] : []),
  ];

  const filterData = revenueTrend.data
    ? filterRevenueFields(revenueTrend.data, selectedFields)
    : undefined;

  const thisWeekRevenue = dashboardSummary.data?.thisWeek.totalRevenue;
  const lastWeekRevenue = dashboardSummary.data?.lastWeek.totalRevenue;

  const thisWeekCovers = dashboardSummary.data?.thisWeek.totalCovers;
  const lastWeekCovers = dashboardSummary.data?.lastWeek.totalCovers;

  const thisWeekAverageRevenue =
    dashboardSummary.data?.thisWeek.averageRevenuePerDay;
  const lastWeekAverageRevenue =
    dashboardSummary.data?.lastWeek.averageRevenuePerDay;

  const revenueChange = calculatePercentageChange(
    thisWeekRevenue,
    lastWeekRevenue,
  );
  const coversChange = calculatePercentageChange(
    thisWeekCovers,
    lastWeekCovers,
  );
  const averageRevenueChange = calculatePercentageChange(
    thisWeekAverageRevenue,
    lastWeekAverageRevenue,
  );

  if (revenueTrend.isPending) {
    return <Body className="p-4">Loading dashboard...</Body>;
  }

  if (revenueTrend.isError) {
    return (
      <Body className="p-4 text-red-500">
        Failed to load dashboard revenue data.
      </Body>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-2 lg:px-4">
      <div className="flex gap-3 items-start min-h-18">
        <Heading variant="h1" className="w-full max-w-100 min-w-0">
          {watcher.isCompared
            ? "This Week's Revenue Trend vs Last Week"
            : "This Week's Revenue Trend"}
        </Heading>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <Checkbox
              className="border-zinc-800 text-white"
              {...register("posRevenue")}
            >
              <Minus className="text-zinc-800" />
              <Body>POS Revenue</Body>
            </Checkbox>

            <Checkbox
              className="border-zinc-800 text-white"
              {...register("eatclubRevenue")}
            >
              <Minus className="text-blue-700" />
              <Body>Eatclub Revenue</Body>
            </Checkbox>

            <Checkbox
              className="border-zinc-800 text-white"
              {...register("labourCosts")}
            >
              <Minus className="text-orange-700" />
              <Body>Labour Costs</Body>
            </Checkbox>
          </div>

          <Button
            variant={watcher.isCompared ? "active" : "primary"}
            onClick={() => setValue("isCompared", !watcher.isCompared)}
          >
            <ChartColumn size={18} />
            <Heading>Compare to Last Week</Heading>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 text-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Total Revenue</Body>
          {(!watcher.posRevenue || !watcher.eatclubRevenue) && (
            <Heading>--</Heading>
          )}

          {watcher.posRevenue && watcher.eatclubRevenue && (
            <div className="flex gap-3 items-center">
              <Heading variant="h1">
                ${formatNumberComma(thisWeekRevenue)}
              </Heading>

              <div className="flex gap-1">
                <Body className="text-zinc-500">
                  vs ${formatNumberComma(lastWeekRevenue)}
                </Body>
                <Body
                  className={classNames(
                    revenueChange === null || revenueChange < 0
                      ? "text-red-400"
                      : "text-green-400",
                  )}
                >
                  {revenueChange === null
                    ? "--"
                    : `(${revenueChange > 0 ? "+" : ""}${formatNumberComma(revenueChange)}%)`}
                </Body>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Average per Day</Body>

          {(!watcher.posRevenue || !watcher.eatclubRevenue) && <div>--</div>}

          {watcher.posRevenue && watcher.eatclubRevenue && (
            <div className="flex gap-3 items-center">
              <Heading variant="h1">
                ${formatNumberComma(thisWeekAverageRevenue)}
              </Heading>

              <div className="flex gap-1">
                <Body className="text-zinc-500">
                  vs ${formatNumberComma(lastWeekAverageRevenue)}
                </Body>
                <Body
                  className={classNames(
                    averageRevenueChange === null || averageRevenueChange < 0
                      ? "text-red-400"
                      : "text-green-400",
                  )}
                >
                  {averageRevenueChange === null
                    ? "--"
                    : `(${averageRevenueChange > 0 ? "+" : ""}${formatNumberComma(averageRevenueChange)}%)`}
                </Body>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Total Covers</Body>
          <div className="flex gap-3 items-center">
            <Heading variant="h1">${formatNumberComma(thisWeekCovers)}</Heading>

            <div className="flex gap-1">
              <Body className="text-zinc-500">
                vs ${formatNumberComma(lastWeekCovers)}
              </Body>
              <Body
                className={classNames(
                  coversChange === null || coversChange < 0
                    ? "text-red-400"
                    : "text-green-400",
                )}
              >
                {coversChange === null
                  ? "--"
                  : `(${coversChange > 0 ? "+" : ""}${formatNumberComma(coversChange)}%)`}
              </Body>
            </div>
          </div>
        </div>
      </div>
      {filterData && (
        <RevenueChart
          isCompared={watcher.isCompared ?? false}
          data={filterData}
        />
      )}
    </div>
  );
};

export default DashboardPageView;
