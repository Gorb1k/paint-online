import Tool from "./Tools";

export default class Brush extends Tool{
    constructor(canvas) {
        super(canvas);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mousedown = false
    }
    mouseDownHandler(e) {
        this.mousedown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    mouseMoveHandler(e) {
        if (this.mousedown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    draw(x, y) {
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }
}