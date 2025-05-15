export class Sprite extends Image {
    constructor(src, color = "#000", scale = 1) {
        super()
        // Ensure that the URL for the asset is relative to the app root.
        const imgSrc = src.startsWith("./")
            ? src
            : src.startsWith("/")
                ? "." + src
                : "./" + src
        const imgColor = color.startsWith("--")
            ? getComputedStyle(document.querySelector("body")).getPropertyValue(color)
            : color
        const img = new Image();

        img.onload = () => {
            const height = Math.floor(img.height * scale);
            const width = Math.floor(img.width * scale);
            const canvas = new OffscreenCanvas(width, height);

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = imgColor;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(img, 0, 0, width, height)

            canvas.convertToBlob()
                .then(data => this.src = URL.createObjectURL(data))
        }
        img.src = imgSrc
    }
}

export default Sprite