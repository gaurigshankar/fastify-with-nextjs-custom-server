import next from "next";

import fastify, {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
  } from "fastify";


import { parse } from "url";
import { prometheusPlugin } from "./fastify-plugins/metrics";

const createNextServer = async () => {
    const port = 8090;
    const hostname = '0.0.0.0';
    const dev = process.env.NODE_ENV !== 'production'
    const app = next({dev});
    try {
        await app.prepare();
    } catch (err) {
       console.log(err);
    }
    const handle = app.getRequestHandler();

    const server : FastifyInstance = fastify()
        .register(require("fastify-cookie"))
        .register(prometheusPlugin)
        .decorate("settings", {
        port,
        hostname,
        })
        .addHook("onRequest", (request, _reply, done) => {
          console.log("New Request ....",request.url)
          done();
        })
        .addHook("onResponse", (request, reply, done) => {
          console.log("New Response ....")
          done();
        });
    
    const nextHandler = (req: FastifyRequest, reply: FastifyReply) => {
        return handle(req.raw, reply.raw).then(() => {
            reply.sent = true;
        });
    };
    server.get("/new", async (req :FastifyRequest , reply: FastifyReply) => {
      return {hello: "gauri Shankar"} 
    })
    server.all("/*", {}, nextHandler);

    server.get("/", async (req :FastifyRequest , reply: FastifyReply) => {
      return {hello: "gauri"} 
    })

    server.setErrorHandler(
        (error, request, reply) => {
          const { pathname, query } = parse(request.url, true);
          return app
            .renderError(error, request.raw, reply.raw, pathname as string, query)
            .then(() => {
              reply.sent = true;
            });
        }
    );
    server.listen(port, hostname, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("server started")
    });
}

createNextServer()