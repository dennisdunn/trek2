import { System } from "../lib"

/**
 * Add messages to the comms panel.
 */
export class Message extends System {
    constructor(selector) {
        super("msg");
        this.container = document.querySelector(selector);
        this._msgs = []
    }

    _createLine(text) {
        const el = document.createElement('div');
        el.innerText = text;
        return el;
    }

    update(_, entity) {
        if (entity.msg) {
            console.log(entity.msg)
            this._msgs.unshift(entity.msg)
            delete entity.msg
            const msgs = this._msgs.map(this._createLine)
            this.container.replaceChildren(...msgs)
        }
    }
}

export default Message