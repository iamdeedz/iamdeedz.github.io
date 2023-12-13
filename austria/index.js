console.log("View Width: " + window.innerWidth);
console.log("View Height: " + window.innerHeight);

const pages = ["", "loc-fact", "provinces", "national-anthem", "food", "sports", "history", "WWII", "celebs", "thanks"];
const pathname_array = document.location.pathname.split("/");
const current_page = pages.indexOf(pathname_array[pathname_array.length - 1].split(".")[0]);

document.addEventListener("DOMContentLoaded", load);

function load() {
    document.querySelector("body").classList.add("fade-in")
    setTimeout('document.querySelector("body").classList.remove("fade-in")', 1000);
}

function next_page() {
    document.querySelector("body").classList.add("fade-out");
    setTimeout('document.location = pages[current_page + 1] + ".html"', 1000);
}

function prev_page() {
    document.querySelector("body").classList.add("fade-out");

    // If the previous page is empty (is the index file), go to the root directory
    if (pages[current_page - 1] == "") {
        setTimeout('document.location = "."', 1000);
    }

    else {
        setTimeout('document.location = pages[current_page - 1] + ".html"', 1000);
    }
}
