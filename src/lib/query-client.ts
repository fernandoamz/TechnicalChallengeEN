import { QueryClient } from '@tanstack/react-query';

// One cache for the list and the detail screen. Data is treated as fresh for one minute.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
    },
  },
});
