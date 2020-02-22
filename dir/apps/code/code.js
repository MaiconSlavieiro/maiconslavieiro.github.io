export function init(app) {
  try {
    var element = app.appInstance.querySelector(".code");
    var workarea = element.querySelector(".code__workarea");
    var explore = element.querySelector(".code__explore");

    function loadJSON(callback, path) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open("GET", path, true);
      xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
      };
      xobj.send(null);
    }

    loadJSON(
      renderFileList,
      "https://api.github.com/repos/MaiconSlavieiro/portfolio/contents"
    );

    function renderFileList(response) {
      processContent(response);
      var content = JSON.parse(response);
      app.contentResponse = content;
    }

    function processContent(response, parentElement) {
      var content = JSON.parse(response);
      var elmParent = parentElement || explore;
      var hasParent = parentElement ? true : false;
      content.forEach(element => {
        if (element.type == "dir") {
          var elm = createElement(element, hasParent, true);
          elmParent.appendChild(elm);
          loadJSON(function(response) {
            processContent(response, elm);
          }, element.url);
        } else {
          elmParent.appendChild(createElement(element, hasParent, false));
        }
      });
    }

    function createElement(item, hasParent, isFolder) {
      var elm_class = isFolder
        ? "code__explore__folder"
        : "code__explore__file";
      var type = hasParent ? "li" : "ul";
      var elm = document.createElement(type);
      elm.classList.add(elm_class);
      elm.classList.add("code__explore__item");
      var span_name_file = document.createElement("div");
      span_name_file.innerText = item.name;
      elm.appendChild(span_name_file);
      if (isFolder) {
        span_name_file.addEventListener(
          "click",
          function() {
            var folderContent = elm.children;
            for (let index = 0; index < folderContent.length; index++) {
              const element = folderContent[index];
              if (element != this) {
                element.classList.toggle("visible");
              }
            }
          },
          false
        );
      }

      if (!hasParent) {
        elm.classList.toggle("visible");
      }

      return elm;
    }
  } catch (e) {}
}
