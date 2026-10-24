import DashboardPageView from "@/src/views/DashboardPageView";
import LayoutView from "@/src/views/LayoutView";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense>
      <LayoutView>
        <DashboardPageView />
      </LayoutView>
    </Suspense>
  );
}
