import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [boxes, setBoxes] = useState([]);
  const ref = useRef([]);
  const count = useRef(null);
  const customSpeed = useRef(null);
  const [color, setColor] = useState("");
  const [border, setBorder] = useState();
  const [speed, setSpeed] = useState(0);
  const [pretty, setPretty] = useState(false);
  // const observer = new IntersectionObserver(callback);

  const displayBoxes = () => {
    const width = Math.floor(Math.random() * (250 - 50 + 1) + 50);
    const height = Math.floor(Math.random() * (250 - 50 + 1) + 50);
    let x = Math.floor(Math.random() * (1000 - width));
    let y = Math.floor(Math.random() * (1000 - height));

    const overlapping = boxes.some((box) => {
      return (
        x <= box.x + box.width &&
        x + width >= box.x &&
        y <= box.y + box.height &&
        height + y >= box.y
      );
    });

    if (overlapping) {
      displayBoxes();
      return;
    }

    setBoxes([...boxes, { width, height, x, y }]);
  };

  const clearBox = () => {
    // setBoxes([]);
    window.location.reload(false);
  };

  // console.log(boxes);

  const handleKeyDown = (event) => {
    const div = ref.current[count.current];

    const touching = overlapXRest(div, ref.current);
    console.log(touching);
    // console.log("each", ref.current[i].offsetTop, "current", div.offsetTop);
    console.log(customSpeed.current.value);
    const currentSpeed = parseFloat(speed);
    if (event.key === "ArrowUp") {
      if (div.offsetTop > 0) {
        if (!touching) {
          div.style.top = `${div.offsetTop - currentSpeed}px`;
        } else if (touching) {
          div.style.top = `${div.offsetTop + (currentSpeed + 1)}px`;
          event.preventDefault();
        }
      } else {
        event.preventDefault();
        // div.style.top = 0;
      }
    } else if (event.key === "ArrowDown") {
      if (div.offsetTop < 1000 - div.offsetHeight) {
        if (!touching) {
          div.style.top = `${div.offsetTop + currentSpeed}px`;
        } else if (touching) {
          div.style.top = `${div.offsetTop - (currentSpeed + 1)}px`;
          event.preventDefault();
        }
      } else {
        // div.style.top = 1000;
        event.preventDefault();
      }
    } else if (event.key === "ArrowLeft") {
      // console.log("ArrowLeft", div, count.current);
      if (div.offsetLeft > 0) {
        if (!touching) {
          div.style.left = `${div.offsetLeft - currentSpeed}px`;
        } else if (touching) {
          div.style.left = `${div.offsetLeft + (currentSpeed + 1)}px`;
          event.preventDefault();
        }
      } else {
        // div.style.left = 0;
        event.preventDefault();
      }
    } else if (event.key === "ArrowRight") {
      if (div.offsetLeft < 1000 - div.offsetWidth) {
        // console.log(typeof currentSpeed);
        if (!touching) {
          div.style.left = `${div.offsetLeft + currentSpeed}px`;
        } else if (touching) {
          div.style.left = `${div.offsetLeft - (currentSpeed + 1)}px`;
          event.preventDefault();
        }
      } else {
        // div.style.left = 1000;
        event.preventDefault();
      }
    }

    updateOverlap();
  };

  const moveAround = (index) => {
    count.current = index;
    window.addEventListener("keydown", handleKeyDown);
    // setIsDragging(true);
    setBorder(index);
    // console.log(speed);
  };

  useEffect(() => {
    updateOverlap();
  }, [boxes]);

  function updateOverlap() {
    // console.log("updateOverlap");
    let isOverlap = false;

    if (ref.current.length > 1) {
      const first = ref.current[0];
      isOverlap =
        xOverlapWithRest(first, ref.current) ||
        yOverlapWithRest(first, ref.current);
    } else {
      return;
    }

    if (isOverlap) {
      setColor("#A0C3D2");
    } else {
      setColor("#FF7B54");
    }
  }

  // Check for overlap on the y

  function yOverlapWithRest(div1, divs) {
    return divs.every((div) => yOverlap(div1, div));
  }

  function yOverlap(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    const yOverlap =
      (rect1.top >= rect2.top && rect1.top <= rect2.bottom) ||
      (rect1.bottom >= rect2.top && rect1.bottom <= rect2.bottom);

    console.log("checkOverlap y", yOverlap);
    return yOverlap;
  }

  // Check for overlap on the x

  function xOverlapWithRest(div1, divs) {
    return divs.every((div) => xOverlap(div1, div));
  }

  function xOverlap(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
    const xOverlap =
      (rect1.left >= rect2.left && rect1.left <= rect2.right) ||
      (rect1.right >= rect2.left && rect1.right <= rect2.right);

    // console.log("checkOverlap x", xOverlap, rect1, rect2);

    return xOverlap;
  }

  //--------

  const overlapXRest = (div1, divs) => {
    return divs.every((div) => overlapX(div1, div));
  };

  const overlapX = (div1, div2) => {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    let overlapX;

    if (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    ) {
      overlapX = true;
    }

    // rect1.left < rect2.right &&
    // rect1.right < rect2.left &&
    // rect1.top < rect2.bottom &&
    // rect1.bottom < rect2.top;

    return overlapX;
  };
  //---------

  // const overlapRest = (div1, divs) => {
  //   return divs.every((div) => overlap(div1, div));
  // };

  // const overlap = (div1, div2) => {
  //   const observer = new IntersectionObserver(callback);
  //   observer.observe(div1);
  //   observer.observe(div2);

  //   return () => {
  //     observer.unobserve(div1);
  //     observer.unobserve(div2);
  //   };
  // };

  // function callback(entries) {
  //   const entry = entries[0];
  //   if (entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0) {
  //     console.log("The rectangles are touching", entries);
  //   } else {
  //     console.log("The rectangles are not touching");
  //   }
  // }

  const handleColor = (index) => {
    // count.current = index;
    if (border === index) {
      if (pretty) {
        return "rgba(46, 169, 240, 0.3) 0px 0px 0px 6px,rgba(46, 169, 240, 0.2) 0px 0px 0px 9px,rgba(46, 169, 240, 0.1) 0px 0px 0px 12px";
        // return "rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px,rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px,rgb(255, 85, 85) 0px 0px 0px 15px";
      } else {
        return "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px";
      }
    }
  };

  console.log(pretty);

  function handleChange(event) {
    // const customSpeed = event.target.value;
    // setSpeed(customSpeed);
    // customSpeed.current.value = event.target.value;
    console.log(customSpeed.current.value);
    setSpeed(customSpeed.current.value);
  }

  return (
    <div className="App">
      <div className={pretty ? "app app-prettier" : "app"}>
        {boxes &&
          boxes.map((box, index) => {
            const { height, width, x, y } = box;
            return (
              <div
                className={pretty ? "box prettier-box" : "box"}
                // className="box"
                ref={(el) => (ref.current[index] = el)}
                onClick={() => moveAround(index)}
                // ref={ref}
                key={index}
                style={{
                  height: height,
                  width: width,
                  top: y,
                  left: x,
                  backgroundColor: color,
                  boxShadow: handleColor(index),
                }}
              ></div>
            );
          })}
      </div>
      <div className="box-info">
        <div className="box-details">
          {/* <input type="texst" className="div" /> */}
          <p>
            Board size: 1000x1000; Box size min/max: 50/250; Box count:{" "}
            {boxes.length}
          </p>
        </div>
        <div className="box-functions">
          <div className="inputs">
            <label>Allow drag</label>
            <input type="checkbox" />
          </div>
          <div className="inputs">
            <label>Pretty</label>
            <input
              type="checkbox"
              checked={pretty}
              onChange={(event) => {
                // console.log(event.target.value);
                setPretty(event.target.checked);
              }}
            />
          </div>
          <div className="inputs">
            <label>Speed:</label>
            <input
              className="number"
              type="number"
              ref={customSpeed}
              value={speed}
              onChange={(event) => {
                handleChange(event);
              }}
            />
          </div>
          <button
            className={pretty && "button-prettier"}
            onClick={displayBoxes}
          >
            Add
          </button>
          <button className={pretty && "button-prettier"} onClick={clearBox}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// const rectangle1 = document.querySelector('.rectangle1');
// const rectangle2 = document.querySelector('.rectangle2');

// const rect1 = rectangle1.getBoundingClientRect();
// const rect2 = rectangle2.getBoundingClientRect();

// if (rect1.left < rect2.right && rect1.right > rect2.left &&
//     rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
//   // The rectangles are overlapping
//   // Adjust the positions of the rectangles here
// }

// (rect1.left < rect2.right && rect1.right > rect2.left &&
//   rect1.top < rect2.bottom && rect1.bottom > rect2.top)

// import React, { useRef, useEffect } from 'react';

// function preventOverlap(rect1, rect2) {
//   // Check if the rectangles are intersecting
//   if (rect1.left < rect2.right && rect1.right > rect2.left &&
//       rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
//     // Adjust the position of the rectangles to move them out of each other
//     if (rect1.left < rect2.left) {
//       rect1.right = rect2.left;
//       rect2.left = rect1.right;
//     } else {
//       rect2.right = rect1.left;
//       rect1.left = rect2.right;
//     }
//   }
// }

// function Rectangle(props) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const rect1 = ref.current.getBoundingClientRect();

//     // Check for collision with all other rectangles
//     props.rectangles.forEach((otherRect) => {
//       if (otherRect !== ref.current) {
//         const rect2 = otherRect.getBoundingClientRect();
//         preventOverlap(rect1, rect2);
//       }
//     });
//   });

//   return (
//     <div
//       ref={ref}
//       style={{
//         width: props.width,
//         height: props.height,
//         backgroundColor: props.color,
//         position: 'absolute',
//         left: props.left,
//         top: props.top,
//       }}
//     />
//   );
// }

// function App() {
//   const rectangles = [
//     { width: 100, height: 100, color: 'red', left: 50, top: 50 },
//     { width: 100, height: 100, color: 'blue', left: 200, top: 50 },
//   ];

//   return (
//     <div>
//       {rectangles.map((rect, index) => (
//         <Rectangle
//           key={index}
//           rectangles={rectangles}
//           width={rect.width}
//           height={rect.height}
//           color={rect.color}
//           left={rect.left}
//           top={rect.top}
//         />
//       ))}
//     </div>
//   );
// }

// const overlapXRest = (div1, divs) => {
//   return divs.every((div) => overlapX(div1, div));
// };

// const overlapX = (div1, div2) => {
//   const rect1 = div1.getBoundingClientRect();
//   const rect2 = div2.getBoundingClientRect();

//   let overlapX;

//   if (1000 - rect1.right <= rect2.left) {
//     overlapX = true;
//   } else {
//     overlapX = false;
//   }

//   // rect1.left < rect2.right &&
//   // rect1.right < rect2.left &&
//   // rect1.top < rect2.bottom &&
//   // rect1.bottom < rect2.top;

//   // if (rect1.left < rect2.right && rect1.right > rect2.left &&
//   //     rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
//   // }
//   return overlapX;
// };
