import { System } from "../lib"

export class Render extends System {
    constructor(canvas) {
        super({ x: 0, y: 0, icon: null });
        this.canvas = canvas;
    }

    init(_) {
        this._ctx = this.canvas.getContext('2d');
        const parent = this.canvas.parentElement; // handle resizing the window
        this.canvas.width = parent.clientWidth - 32; // minus the parent padding
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(_, entity) {
        if (entity.icon) {
            const { width, height } = entity.icon;
            this._ctx.save();
            this._ctx.translate(entity.x, entity.y);
            this._ctx.rotate(deg2Radian(entity.heading));
            this._ctx.drawImage(entity.icon, -width / 2, -height / 2, width, height);
            if (entity.name || entity.id) {
                const str = entity.name || entity.id
                this._ctx.rotate(deg2Radian(-entity.heading));
                this._ctx.font = '12px Arial'
                const text = this._ctx.measureText(str);
                this._ctx.fillText(str, (-width / 2) - text.width / 8, (-height / 2) - 8);
            }
            this._ctx.restore();
        }
    }
}

export default Render