import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function TestPage(props) {
  return (
    <>
      <Head>
        <title>Test Page</title>
      </Head>
      <h1>Test Page Working</h1>
    </>
  );
});
