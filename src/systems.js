import { System } from "./ecs";
import { deg2Radian } from './tools'

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

export class Renderer extends System {
    constructor(el) {
        super({ x: 0, y: 0, icon: null });
        this.canvas = el;
    }

    init() {
        this._ctx = this.canvas.getContext('2d');
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _clamp(entity) {
        // clamp to torus
        entity.x = entity.x < 0 ? this.canvas.width : entity.x;
        entity.x = entity.x > this.canvas.width + entity.icon.width ? 0 : entity.x;
        entity.y = entity.y < 0 ? this.canvas.height : entity.y;
        entity.y = entity.y > this.canvas.height + entity.icon.height ? 0 : entity.y;
    }

    update(_, entity) {
        if (entity.icon) {
            this._clamp(entity);
            this._ctx.save();
            this._ctx.translate(entity.x, entity.y);
            this._ctx.rotate(deg2Radian(entity.heading));
            this._ctx.drawImage(entity.icon, 0, 0);
            this._ctx.restore();
        }
    }
}

export class Mover extends System {
    constructor() {
        super({ x: 0, y: 0, speed: 0, heading: 0 })
    }
    update(_, entity) {
        if (entity.speed > 0) {
            entity.x += entity.speed * Math.cos((Math.PI / 180) * (entity.heading - 90));
            entity.y += entity.speed * Math.sin((Math.PI / 180) * (entity.heading - 90));
        }
    }
}