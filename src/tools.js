
export const loadIcon = (url) => {
    const img = new Image();
    img.src = url;
    return img;
}

export const mkIcon = (url, scale = 1, color = '#000') => {
    const img = new Image();
    const scaled = new Image();

    img.onload = () => {
        const height = Math.floor(img.height * scale);
        const width = Math.floor(img.width * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(img, 0, 0, width, height)

        scaled.src = canvas.toDataURL();
    }

    img.src = url;
    return scaled;
}

export const bindHandler = (id, evt, obj, fn) => {
    document.getElementById(id).addEventListener(evt, fn.bind(null, obj));
}

export const deg2Radian = (deg) => (Math.PI / 180) * deg;

export const randInt = (max) => Math.floor(Math.random() * max);

export const randFloat = (max) => Math.random() * max;