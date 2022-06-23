const app = document.querySelector("#app");

let theme = window.localStorage.getItem("theme") || "dark";
let timedisplay = window.localStorage.getItem("timedisplay") || "both";
let clockdisplay = window.localStorage.getItem("clockdisplay") || "absolute";
let text = window.localStorage.getItem("text") || "";
let color = window.localStorage.getItem("color") ?? "black";
let hours = window.localStorage.getItem("hours") ?? null;
let minutes = window.localStorage.getItem("minutes") ?? null;
let selectedIndex = window.localStorage.getItem("selected-index") ?? 0;
let langIndex = window.localStorage.getItem("lang") || 36;
// let langCode =
//     window.localStorage.getItem("langCode") ||
//     navigator.language.split("-")[0].toUpperCase();
const tdbuttons = ["td-both", "td-relative", "td-absolute"];
const cdbuttons = ["cd-relative", "cd-absolute"];

// const preview = document.querySelector("#preview");
const link = document.querySelector("#link");
const previewIFramge = document.querySelector("#preview-iframe");

const updateLink = () => {
    link.setAttribute(
        "href",
        `https://countdown.weetisoft.xyz/canvas.html?${generateParams()}`,
    );
    previewIFramge.setAttribute(
        "src",
        `https://countdown.weetisoft.xyz/canvas.html?${generateParams()}`,
    );
};

const removeActiveClass = (list) => {
    list.forEach((selector) => {
        document.querySelector(`#${selector}`).classList.remove("active");
    });
};

tdbuttons.forEach((selector) => {
    const element = document.querySelector(`#${selector}`);
    element.addEventListener("click", (e) => {
        timedisplay = element.dataset.timedisplay;
        removeActiveClass(tdbuttons);
        element.classList.add("active");
        updateLink();
    });
});

cdbuttons.forEach((selector) => {
    const element = document.querySelector(`#${selector}`);
    element.addEventListener("click", (e) => {
        clockdisplay = element.dataset.timedisplay;
        removeActiveClass(cdbuttons);
        element.classList.add("active");
        updateLink();
    });
});

const textInput = document.querySelector("#text-input");
textInput.value = text;
textInput.addEventListener("input", (e) => {
    text = e.target.value;
    window.localStorage.setItem("text", text);
    updateLink();
});
const colorInput = document.querySelector("#color-input");
colorInput.value = color;
// preview.style.color = color;
colorInput.addEventListener("input", (e) => {
    color = e.target.value;
    // preview.style.color = e.target.value;
    window.localStorage.setItem("color", color);
    updateLink();
});
// const hoursInput = document.querySelector("#hours-input");
// hoursInput.value = hours;
// hoursInput.addEventListener("input", (e) => {
//     hours = e.target.value;
//     window.localStorage.setItem("hours", hours);
// });
// const minutesInput = document.querySelector("#minutes-input");
// minutesInput.value = minutes;
// minutesInput.addEventListener("input", (e) => {
//     minutes = e.target.value;
//     window.localStorage.setItem("minutes", minutes);
// });

const fontInput = document.querySelector("#font-select");
fontInput.selectedIndex = selectedIndex;
// preview.style["font-family"] = fontInput.value;
fontInput.addEventListener("change", (e) => {
    selectedIndex = e.target.selectedIndex;
    // preview.style["font-family"] = e.target.value;
    window.localStorage.setItem("selected-index", e.target.selectedIndex);
    updateLink();
});

const timeControl = document.querySelector("#datetime-input");
let d = new Date();
// let dateString = d.toJSON().split(".")[0];
let dateString = new Date().toISOString().split(".")[0];
dateString = dateString.substring(0, dateString.length - 2) + "00";
timeControl.value = moment.parseZone().format(moment.HTML5_FMT.DATETIME_LOCAL);
timeControl.addEventListener("change", () => updateLink());

const generateParams = () => {
    const params = new URLSearchParams();
    params.set("t", text);
    params.set("c", color);
    params.set("td", timedisplay);
    params.set("d", new Date(timeControl.value).getTime());
    params.set("f", fontInput.value);
    params.set("l", document.querySelector("#lang-input").value);
    params.set("cd", clockdisplay);
    return params.toString();
};

document.querySelector("#link").addEventListener("mouseover", (e) => {
    link.setAttribute(
        "href",
        `https://countdown.weetisoft.xyz/canvas.html?${generateParams()}`,
    );
});

const copyUrl = document.querySelector("#copy-url");
copyUrl.addEventListener("click", (e) => {
    window.navigator.clipboard
        .writeText(
            `https://countdown.weetisoft.xyz/canvas.html?${generateParams()}`,
        )
        .then(
            (success) => {
                copyUrl.textContent = "Copied!";
                setTimeout(() => {
                    copyUrl.textContent = "Copy URL";
                }, 2000);
            },
            (err) => {
                copyUrl.textContent = "Couldn't Copy!";
                copyUrl.style.backgroundColor = "red";
                setTimeout(() => {
                    copyUrl.textContent = "Copy URL";
                }, 2000);
            },
        );
});

const langInput = document.querySelector("#lang-input");

window.onload = () => {
    updateLink();
    fetch("/languages.json")
        .then((response) => response.json())
        .then((data) => {
            for (lang of data) {
                const opt = document.createElement("option");
                opt.setAttribute("value", lang.code);
                opt.innerText = lang.name;
                langInput.appendChild(opt);
            }

            langInput.selectedIndex = langIndex;
            updateLink();
            langInput.addEventListener("change", (e) => {
                // e.target.value = e.target.selectedIndex;
                window.localStorage.setItem("lang", e.target.selectedIndex);
                updateLink();
            });
        });
};
