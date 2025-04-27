
export const bindHandler = (selector, event, obj, fn) => {
    document.querySelector(selector).addEventListener(event, fn.bind(null, obj));
}

export const deg2Radian = (deg) => (Math.PI / 180) * deg;

export const randInt = (max) => Math.floor(Math.random() * max);
export const randTween = (min, max) => randInt(max - min) + min;
// export const randFloat = (max) => Math.random() * max;
// export const randPos = (mx, my) => ({ x: randInt(mx), y: randInt(my) })
// export const randNav = (mspeed, mheading) => ({ speed: randFloat(mspeed), heading: randInt(mheading) })
// export const p = (prob) => Math.random() <= prob;