import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('banks/*', 'routes/banks.$.tsx'),
  route('merchant/*', 'routes/merchant.$.tsx'),
  route('test', 'routes/test.tsx'),
] satisfies RouteConfig;
