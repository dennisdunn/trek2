import { System, deg2Radian } from "../lib"

export class Render extends System {
    constructor(selector) {
        super("x", "y", "sprite");
        this._canvas = document.querySelector(selector);
    }

    beforeupdate() {
        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
    }

    update(_, entity) {
        const ctx = this._canvas.getContext('2d');
        if (entity.sprite) {
            const { width, height } = entity.sprite;
            ctx.save();
            ctx.translate(entity.x, entity.y);
            ctx.rotate(deg2Radian(entity.heading));
            ctx.drawImage(entity.sprite, -width / 2, -height / 2, width, height);
            if (entity.name || entity.id) {
                const str = entity.name || entity.id
                ctx.rotate(deg2Radian(-entity.heading));
                ctx.font = '12px Arial'
                ctx.fillStyle = this.getStyle("--on-backdrop")
                const text = ctx.measureText(str);
                ctx.fillText(str, (-width / 2) - text.width / 8, (-height / 2) - 8);
            }
            ctx.restore();
        }
    }
}

export default Render