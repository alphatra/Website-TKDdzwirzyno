import { useState } from "preact/hooks";

export default function TestIsland() {
  const [count, setCount] = useState(0);

  return (
    <div class="p-8 bg-blue-500 text-white text-center text-4xl font-bold my-8">
      <h1>TEST ISLAND</h1>
      <p>Count: {count}</p>
      <button
        class="bg-white text-blue-500 px-4 py-2 rounded mt-4 hover:bg-gray-200"
        onClick={() => setCount((c) => c + 1)}
      >
        CLICK ME (TEST)
      </button>
    </div>
  );
}
