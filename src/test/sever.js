import { setupServer } from "msw/lib/node";
import { rest } from "msw";

export const createServer = (handlersConfig) => {
  const handlers = handlersConfig.map((handler) => {
    return rest[handler.method || "get"](handler.path, (req, res, ctx) => {
      return res(ctx.json(handler.res(req, res, ctx)));
    });
  });

  const server = setupServer(...handlers);
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
};
