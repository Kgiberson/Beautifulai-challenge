class App {
    constructor() {
        this.canvas = new SlideCanvas();
        $("body").append(this.canvas.render());

        this.canvas.addElement(new SimpleContainer());



        this.canvas.layout(false);
        $(window).on("resize", () => {
            this.canvas.layout(false);
        });
    }
}

class SlideCanvas {
    render() {
        this.$el = $("<div/>").addClass("canvas");
        return this.$el;
    }

    layout(animate) {
        var padding = 50;
        var canvasWidth = window.innerWidth - padding * 2;
        var canvasHeight = window.innerHeight - padding * 2;

        this.$el.css("left", padding + "px").css("top", padding + "px").width(canvasWidth).height(canvasHeight);

        if (this.element) {
            this.element.layout({
                left: 0,
                top: 0,
                width: canvasWidth,
                height: canvasHeight
            }, animate);
        }
    }

    addElement(element) {
        this.element = element;
        this.element.canvas = this;

        this.$el.append(element.render());
        element.renderUI();
    }
}

class BaseElement {
    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element");
        return this.$el;
    }

    layout(bounds, animate) {
        if (animate) {
            this.$el.animate(bounds, 500);
        } else{
            this.$el.css(bounds);
        }
    }

    renderUI() {

    }
}

class SimpleBox extends BaseElement {
    constructor(label) {
        super();
        this.label = label;
    }

    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element simplebox");

        this.$el.text(this.label);

        return this.$el;
    }

    renderUI() {
      var $button = $("<div/>").addClass("control").text("delete");
      $button.css({
        backgroundColor: 'indianred',
        fontSize: '12px',
        left: '5px',
        minWidth: '50px',
        padding: '5px',
        top: '5px',
        width: '10%'
      });
      this.$el.append($button);

      $button.on("click", () => {
          let selectedBoxForDeletion = $(this.$el);
          // debugger;
          this.removeChildElement(selectedBoxForDeletion);
      });
    }

    removeChildElement(element) {
        // debugger;
        var index = this.label;
        element.remove();
        this.parentElement.childElements.splice(index - 1, 1);
        this.parentElement.childElements.forEach(function(element) {
          if (element.label > index) {
            element.label--;
          };
        })
        // debugger;
        this.parentElement.layout();
    }
}

class SimpleContainer extends BaseElement {
    constructor() {
        super();
        this.childElements = [];
        this.slideCount = 1;
    }

    render() {
        this.$el = $("<div/>");
        this.$el.addClass("element");
        this.addChildElement(new SimpleBox(1));
        return this.$el;
    }

    layout(){
      let simpleBoxWidth = ((window.innerWidth - 120) / this.childElements.length)
      // debugger;
      this.childElements.forEach(function(element, index) {
        debugger;
        element.layout({
          top: (window.innerHeight - 100) / 3,
          left: (simpleBoxWidth * index) + 20,
          width: simpleBoxWidth - 20,
          height: 100
        }, true);
      })
    }

    renderUI() {
        var $button = $("<div/>").addClass("control").text("Add Item");
        this.$el.append($button);

        $button.on("click", () => {
            this.addChildElement(new SimpleBox(this.slideCount));
        });
    }

    addChildElement(element) {
        this.childElements.push(element);
        element.parentElement = this;

        this.$el.append(element.render());
        this.slideCount++;
        element.renderUI();
        this.layout();
    }
}
