function main() {
  var start_overlay_img = document.querySelector(".overlay_start_img");
  var main_title_bg_img = document.querySelector(".main_title_bg_img");
  var logo_svg_paths = document.getElementsByClassName("cls-1");
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

    for (var path of logo_svg_paths) {
      path.style.strokeDasharray = scroll_position * 2.5;
    }
  }
}

main();
