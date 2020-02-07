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
    this.visibility_flag = data.visibility_flag || true;
    this.desktop = desktop || window;

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

    this.moveApp(this.appInstance, top_bar);    

    var min_button = document.createElement("div");
    min_button.classList.add("app__top_bar__min_button");
    min_button.addEventListener("click", this.visibility_switch.bind(this), false);
    top_bar.appendChild(min_button);

    var max_button = document.createElement("div");
    max_button.classList.add("app__top_bar__max_button");
    max_button.addEventListener("click", this.resize.bind(this), true);
    top_bar.appendChild(max_button);

    var close_button = document.createElement("div");
    close_button.classList.add("app__top_bar__close_button");
    close_button.addEventListener("click", this.close.bind(this), false);
    top_bar.appendChild(close_button);

    this.appInstance.appendChild(top_bar);
    this.appInstance.appendChild(content);

    this.desktop.appendChild(this.appInstance);
  } 

  moveApp(elmnt, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  visibility_switch() {
    if (this.visibility_flag) {
      this.appInstance.style.display = "none";  
      this.visibility_flag = false;
    } else {
      this.appInstance.style.display = "block";  
      this.visibility_flag = true;
    }    
  }

  resize() {   
    if(this.is_fullscreen) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  restore() {
    this.appInstance.style.width = this.width + "px";
    this.appInstance.style.height = this.height + "px";
    this.appInstance.style.top = this.x_position + "px";
    this.appInstance.style.left = this.y_position + "px";
    this.appInstance.style.zIndex = this.z_position;
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

function init() {
  var desktop = document.querySelector("#desktop");

  var data = {
    id: "teste",
    width: 600,
    height: 300,
    x_position: 50,
    y_position: 150,
    content_app: `<p>Hello world</p>`
  };

  appTest = new appInstance(desktop, data);

  appTest.open();
 
}

init();
