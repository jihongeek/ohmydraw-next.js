import { beforeAll, afterAll } from 'vitest';
import { server } from './mocks/node';
beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
