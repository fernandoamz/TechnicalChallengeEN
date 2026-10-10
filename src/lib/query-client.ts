import { QueryClient } from '@tanstack/react-query';

// Data is garbage collected after five minutes.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // Keep data fresh for 1 minute
      gcTime: 5 * 60_000, // Keep unused data for 5 minutes
      retry: 1, // Retry failed requests once
    },
  },
});
