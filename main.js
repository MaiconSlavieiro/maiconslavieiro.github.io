function main() {
  var pc_img = document.querySelector(".pc_img");
  var bg_img = document.querySelector(".bg_img");
  var ms_logo = document.querySelector("#maicon_slavieiro");
  var paths_ms_logo = ms_logo.querySelectorAll("path");
  var screen_content = document.querySelector(".screen_content");
  var loading = document.querySelector("#loading");

  document.addEventListener("scroll", isScrolling);

  var maxSize = window.innerHeight * 2;
  bg_img.style.height = maxSize + window.innerHeight + "px";

  function isScrolling() {


    var currentScrollPosition = window.pageYOffset;
    var possitionStatus = (currentScrollPosition * 100) / maxSize;
    pc_img.style.backgroundSize = possitionStatus > 40 ? (possitionStatus * 2.5) + "%" : "100%";

    console.log(possitionStatus);

    paths_ms_logo.forEach(path => {
      var x = 1000 - (possitionStatus / 0.1);
      path.style.strokeDashoffset = x;
      path.style.opacity = possitionStatus + '%';
    });

    if (possitionStatus > 95) {
      setTimeout(function () {
        bg_img.classList.add("loading");
        screen_content.style.zIndex = 1000;
        ms_logo.style.opacity = 0;
        setTimeout(function () {
          loading.style.opacity = "100%";
        }, 1000)
        setTimeout(function () {
          window.location.assign("./dir/desktop.html");
        }, 4000)
      }, 1500);

    }

  }
}

main();