class appInstance {
  constructor(desktop, data) {
    this.id = data.id || Math.floor(Math.random() * 65536);
    this.instanceId = this.id + "-" + Math.floor(Math.random() * 65536);
    this.width = data.width || 35;
    this.height = data.height || 35;
    this.x_position = data.x_position || 10;
    this.y_position = data.y_position || 10;
    this.z_position = data.z_position || 0;
    this.is_fullscreen = data.is_fullscreen || false;
    this.icon_url = data.icon_url || "./assets/icons/generic_app_icon.svg";
    this.content_app = data.content_app || "";
    this.visibility_flag = data.visibility_flag || true;

    this.desktop = desktop;
    window.last_window_z_position = this.z_position;

    this.appInstance = document.createElement("div");
    this.appInstance.classList.add("app");
    this.appInstance.id = this.instanceId;
  }

  open() {
    if (this.is_fullscreen) {
      this.maximize();
    } else {
      this.restore();
    }

    var content = document.createElement("div");
    content.classList.add("app__content");
    content.innerHTML = this.content_app;

    var top_bar = document.createElement("div");
    top_bar.classList.add("app__top_bar");
    top_bar.addEventListener("click", this.restore.bind(this), false);

    this.moveApp(this.appInstance, top_bar, this);

    var min_button = document.createElement("div");
    min_button.classList.add("app__top_bar__min_button");
    min_button.addEventListener(
      "click",
      this.visibility_switch.bind(this),
      false
    );
    top_bar.appendChild(min_button);

    var max_button = document.createElement("div");
    max_button.classList.add("app__top_bar__max_button");
    max_button.addEventListener("click", this.resize.bind(this), true);
    top_bar.appendChild(max_button);

    var close_button = document.createElement("div");
    var id_of_instance = this.instanceId;
    close_button.classList.add("app__top_bar__close_button");
    close_button.addEventListener(
      "click",
      function() {
        window.appManager.remove(id_of_instance);
      },
      false
    );
    top_bar.appendChild(close_button);

    this.appInstance.appendChild(top_bar);
    this.appInstance.appendChild(content);

    this.desktop.appendChild(this.appInstance);
  }

  moveApp(elmnt, header, context) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (header) {
      header.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      context.x_position = elmnt.offsetTop - pos2;
      context.y_position = elmnt.offsetLeft - pos1;
      elmnt.style.top = context.x_position + "px";
      elmnt.style.left = context.y_position + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  visibility_switch() {
    if (this.visibility_flag) {
      this.z_position = window.last_window_z_position + this.z_position;
      this.appInstance.style.zIndex = this.z_position;
      window.last_window_z_position = this.z_position + 1;

      this.appInstance.style.display = "none";
      this.visibility_flag = false;
    } else {
      this.appInstance.style.display = "block";
      this.visibility_flag = true;
    }
  }

  resize() {
    if (this.is_fullscreen) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  restore() {
    this.appInstance.style.width = this.width + "vw";
    this.appInstance.style.height = this.height + "vh";
    this.appInstance.style.top = this.x_position + "px";
    this.appInstance.style.left = this.y_position + "px";
    this.z_position = window.last_window_z_position + this.z_position;
    this.appInstance.style.zIndex = this.z_position;
    window.last_window_z_position = this.z_position + 1;
    this.is_fullscreen = false;
  }

  maximize() {
    this.appInstance.style.width = "100vw";
    this.appInstance.style.height = "100vh";
    this.appInstance.style.zIndex = 10000;
    this.appInstance.style.left = 0;
    this.appInstance.style.top = 0;
    this.is_fullscreen = true;
  }

  close() {
    this.appInstance.parentNode.removeChild(this.appInstance);
  }
}

class appManager {
  constructor(desktop, icons_locality) {
    this.running_apps = [];
    this.desktop = desktop;
    this.icons_locality = icons_locality;
    window.appManager = this;
  }

  get index() {
    return this.running_apps;
  }

  addNew(value) {
    this.running_apps.push(value);
    this.iconInstance(value);
    this.letMeKnow();
  }

  iconInstance(app) {
    var icon_instance = document.createElement("div");
    icon_instance.classList.add("tool_bar__app_icon");
    icon_instance.addEventListener(
      "click",
      app.visibility_switch.bind(app),
      false
    );
    icon_instance.id = app.instanceId + "i";

    var icon_img = document.createElement("img");
    icon_img.classList.add("tool_bar__app_icon__img");
    icon_img.src = app.icon_url;

    icon_instance.appendChild(icon_img);
    this.icons_locality.appendChild(icon_instance);
    app.icon_instance = icon_instance;
  }

  remove(instanceId) {
    var newArry = [];
    for (let index = 0; index < this.running_apps.length; index++) {
      if (this.running_apps[index].instanceId != instanceId) {
        newArry.push(this.running_apps[index]);
      } else {
        this.running_apps[index].close();
        this.icons_locality.removeChild(this.running_apps[index].icon_instance);
      }
    }
    this.running_apps = newArry;

    this.letMeKnow();
  }

  killAll() {
    for (let index = 0; index < this.running_apps.length; index++) {
      this.running_apps[index].close();
    }
    this.running_apps = [];
    this.letMeKnow();
  }

  letMeKnow() {
    console.log("Apps running right now", this.running_apps);
  }

  runApp(runFile) {
    var newInstace = new appInstance(desktop, runFile);
    newInstace.open();
    this.addNew(newInstace);
  }
}

function init() {
  var desktop = document.querySelector("#desktop");

  var tool_bar = document.createElement("div");
  tool_bar.classList.add("tool_bar");

  var start_menu = document.createElement("div");
  start_menu.classList.add("tool_bar__start_menu");

  var start_menu_icon = document.createElement("i");
  start_menu_icon.classList.add("fas");
  start_menu_icon.classList.add("fa-bars");

  var apps_on_tool_bar = document.createElement("div");
  apps_on_tool_bar.classList.add("tool_bar__apps_on");

  start_menu.appendChild(start_menu_icon);
  tool_bar.appendChild(start_menu);
  tool_bar.appendChild(apps_on_tool_bar);
  desktop.appendChild(tool_bar);

  var data = {
    id: "teste",
    width: 35,
    height: 35,
    x_position: 10,
    y_position: 10,
    content_app: `<p>Hello world</p>`
  };

  this.manager = new appManager(desktop, apps_on_tool_bar);
  manager.runApp(data);
  manager.runApp(data);

  console.log(manager.runningApps);
}

init();
