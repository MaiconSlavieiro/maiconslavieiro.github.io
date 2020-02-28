function main() {
  var pc_img = document.querySelector(".pc_img");
  var bg_img = document.querySelector(".bg_img");

  document.addEventListener("scroll", isScrolling);

  var maxSize = window.innerWidht > window.innerHeight ? window.innerHeight : window.innerHeight * 3;
  bg_img.style.height = maxSize + "px";

  function isScrolling() {
    if (maxSize == window.scrollY + window.innerHeight) {
      pc_img.classList.toggle("zoomin");
      setTimeout(function () {
        window.location.href = "./dir/desktop.html";
      }, 3000);

    }
  }



}

main();