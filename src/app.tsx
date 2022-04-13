import { useState } from "preact/hooks";

export function App() {
  const [count, setCount] = useState(0);

  const add = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div style={{ background: "green" }} onClick={add}>
      <p>Learn Preact{count}</p>
    </div>
  );
}

// function uniqueID() {
// 	return Math.floor(Math.random() * Date.now())
// };
//  const wrapperId = `table-${uniqueID()}`
//  console.log('@@wrapperId',wrapperId)
//   const wrapper = document.createElement('div');
// wrapper.setAttribute('id',wrapperId);
//   instance.canvas.append(wrapper);
