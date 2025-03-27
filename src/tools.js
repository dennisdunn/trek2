
export const mkIcon = (url) => {
    const img = new Image();
    img.src = url;
    return img;
}

export const bindHandler = (id, evt, obj, fn) => {
    document.getElementById(id).addEventListener(evt, fn.bind(null, obj));
}

export const deg2Radian = (deg) => {
    return (Math.PI / 180) * deg;
}

export const randInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const randPos = (max_x, max_y) => {
    return {
        x: randInt(max_x),
        y: randInt(max_y)
    }
}