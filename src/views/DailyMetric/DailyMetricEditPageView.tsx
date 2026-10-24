"use client";

import { useSearchParams } from "next/navigation";
import DailyMetricForm from "./DailyMetricForm";

const DailyMetricEditPageView = () => {
  const searchParams = useSearchParams();
  const formInstance = searchParams.get("formInstance") || "";

  return <DailyMetricForm key={formInstance} />;
};

export default DailyMetricEditPageView;
