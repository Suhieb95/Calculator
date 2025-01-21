const buttons = document.querySelectorAll("button");
const result = document.getElementById("result");

let isError = false;
let canAddOperation = true;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const btnText = btn.innerText;
    let isValidResultValue = result.value !== "" && result.value !== "0";

    const isValidNo =
      btnText !== "AC" && btnText !== "=" && btnText !== "Del" && !isError;
    const isClearBtn = btnText === "AC";
    const isEqBtn = btnText === "=";
    const isDelBtn = btnText === "Del";

    if (isValidNo) {
      if (isOp(btnText)) {
        if (canAddOperation) {
          canAddOperation = false;
          result.value += btnText;
        }
      } else {
        result.value += btnText;
        canAddOperation = true;
      }
    } else if (isClearBtn) {
      clearResult();
    } else if (isDelBtn && !isError) {
      if (isValidResultValue) {
        result.value = removeLastChar(result.value);
      }
    } else if (isEqBtn) {
      displayResult(isValidResultValue);
    }
  });
});

function clearResult() {
  result.value = "";
  canAddOperation = true;
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

function displayResult(isValidResultValue) {
  try {
    if (isValidResultValue) {
      const evalValue = eval(result.value.replace(",", ""));
      if (!isNaN(evalValue)) {
        result.value = formatNumber(evalValue);
        isError = false;
        canAddOperation = true;
      } else {
        setError();
      }
    }
  } catch (error) {
    setError();
  }
}
function setError() {
  result.value = "Error";
  isError = true;
}

function formatNumber(no) {
  if (no != 0) {
    let formattedNumber = "";
    const strNo = no.toString();

    for (let i = strNo.length - 1, c = 0; i >= 0; i--, c++) {
      formattedNumber = strNo[i] + formattedNumber;
      if (c % 3 === 2 && i != 0) {
        formattedNumber = "," + formattedNumber;
      }
    }
    console.log(formattedNumber);
    return formattedNumber;
  }
}

function isOp(value) {
  return (
    value.includes("+") ||
    value.includes("-") ||
    value.includes("*") ||
    value.includes("/")
  );
}
