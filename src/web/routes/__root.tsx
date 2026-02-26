import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  ErrorComponent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: ErrorComponent,
  component: RootLayout,
});

function RootLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
}
