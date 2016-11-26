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

    var shift = 60 + 10 * this.length;

    el.close.onclick = function() { this.close(el) }.bind(this);

    el.element.style.top = shift + 'px';
    el.element.style.left = shift + 'px';
    this.zIndexUp(el.element);
    
    el.element.onmousedown = function() { this.zIndexUp(el.element) }.bind(this);

    this.wrapper.appendChild(el.element);
    this.push(el)
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
    this.head = this.element.querySelector('.head');
    this.close = this.head.querySelector('.close');
    this.posX = 0;
    this.posY = 0;
    this.newPosX = 0;
    this.newPosY = 0;
    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    this.head.addEventListener('mousedown', this.dragStart, false);
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

  var mainContainer = new Container('.container');
  d.querySelector('.add-window').addEventListener('click', function() {
    mainContainer.add(new WindowElement);
  })

})();