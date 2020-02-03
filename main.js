function main() {
  var start_overlay_img = document.querySelector(".overlay_start_img");
  var main_title_bg_img = document.querySelector(".main_title_bg_img");
  document.addEventListener("scroll", isScrolling);

  function isScrolling() {
    var baseLine = 260;
    var scroll_position = window.scrollY;
    if (scroll_position > baseLine) {
      start_overlay_img.style.backgroundSize =
        (scroll_position - baseLine) * 0.3 + 100 + "%";
      main_title_bg_img.style.filter =
        "blur(" + (scroll_position - baseLine) * 0.01 + "px)";
    }
  }
}

main();
