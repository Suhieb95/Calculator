const buttons = document.querySelectorAll(".calculator-body button");
const result = document.getElementById("result");
const historyBtn = document.querySelector(".history");
const calc = document.querySelector(".calculator");

let isError = false;
let canAddOperation = true;
let lastResult = 0;
let lastOpertation = "";
let history = [];
let trashSvg;

document.addEventListener("DOMContentLoaded", () => {
  trashSvg = new Image();
  trashSvg.src = "./trash-solid.svg";
});

addButtonsEventListeners();
addHistory();

function addHistory() {
  historyBtn.addEventListener("click", () => {
    const historyList = document.createElement("div");
    historyList.classList.add("history-list");
    const btn = document.createElement("button");
    const btnContainer = document.createElement("div");

    renderClearButton(btnContainer, historyList);

    btn.innerText = "✖";

    btn.addEventListener("click", () => {
      historyList.remove();
    });

    btnContainer.appendChild(btn);
    historyList.appendChild(btnContainer);
    historyList.appendChild(document.createElement("hr"));
    calc.appendChild(historyList);

    history.forEach((value) => {
      const li = document.createElement("li");
      li.innerText = value;
      historyList.appendChild(li);
    });
  });
}

function renderClearButton(btnContainer, historyList) {
  if (history.length > 0) {
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");
    img.src = trashSvg;
    img.title = "Clear";
    clearBtn.appendChild(img);
    clearBtn.classList.add("clear-btn");
    btnContainer.appendChild(clearBtn);
    clearBtn.addEventListener("click", () => {
      history = [];
      historyList.remove();
    });
  }
}

function addButtonsEventListeners() {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnText = btn.innerText;

      const isValidNo =
        btnText !== "AC" && btnText !== "=" && btnText !== "Del" && !isError;
      const isClearBtn = btnText === "AC";
      const isEqBtn = btnText === "=";
      const isDelBtn = btnText === "Del";

      if (isValidNo) {
        if (isOp(btnText)) {
          if (canAddOperation) {
            result.value += btnText;
            canAddOperation = false;
          }
        } else {
          result.value += btnText;
          canAddOperation = true;
        }
      } else if (isClearBtn) {
        clearResult();
      } else if (isDelBtn && !isError) {
        if (result.value !== "" && result.value !== "0") {
          result.value = removeLastChar(result.value);
        }
      } else if (isEqBtn) {
        displayResult();
      }
    });
  });
}

function clearResult() {
  result.value = "";
  canAddOperation = true;
  lastOpertation = "";
  isError = false;
}

function removeLastChar(word) {
  if (word !== undefined) {
    let result = "";
    const wordL = word.length;
    for (let i = 0; i < wordL; i++) {
      if (i !== wordL - 1) {
        result += word[i];
      }
    }
    if (!isOp(result[result.length - 1])) {
      canAddOperation = true;
    } else {
      canAddOperation = false;
    }

    return result;
  }
}

function displayResult() {
  try {
    const cleanValue = removeFormatting(result.value);
    if (isValidMathematicalExpression(cleanValue)) {
      let evalValue = "";
      if (isEmptylastOpertation()) {
        evalValue = eval(cleanValue);
        history.push(`${cleanValue}=${evalValue}`);
      } else {
        evalValue = eval(removeFormatting(result.value + lastOpertation));
        history.push(`${cleanValue} ${lastOpertation} = ${evalValue}`);
      }
      if (isOp(cleanValue)) {
        setLastOperation(cleanValue);
      }
      displayCalculation(evalValue);
    }
  } catch (error) {
    setError();
  }
}

const isEmptylastOpertation = () => lastOpertation == "";

function isValidMathematicalExpression(value) {
  // Regex to match valid mathematical expressions (numbers and operators)
  const validExpressionRegex = /^[0-9+\-*/().]+$/;
  return validExpressionRegex.test(value) && !/[\+\-\*\/]$/.test(value);
}

function displayCalculation(evalValue) {
  if (!isNaN(evalValue)) {
    result.value = formatNumber(evalValue);
    isError = false;
    canAddOperation = true;
  } else {
    setError();
  }
}
function setLastOperation(value) {
  if (isOp(value[0])) {
    return;
  }
  for (let i = value.length - 1; i >= 0; i--) {
    if (isOp(value[i])) {
      lastOpertation = value.substring(i);
      break;
    }
  }
  return lastOpertation;
}

function removeFormatting(value) {
  let result = "";
  let i = 0;
  while (i < value.length) {
    const char = value[i];
    if (char === "×") {
      result += "*";
    } else if (char === "÷") {
      result += "/";
    } else if (char !== ",") {
      result += char;
    }
    i++;
  }
  return result;
}

function setError() {
  result.value = "Error";
  isError = true;
}

function formatNumber(no) {
  if (!isNaN(no)) {
    let formattedNumber = "";
    let isNegative = no < 0;
    const str = Math.abs(no).toString().split(".");
    const strNo = str[0];
    let count = 0;

    for (let i = strNo.length - 1; i >= 0; i--) {
      count++;
      formattedNumber = strNo[i] + formattedNumber;
      if (count % 3 === 0 && i != 0) {
        formattedNumber = "," + formattedNumber;
      }
    }
    if (str[1] !== undefined) {
      return formattedNumber + "." + str[1];
    }
    if (isNegative) {
      formattedNumber = "-" + formattedNumber;
    }
    return formattedNumber;
  }
}

function isOp(value) {
  return (
    value?.includes("+") ||
    value?.includes("-") ||
    value?.includes("×") ||
    value?.includes("÷")
  );
}
