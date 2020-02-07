

  function load(data) {
    var instance;
    instance.id = data.id || Math.floor(Math.random()*167772154871568).toString(16);;
    instance.instance_id = this.id + Math.random() * 1000;
    instance.window_wight = data.wight || 50; //vw
    instance.window_wight = data.right || 50; //vh
    instance.is_full_screen = data.is_full_screen || false;
    instance.icon_url = data.icon_url || undefined;
  
    this.createElement(instance);
  }
  
  function createElement(data) {
    var element = document.createElement("DIV");   
    element.innerHTML = "OK"; 
    element.id = data.instance_id;                
    document.body.appendChild(element);              
  }


