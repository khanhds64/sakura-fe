"use client";

import {
  useTable,
  createColumnHelper,
  flexRender,
  type PaginationState,
} from "@tanstack/react-table";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";
import { Calendar, Pencil, Plus } from "lucide-react";

import { SearchBox, TDailyMetricFilter } from "./SearchBox";
import { Pagination } from "./Pagination";
import { features } from "./tableFeatures";

import { DailyMetricItem, DailyMetricList } from "@/src/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import Button from "@/src/components/core/Button";
import { Heading } from "@/src/components/core/Heading";
import { apiClient } from "@/src/api/config-api";
import Link from "next/link";
import { formatNumberComma } from "@/src/lib/format";
import { PAGE_SIZE_DEFAULT } from "@/src/lib/constants";

const columnHelper = createColumnHelper<typeof features, DailyMetricItem>();

const DailyMetricListPageView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read filter and pagination state from the url
  const searchParamStr = searchParams.toString();

  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const parsedPage = _.toNumber(searchParams.get("currentPage") ?? 1);
  const parsedPageSize = _.toNumber(
    searchParams.get("itemsPerPage") ?? PAGE_SIZE_DEFAULT,
  );

  const currentPage =
    _.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const itemsPerPage =
    _.isInteger(parsedPageSize) && parsedPageSize > 0
      ? parsedPageSize
      : PAGE_SIZE_DEFAULT;

  const pagination: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  };

  // Update url parameters without removing unrelated parameters
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParamStr);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();

    router.push(queryString ? `/management?${queryString}` : "/management", {
      scroll: false,
    });
  };

  const {
    data: dailyMetricListQuery,
    isPending,
    isError,
    error,
  } = useQuery<DailyMetricList>({
    queryKey: [
      "adminDailyMetrics",
      startDate,
      endDate,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () =>
      apiClient
        .getDailyMetricList(
          startDate || undefined,
          endDate || undefined,
          currentPage,
          itemsPerPage,
        )
        .then((response) => response.data),
    placeholderData: keepPreviousData,
  });

  const data = dailyMetricListQuery?.data ?? [];
  const totalItems = dailyMetricListQuery?.totalItems ?? 0;
  const totalPages = dailyMetricListQuery?.totalPages ?? 0;

  // Searching updates the url and resets pagination to page 1
  const onSearch = (values: TDailyMetricFilter) => {
    updateQueryParams({
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      currentPage: null,
    });
  };

  // Keep tanstack pagination changes synchronized with the url
  const onPaginationChange = (
    updater: PaginationState | ((previous: PaginationState) => PaginationState),
  ) => {
    const nextPagination =
      typeof updater === "function" ? updater(pagination) : updater;

    updateQueryParams({
      currentPage: _.toString(nextPagination.pageIndex + 1),
      itemsPerPage: _.toString(nextPagination.pageSize),
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    updateQueryParams({
      currentPage: _.toString(nextPage),
    });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    updateQueryParams({
      currentPage: "1",
      itemsPerPage: _.toString(nextPageSize),
    });
  };

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("metricDate", {
          header: "Metric Date",
          cell: (info) => (
            <div className="flex items-center gap-3">
              <Calendar size={20} />
              <span className="text-sm text-zinc-800">{info.getValue()}</span>
            </div>
          ),
        }),

        columnHelper.accessor("posRevenue", {
          header: "POS Revenue",
          cell: (info) => (
            <span className="text-sm text-zinc-800">
              {formatNumberComma(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("eatclubRevenue", {
          header: "EatClub Revenue",
          cell: (info) => (
            <span className="text-sm text-zinc-800">
              {formatNumberComma(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("labourCosts", {
          header: "Labour Costs",
          cell: (info) => (
            <span className="text-sm text-zinc-800">
              {formatNumberComma(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("covers", {
          header: "Covers",
          cell: (info) => (
            <span className="text-sm text-zinc-800">
              {formatNumberComma(info.getValue())}
            </span>
          ),
        }),

        columnHelper.display({
          id: "actions",
          header: "Action",
          cell: (info) => {
            const id = info.row.original.id;
            const params = new URLSearchParams(searchParamStr);
            params.set("id", _.toString(id));

            return (
              <div className="flex justify-end">
                <Link href={`/management/edit?${params.toString()}`}>
                  <Button variant="secondary">
                    <Pencil size={20} />
                    Edit
                  </Button>
                </Link>
              </div>
            );
          },
        }),
      ]),
    [searchParamStr],
  );

  const table = useTable({
    features,
    data,
    columns,
    state: { pagination },
    onPaginationChange,
    manualPagination: true,
    pageCount: totalPages,
  });

  // For re-render searchbox with new key
  const currentTab = pathname.split("/").slice(0, 2).join("/");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Heading variant="h0">Daily Metrics</Heading>

        <Link
          href={(() => {
            const params = new URLSearchParams(searchParamStr);
            params.set("formInstance", crypto.randomUUID());

            return `/management/create?${params.toString()}`;
          })()}
        >
          <Button className="h-auto min-h-11">
            <Plus size={20} />
            <Heading>Create</Heading>
          </Button>
        </Link>
      </div>

      <SearchBox
        key={currentTab}
        initialValues={{
          startDate,
          endDate,
        }}
        onSearch={onSearch}
      />

      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-6 border-b border-blue-100 bg-blue-50 px-6 py-3.5">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className={`text-sm font-medium text-blue-700 ${
                  header.id === "actions" ? "text-right" : "text-left"
                }`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </div>
            )),
          )}
        </div>

        {/* Body */}
        <div className="max-h-100 overflow-y-auto">
          {isPending ? (
            <div className="px-6 py-12 text-center text-sm text-zinc-500">
              Loading daily metrics...
            </div>
          ) : isError ? (
            <div className="px-6 py-12 text-center text-sm text-red-600">
              Failed to load daily metrics: {error.message}
            </div>
          ) : data.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-zinc-500">
              No records found.
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-6 items-center border-b border-blue-50 px-6 py-4 last:border-0 transition-colors duration-150 hover:bg-blue-50"
              >
                {row.getAllCells().map((cell) => (
                  <div key={cell.id} className="min-w-0 text-zinc-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalCount={totalItems}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default DailyMetricListPageView;
