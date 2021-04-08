import fp from "fastify-plugin";
import http from "http";
import url from "url";
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

const DEFAULT_HOSTNAME = "0.0.0.0";
const createSeparateServer = (
  server: FastifyInstance,
  path: string,
  port: number
) => {
  const httpServer = http.createServer((req, res) => {
    const requestUrl = url.parse(req.url ? req.url : "");
    if (requestUrl.path === path) {
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify({ metrics: true }))
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  httpServer.listen(port, DEFAULT_HOSTNAME, () => {
    console.log("Metrics Server listening");
  });

  server.addHook("onClose", (server, done) => {
    httpServer.close();
    done();
  });
};
const createOnServer = (server: FastifyInstance, path: string) => {
  const handler = (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ metrics: true });
  };
  server.route({
    method: "GET",
    url: path,
    handler,
  });
};

const rawPrometheusPlugin: FastifyPluginCallback = (server, options, done) => {
  debugger;
  const port = 7766;
  const path = "/metrics";

  //createOnServer(server, path);
  createSeparateServer(server, path, port);

  return done && done();
};

export const prometheusPlugin = fp(rawPrometheusPlugin, {
  fastify: "3.x",
  name: "prometheus-plugin",
});
