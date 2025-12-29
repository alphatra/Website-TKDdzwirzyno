import { Handlers } from "fresh";

console.log("Foo Module Initialized"); // Verify import

export const handler: Handlers = {
  GET(_ctx) {
    console.log("Foo Handler Reached");
    return new Response("Foo OK");
  },
};

export default function Foo() {
  return <div>Foo</div>;
}
