// Code written by AI

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const orderBtn = document.querySelector("main a");

  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (orderBtn) {
    orderBtn.addEventListener("mousedown", () => {
      orderBtn.style.transform = "scale(0.97)";
    });
    ["mouseup", "mouseleave"].forEach((evt) =>
      orderBtn.addEventListener(evt, () => {
        orderBtn.style.transform = "";
      }),
    );
  }

  console.log("Domino's landing page loaded.");
});
