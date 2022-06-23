function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

const clamp = (val, min, max) => {
    if (val < min) return min;
    if (val > max) return max;
    return val;
};
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const timeStarted = new Date(Number.parseInt(params.d)); // - (1000 * 60 * 0.9);\

let width = canvas.width,
    height = canvas.height;
let radius = 0;
let radiusGrower = setInterval(() => {
    radius = clamp(radius + 5000, 0, height / 3);
}, 5);

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

const formatter = new Intl.RelativeTimeFormat(params.l, {
    style: "long",
    numeric: "auto",
});

window.setInterval(() => {
    c.canvas.width = window.innerWidth;
    c.canvas.height = window.innerHeight;
    width = window.innerWidth;
    height = window.innerHeight;
    c.clearRect(0, 0, width, height);
    c.strokeStyle = params.c || "white";
    const cx = width / 2;
    const cy = height / 3 + 10;

    c.moveTo(cx, cy);

    c.beginPath();
    c.lineWidth = 6;
    c.arc(cx, cy, radius, 0, 2 * Math.PI);
    c.stroke();
    c.beginPath();
    c.fillStyle = params.c;
    c.arc(cx, cy, 7, 0, 2 * Math.PI);
    c.fill();

    {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * 360;

            c.save();
            c.translate(cx, cy);
            c.beginPath();
            c.rotate(((angle - 90) * Math.PI) / 180);
            c.moveTo(radius * 0.85, 0);
            c.lineWidth = 4;
            c.lineTo(radius, 0);
            c.stroke();
            c.restore();
        }
    }
    if (params.cd == "absolute") {
        let percentage =
            timeStarted.getHours() / 12 + timeStarted.getMinutes() / 60 / 12;
        const angle = percentage * 360;
        c.save();
        c.translate(cx, cy);
        c.beginPath();
        c.rotate(((angle - 90) * Math.PI) / 180);
        c.fillStyle = "red";
        c.arc(radius, 0, 10, 0, 2 * Math.PI, false);
        c.fill();
        c.restore();
    } else {
        const angle = 0;
        c.save();
        c.translate(cx, cy);
        c.beginPath();
        c.rotate(((angle - 90) * Math.PI) / 180);
        c.fillStyle = "red";
        c.arc(radius, 0, 10, 0, 2 * Math.PI, false);
        c.fill();
        c.restore();
    }

    const now = new Date();
    {
        let percentage;
        if (params.cd == "relative")
            percentage = (Date.now() - timeStarted) / 1000 / 60;
        else
            percentage =
                now.getSeconds() / 60 + now.getMilliseconds() / 1000 / 60;
        const angle = percentage * 360;

        c.save();
        c.translate(cx, cy);
        c.beginPath();
        c.moveTo(0, 0);
        c.rotate(((angle - 90) * Math.PI) / 180);
        c.lineWidth = 1;
        c.lineTo(radius * 0.85, 0);
        c.stroke();
        c.restore();
    }
    {
        let percentage;
        if (params.cd == "relative")
            percentage = (Date.now() - timeStarted) / 1000 / 60 / 60;
        else percentage = now.getSeconds() / 60 / 60 + now.getMinutes() / 60;
        const angle = percentage * 360;

        c.save();
        c.translate(cx, cy);
        c.moveTo(0, 0);
        c.rotate(((angle - 90) * Math.PI) / 180);
        c.lineWidth = 3;
        c.lineTo(radius * 0.75, 0);
        c.stroke();
        c.restore();
    }
    {
        let percentage;
        if (params.cd == "relative")
            percentage = (Date.now() - timeStarted) / 1000 / 60 / 60 / 12;
        else percentage = now.getMinutes() / 60 / 12 + now.getHours() / 12;
        const angle = percentage * 360;

        c.save();
        c.translate(cx, cy);
        c.moveTo(0, 0);
        c.rotate(((angle - 90) * Math.PI) / 180);
        c.lineTo(radius * 0.5, 0);
        c.stroke();
        c.restore();
    }

    c.font = `36px ${params.f == null ? "Roboto" : params.f}`;
    c.textAlign = "center";
    c.fillStyle = params.c || "white";
    let seconds = (timeStarted - Date.now()) / 1000;
    const lines = [];
    if (params.t != null) lines.push(params.t);

    if (params.td == null) params.set("td", "both");
    if (params.td == "both" || params.td == "relative") {
        let text = formatter.format(seconds.toFixed(0), "seconds");
        let minutes =
            Math.floor(Math.abs(seconds) / 60) * (seconds > 0 ? 1 : -1);
        let hours = Math.round(Math.abs(minutes) / 60) * (seconds > 0 ? 1 : -1);
        let days = Math.round(Math.abs(hours) / 24) * (seconds > 0 ? 1 : -1);
        if (Math.abs(minutes) > 0) text = formatter.format(minutes, "minutes");
        if (Math.abs(hours) > 0) text = formatter.format(hours, "hours");
        if (Math.abs(days) > 0) text = formatter.format(days, "days");
        getLines(c, text, 750).forEach((line) => lines.push(line));
    }
    if (params.td == "both" || params.td == "absolute")
        lines.push(`${new Date(timeStarted).toLocaleString(params.l || "EN")}`);

    const textHeight = 36;
    const padding = textHeight * 1.3;
    const startIndex = 1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        c.fillText(line, width / 2, cy + radius + padding * (i + startIndex));
    }
}, 5);
