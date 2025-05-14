export class Sprite extends Image {
    constructor(src, color = "#000", scale = 1) {
        super()
        this._src = src
        this._color = color
        this._scale = scale
        this._apply()
    }

    _resolve(){
        const url = import.meta.env.BASE_URL + this._src // vite leaky abstraction
        return url.replace("//","/")
    }

    _apply() {
        const img = new Image();

        img.onload = () => {
            const height = Math.floor(img.height * this.scale);
            const width = Math.floor(img.width * this.scale);
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = this._computedColor;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(img, 0, 0, width, height)

            this.src = canvas.toDataURL();
        }
        img.src = this._resolve()
    }

    get _computedColor() {
        return this._color.startsWith("--")
            ? getComputedStyle(document.querySelector("body")).getPropertyValue(this._color)
            : this._color
    }

    get color() {
        return this._color
    }

    set color(color) {
        this._color = color
        this._apply()
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale
        this._apply()
    }
}

export default Sprite