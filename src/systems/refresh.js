import { System } from "../lib"

export class Refresh extends System {
    constructor() {
        super("dirty")
    }

    _refresh(name, value) {
        const els = document.getElementsByName(name)
        els.forEach(el => {
            const suffix = el.getAttribute("data-suffix")
            el.innerHTML = `${value}&nbsp;${suffix || ""}`
        });
    }

    update(_, entity) {
        const names = Object.keys(entity)
        names.forEach(name => {
            this._refresh(name, entity[name])
        });
        delete entity.dirty
    }
}

export default Refresh