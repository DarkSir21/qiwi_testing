(function() {
  var d = document,
      cursorPosX = 0;
      cursorPosY = 0;

  function Container(selector) {
    this.wrapper = d.querySelector(selector);
  }

  Container.prototype = Object.create(Array.prototype);
  Container.prototype.constructor = Container;

  Container.prototype.add = function(el) {

    el.startShift += 10 * this.length;

    el.close.onclick = function() { this.close(el) }.bind(this);

    el.element.style.top = el.startShift + 'px';
    el.element.style.left = el.startShift + 'px';
    this.zIndexUp(el.element);
    
    el.element.onmousedown = function() { this.zIndexUp(el.element) }.bind(this);

    this.wrapper.appendChild(el.element);
    this.push(el)
    el.setTitle('Окно ' + this.length);
  };

  Container.prototype.close = function(el) {
    var index = this.findIndex(function(windowElement){ return windowElement === el });
    if( index !== -1 ) {
      this.splice(index, 1);
      el.element.remove();
    }
  };

  Container.prototype.zIndexUp = function(el) {
    var maxIndex = 0,
        currentIndex;
    this.forEach(function(windowElement){
      currentIndex = Number(windowElement.element.style.zIndex);
      maxIndex = currentIndex > maxIndex ? currentIndex : maxIndex;
    });
    el.style.zIndex = maxIndex + 1;

  }

  function WindowElement() {
    this.element = d.querySelector('.clone-item .window').cloneNode(true);
    this.startShift = 60;
    this.head = this.element.querySelector('.head');
    this.close = this.head.querySelector('.close');
    this.minElement = this.head.querySelector('.minimize');
    this.maxElement = this.head.querySelector('.maximize');
    this.minWindow = false;
    this.maxWindow = false;
    this.posX = 0;
    this.posY = 0;
    this.newPosX = 0;
    this.newPosY = 0;
    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.minimize = this.minimize.bind(this);
    this.normalize = this.normalize.bind(this);
    this.maximize = this.maximize.bind(this);

    this.head.addEventListener('mousedown', this.dragStart, false);
    this.minElement.addEventListener('click', this.minimize, false);
    this.maxElement.addEventListener('click', this.maximize, false);
  }

  WindowElement.prototype.dragStart = function(e){
    cursorPosX = e.clientX;
    cursorPosY = e.clientY;
    this.head.classList.add('-grabbing');

    window.addEventListener('mousemove', this.drag, false);
    window.addEventListener('mouseup', this.dragEnd, false);
  }

  WindowElement.prototype.drag = function(e){
    this.newPosX = e.clientX - cursorPosX + this.posX;
    this.newPosY = e.clientY - cursorPosY + this.posY;
    this.element.style.transform = 'translate3d('+ this.newPosX +'px,'+ this.newPosY +'px,0px)';
  }

  WindowElement.prototype.dragEnd = function(){

    this.posX = this.newPosX;
    this.posY = this.newPosY;

    window.removeEventListener('mousemove', this.drag);
    this.head.classList.remove('-grabbing');
  }

  WindowElement.prototype.minimize = function(e){
    e.stopPropagation();
    
    var styles = {
      top: 0,
      left: 0,
      bottom: 0,
      transform: '',
      order: this.element.style.zIndex
    };

    if( this.maxWindow ) this.normalize(e);
    
    this.element.classList.add('minimize');
    Object.assign(this.element.style, styles);
    this.minWindow = true;

    this.head.removeEventListener('mousedown', this.dragStart);
    this.element.addEventListener('click', this.normalize, false);

  }

  WindowElement.prototype.normalize = function(e){
    e.stopPropagation();

    var styles = {
      top: this.startShift + 'px',
      left: this.startShift + 'px',
      bottom: '',
      transform: 'translate3d('+ this.posX +'px,'+ this.posY +'px,0px)'
    };

    this.element.classList.remove('minimize', 'maximize');
    Object.assign(this.element.style, styles);
    this.minWindow = false;

    this.head.addEventListener('mousedown', this.dragStart);
    this.element.removeEventListener('click', this.normalize, false);
    this.maxElement.removeEventListener('click', this.normalize, false);
    this.maxElement.addEventListener('click', this.maximize, false);
  }

  WindowElement.prototype.maximize = function(e){
    e.stopPropagation();

    var styles = {
      top: 0,
      left: 0,
      transform: ''
    };
    this.element.classList.add('maximize');
    Object.assign(this.element.style, styles);
    this.maxWindow = true;

    this.head.removeEventListener('mousedown', this.dragStart);
    this.maxElement.removeEventListener('click', this.maximize, false);
    this.maxElement.addEventListener('click', this.normalize, false);
  }

  WindowElement.prototype.setTitle = function(html) {
    this.head.querySelector('.title').innerHTML = html;
  }

  var mainContainer = new Container('.container');
  d.querySelector('.add-window').addEventListener('click', function() {
    mainContainer.add(new WindowElement);
  })

})();