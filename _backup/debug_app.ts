import { App } from "fresh";
const app = new App();
console.log(
  "App methods:",
  Object.getOwnPropertyNames(Object.getPrototypeOf(app)),
);
console.log("App keys:", Object.keys(app));
