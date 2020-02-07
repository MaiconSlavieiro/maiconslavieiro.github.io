class appInstance {
  constructor(desktop, data) {
    this.id = data.id || Math.floor(Math.random() * 65536);
    this.instanceId = this.id + "-" + Math.floor(Math.random() * 65536);
    this.width = data.width || 650;
    this.height = data.height || 300;
    this.x_position = data.x_position || 50;
    this.y_position = data.y_position || 30;
    this.z_position = data.z_position || 0;
    this.is_fullscreen = data.is_fullscreen || false;
    this.icon_url = data.icon_url || "";
    this.content_app = data.content_app || "";
    this.desktop = desktop || window;

    this.appInstance = document.createElement("div");
    this.appInstance.classList.add("app");
    this.appInstance.id = this.instanceId;
  }

  open() {
    if (!this.is_fullscreen) {
      this.appInstance.style.width = this.width + "px";
      this.appInstance.style.height = this.height + "px";
      this.appInstance.style.top = this.x_position + "px";
      this.appInstance.style.left = this.y_position + "px";
      this.appInstance.style.zIndex = this.z_position;
    } else {
      this.appInstance.style.width = 100 + "vw";
      this.appInstance.style.height = 100 + "vh";
      this.appInstance.style.zIndex = 10000;
    }

    var content = document.createElement("div");
    content.classList.add("app__content");
    content.innerHTML = this.content_app;

    var top_bar = document.createElement("div");
    top_bar.classList.add("app__top_bar");

    var min_button = document.createElement("div");
    min_button.classList.add("app__top_bar__min_button");
    min_button.addEventListener("click", this.minimize, true);
    top_bar.appendChild(min_button);

    var close_button = document.createElement("div");
    close_button.classList.add("app__top_bar__close_button");
    close_button.addEventListener("click", this.close, true);
    top_bar.appendChild(close_button);

    this.appInstance.appendChild(top_bar);
    this.appInstance.appendChild(content);

    this.desktop.appendChild(this.appInstance);
  }

  minimize() {
    try {
      try {
        this.appInstance.style.display = "none";
      } catch (e) {
        this.offsetParent.style.display = "none";
      }
    } catch (e) {
      console.log(e);
    }
  }

  close() {
    try {
      try {
        this.appInstance.parentNode.removeChild(this.appInstance);
      } catch (e) {
        this.offsetParent.parentNode.removeChild(this.offsetParent);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

function init() {
  var desktop = document.querySelector("#desktop");

  var data = {
    id: "teste",
    width: 600,
    height: 300,
    x_position: 50,
    y_position: 150,
    content_app: "<p> Olá mundo </p>"
  };

  appTest = new appInstance(desktop, data);

  appTest.open();
}

init();
