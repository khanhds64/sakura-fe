import { USER_ROLE } from "@/src/lib/constants";
import DailyMetricListPageView from "@/src/views/DailyMetric/DailyMetricListPageView";
import LayoutView from "@/src/views/LayoutView";
import { Suspense } from "react";

export default function DailyMetricListPage() {
  return (
    <Suspense>
      <LayoutView roles={[USER_ROLE.admin]}>
        <DailyMetricListPageView />
      </LayoutView>
    </Suspense>
  );
}
