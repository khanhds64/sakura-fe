import { USER_ROLE } from "@/src/lib/constants";
import DailyMetricEditPageView from "@/src/views/DailyMetric/DailyMetricEditPageView";
import LayoutView from "@/src/views/LayoutView";
import { Suspense } from "react";

export default function DailyMetricCreatPage() {
  return (
    <Suspense>
      <LayoutView roles={[USER_ROLE.admin]}>
        <DailyMetricEditPageView />
      </LayoutView>
    </Suspense>
  );
}
