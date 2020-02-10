class appInstance {
  constructor(desktop, data) {
    this.id = data.id || Math.floor(Math.random() * 65536);
    this.instanceId = this.id + "-" + Math.floor(Math.random() * 65536);
    this.app_name = data.app_name || this.instanceId;
    this.width = data.width || 35;
    this.height = data.height || 35;
    this.x_position = data.x_position || 10;
    this.y_position = data.y_position || 10;
    this.z_position = data.z_position || 0;
    this.is_fullscreen = data.is_fullscreen || false;
    this.icon_url = data.icon_url || "./assets/icons/generic_app_icon.svg";
    this.content_app = data.content_app || "";
    this.visibility_flag = data.visibility_flag || true;
    this.first_plane;
    this.desktop = desktop;
    this.appInstance = document.createElement("div");
    this.appInstance.classList.add("app");
    this.appInstance.id = this.instanceId;

    window.last_window_z_position = this.z_position;
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

    var top_bar_app_name = document.createElement("div");
    top_bar_app_name.classList.add("app__top_bar__app_name");
    top_bar_app_name.innerHTML = this.app_name;
    top_bar_app_name.addEventListener("click", this.restore.bind(this), false);

    top_bar.appendChild(top_bar_app_name);

    this.moveApp(this.appInstance, top_bar, this);

    var min_button = document.createElement("div");
    min_button.classList.add("app__top_bar__min_button");
    min_button.addEventListener(
      "click",
      this.visibilitySwitch.bind(this),
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

  visibilitySwitch() {
    if (this.visibility_flag) {
      this.z_position = window.last_window_z_position + this.z_position;
      this.appInstance.style.zIndex = this.z_position;
      window.last_window_z_position = this.z_position + 1;
      this.appInstance.style.display = "none";
      this.visibility_flag = false;
      window.appManager.removeFirtPlaneApp(this);
    } else {
      window.appManager.firtPlaneApp(this);
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
    window.appManager.firtPlaneApp(this);
  }

  maximize() {
    this.appInstance.style.width = "100vw";
    this.appInstance.style.height = "100vh";
    this.appInstance.style.zIndex = 10000;
    this.appInstance.style.left = 0;
    this.appInstance.style.top = 0;
    this.is_fullscreen = true;
    window.appManager.firtPlaneApp(this);
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
    this.firt_plane_app;
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

  firtPlaneApp(appInstance) {
    if (
      this.firt_plane_app &&
      this.firt_plane_app.instanceId != appInstance.instanceId
    ) {
      var last_icon_instance = this.icons_locality.querySelector(
        "#" + this.firt_plane_app.instanceId + "i"
      );
      last_icon_instance.classList.remove("active");
    }

    var icon_instance = this.icons_locality.querySelector(
      "#" + appInstance.instanceId + "i"
    );

    if (icon_instance) {
      icon_instance.classList.add("active");
      this.firt_plane_app = appInstance;
    }
  }

  removeFirtPlaneApp(appInstance) {
    if (
      this.firt_plane_app &&
      this.firt_plane_app.instanceId == appInstance.instanceId
    ) {
      var last_icon_instance = this.icons_locality.querySelector(
        "#" + appInstance.instanceId + "i"
      );
      last_icon_instance.classList.remove("active");
      this.firt_plane_app = undefined;
    }
  }

  iconInstance(appInstance) {
    var icon_instance = document.createElement("div");
    icon_instance.classList.add("tool_bar__app_icon");
    icon_instance.addEventListener(
      "click",
      appInstance.visibilitySwitch.bind(appInstance),
      false
    );
    icon_instance.id = appInstance.instanceId + "i";

    var icon_img = document.createElement("img");
    icon_img.classList.add("tool_bar__app_icon__img");
    icon_img.src = appInstance.icon_url;

    icon_instance.appendChild(icon_img);
    this.icons_locality.appendChild(icon_instance);
    appInstance.icon_instance = icon_instance;
    this.firtPlaneApp(appInstance);
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
      this.icons_locality.removeChild(this.running_apps[index].icon_instance);
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

class menuApps {
  constructor(desktop, list_of_apps, appManager) {
    this.desktop = desktop;
    this.menu_apps_element;
    this.visibility_flag = false;
    this.list_of_apps = list_of_apps;
    this.appManager = appManager;
  }

  init() {
    var menu_apps = document.createElement("div");
    menu_apps.classList.add("menu_apps");
    menu_apps.id = "menu_apps";
    this.desktop.appendChild(menu_apps);

    this.menu_apps_element = menu_apps;

    this.listingApps();
  }

  listingApps() {
    for (let index = 0; index < this.list_of_apps.length; index++) {
      var data = this.list_of_apps[index];

      var app = document.createElement("div");
      app.classList.add("menu_apps__app");
      app.id = data.id + "-launcher";

      function runApp() {
        this.appManager.runApp(data);
        this.close();
      }

      app.addEventListener("click", runApp.bind(this), true);

      var app_icon = document.createElement("img");
      app_icon.classList.add("menu_apps__app__icon");
      app_icon.src = data.icon_url || "./assets/icons/generic_app_icon.svg";

      var app_name = document.createElement("div");
      app_name.classList.add("menu_apps__app__name");
      app_name.innerText = data.app_name;

      app.appendChild(app_icon);
      app.appendChild(app_name);

      this.menu_apps_element.appendChild(app);
    }
  }

  onClick() {
    if (this.visibility_flag) {
      this.close();
    } else {
      this.show();
    }
  }

  show() {
    this.menu_apps_element.classList.add("show");
    this.visibility_flag = true;
  }

  close() {
    this.menu_apps_element.classList.remove("show");
    this.visibility_flag = false;
  }
}

function init() {
  var desktop = document.querySelector("#desktop");

  var data = [
    {
      app_name: "Aplicativo teste 1",
      id: "teste1",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    },
    {
      app_name: "Aplicativo teste 2",
      id: "teste2",
      width: 35,
      height: 35,
      x_position: 10,
      y_position: 10,
      content_app: `<p>Hello world</p>`
    }
  ];

  var apps_on_tool_bar = document.createElement("div");
  apps_on_tool_bar.classList.add("tool_bar__apps_on");

  this.manager = new appManager(desktop, apps_on_tool_bar);

  var tool_bar = document.createElement("div");
  tool_bar.classList.add("tool_bar");
  tool_bar.id = "tool_bar";

  this.menu_apps = new menuApps(desktop, data, manager);
  menu_apps.init();

  var start_menu = document.createElement("div");
  start_menu.addEventListener(
    "click",
    this.menu_apps.onClick.bind(this.menu_apps),
    false
  );
  start_menu.classList.add("tool_bar__start_menu");

  var start_menu_icon = document.createElement("i");
  start_menu_icon.classList.add("fas");
  start_menu_icon.classList.add("fa-bars");

  start_menu.appendChild(start_menu_icon);
  tool_bar.appendChild(start_menu);
  tool_bar.appendChild(apps_on_tool_bar);
  desktop.appendChild(tool_bar);
}

init();
