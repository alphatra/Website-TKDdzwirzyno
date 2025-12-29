import { Handlers } from "fresh";

export const handler: Handlers = {
  GET() {
    return new Response("Router is working!");
  },
};
