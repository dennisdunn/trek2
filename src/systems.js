import { System } from "./ecs";

export class Logger extends System {
    constructor(el) {
        super({ msg: null });
        this.container = el;
    }
    update(ts, entity) {
        if (entity.msg) {
            const el = document.createElement('div');
            el.append(`${ts.toFixed(1)} ${entity.msg}`);
            this.container.append(el);
            entity.msg = null;
        }
    }
}

export class Plotter extends System {
    constructor(el) {
        super({ x: 0, y: 0, heading:0, icon: null });
        this.canvas = el;
    }
    init() {
        this._ctx = this.canvas.getContext('2d');
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(_, entity) {
        if (entity.icon) {
            // clamp to torus
            entity.x = entity.x < 0 ? this.canvas.width : entity.x;
            entity.x = entity.x > this.canvas.width ? 0 : entity.x;
            entity.y = entity.y < 0 ? this.canvas.height : entity.y;
            entity.y = entity.y > this.canvas.height ? 0 : entity.y;
            const img = new Image();
            img.src = entity.icon;
            this._ctx.save();
            this._ctx.translate(entity.x, entity.y);
            this._ctx.rotate((Math.PI/180)*entity.heading);
            this._ctx.drawImage(img, 0,0, 10, 10);
            this._ctx.restore();
        }
    }
}

export class Mover extends System {
    constructor() {
        super({ x: 0, y: 0, speed: 0, heading: 0 })
    }
    update(_, entity) {
        if (entity.speed>0) {
            entity.x += entity.speed * Math.cos((Math.PI/180)*(entity.heading-90));
            entity.y += entity.speed * Math.sin((Math.PI/180)*(entity.heading-90));
        }
    }
}