function showAccordion(id) {
  let content = document.getElementById(id);
  let arrow = document.getElementById(id + "-arrow-label");
  if (content.style.maxHeight != "0px") {
    content.style.maxHeight = "0px";
    content.addEventListener(
      "transitionend",
      () => {
        if (content.style.maxHeight == "0px") {
          // Checks for double clicks
          arrow.textContent = "⮜";
        }
      },
      { once: true }
    ); // Don't think IE supports this. based.
  } else {
    content.style.maxHeight = "500px";
    arrow.textContent = "⮟";
  }
}

// Taken from https://stackoverflow.com/a/13952727
function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
