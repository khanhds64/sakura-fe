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
import { Minus } from "lucide-react";
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
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (revenueTrend.isError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load dashboard revenue data.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-2 lg:px-4">
      <div className="flex gap-3 items-start">
        <Heading variant="h1" className="w-full max-w-100 min-w-0">
          {watcher.isCompared
            ? "This Week's Revenue Trend vs Last Week"
            : "This Week's Revenue Trend"}
        </Heading>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex gap-2">
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
            variant="primary"
            onClick={() => setValue("isCompared", !watcher.isCompared)}
          >
            <Heading>Compare to Last Week</Heading>
          </Button>
        </div>
      </div>
      <div className="flex gap-3 text-zinc-800">
        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Total Revenue</Body>
          {(!watcher.posRevenue || !watcher.eatclubRevenue) && <div>--</div>}

          {watcher.posRevenue && watcher.eatclubRevenue && (
            <div className="flex gap-3">
              <Heading>${formatNumberComma(thisWeekRevenue)}</Heading>

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
                    : `(${formatNumberComma(revenueChange)}%)`}
                </Body>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Average per Day</Body>

          {(!watcher.posRevenue || !watcher.eatclubRevenue) && <div>--</div>}

          {watcher.posRevenue && watcher.eatclubRevenue && (
            <div className="flex gap-3">
              <Heading>${formatNumberComma(thisWeekAverageRevenue)}</Heading>

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
                    : `(${formatNumberComma(averageRevenueChange)}%)`}
                </Body>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-2 bg-stone-100 border border-stone-200 shadow-sm rounded-xl">
          <Body>Labour Covers</Body>
          <div className="flex gap-3">
            <Heading>${formatNumberComma(thisWeekCovers)}</Heading>

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
                  : `(${formatNumberComma(coversChange)}%)`}
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
