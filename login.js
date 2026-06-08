const inputs = document.querySelectorAll(".code-inputs input");

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");

    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Backspace" && input.value === "" && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

function checkCode() {
  let code = "";

  inputs.forEach(input => {
    code += input.value;
  });

  if (code === "0853") {
    localStorage.setItem("isAgent", "true");
    window.location.href = "agent.html";
  } else {
    localStorage.setItem("isAgent", "false");
    window.location.href = "not-agent.html";
  }
}

