import { System } from "../lib"

/**
 * Add messages to the comms panel.
 */
export class Logger extends System {
    constructor(el) {
        super({ msg: null });
        this.container = el;
        this._msgs = []
    }
    _createLine(text) {
        const el = document.createElement('div');
        el.innerText = text;
        return el;
    }
    update(ts, entity) {
        if (entity.msg) {
            console.log(entity.msg)
            this._msgs.unshift(entity.msg)
            delete entity.msg
            const msgs = this._msgs.map(this._createLine)
            this.container.replaceChildren(...msgs)
        }
    }
}

export default Logger