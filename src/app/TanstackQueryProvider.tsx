"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export interface ITanstackQueryProviderProps {
  children: ReactNode;
}

export const TanstackQueryProvider = (props: ITanstackQueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient} {...props} />;
};
