window.onload = function() {
  const warning = document.querySelector(".warning");
  if (warning) {
    const input = warning.previousElementSibling;

    input.addEventListener("change",(e) => {
      warning.style.display = "none";
    });
  }
};