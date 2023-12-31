let curLoc = { lat: 44.9742826, lng: -93.2323081 }; // Keller Hall

function showFilters() {
    const filters = document.getElementById("filter-modal");
    filters.style.display = "block";
}

function hideFilters() {
    const filters = document.getElementById("filter-modal");
    if (filters.style.display == "none") return;

    filters.style.display = "none";
    searchWithFilters();
}

function searchWithFilters() {
    let tags = getPickedTags("picked-tags");
    let minRating = document.getElementById("min-rating").value;
    let text = searchBar.value;
    let proximity = document.getElementById("proximity-input").value;
    search(curLoc, text, tags, minRating, proximity);
}

function clearCards() {
    document.getElementById("cards-container").innerHTML = "";
}

function addCard(location) {
    // Have to be careful about cross-site scripting here. Right now, title and hours are escaped on the backend.
    let tags = "";
    if (location.tags != null) {
        location.tags.forEach((tag) => {
            tags += `<div class="picked tag">${tag}</div>`;
        });
    }
    let card = `
        <a href="location/${location.id}">
        <div class="card pure-g">
            <div class="info pure-u-13-24">
            <div class="heading">
                <div class="title">${location.title}</div>
                <div class="subtitle">${location.hours}</div>
            </div>
            <div class="details">
                <div class="proximity">📌 ${
                    location.distance == null
                        ? "?"
                        : location.distance.toFixed(1)
                } miles away</div>
                <div class="rating">⭐ ${(location.rating == null
                    ? 5.0
                    : parseFloat(location.rating)
                ).toFixed(1)} / 5.0</div>
            </div>
            <div class="picked-tags">${tags}</div>
            </div>
            <div class="img-container pure-u-11-24">
            <img class="img pure-img" src="/images/${location.id}" alt="">
            </div>
        </div>
        </a>
    `;
    let div = document.createElement("div");
    div.innerHTML = card;
    document.getElementById("cards-container").appendChild(div);
}

function pointToLatLng(point) {
    let toRet = {};
    point = point.substring(1, point.length - 1);
    toRet.lat = parseFloat(point.split(",")[0]);
    toRet.lng = parseFloat(point.split(",")[1]);
    return toRet;
}

let lastText = "";
let lastTags = [];
let lastMinRating = -1;
let lastProximity = 10000;
async function search(loc, text, tags, minRating, proximity) {
    lastText = text;
    lastTags = tags;
    lastMinRating = minRating;
    lastProximity = proximity;
    fetch(
        "/api/search?" +
            new URLSearchParams({
                location: loc.lat + "," + loc.lng,
                text: text,
                miles: proximity,
                minRating: minRating,
                tags: tags.join(","),
            })
    )
        .then((response) => response.json())
        .then((data) => {
            clearCards();
            data.forEach(function (ele) {
                addCard(ele);
            });

            displayPoints(
                data
                    .filter((ele) => ele.location != null)
                    .map((ele) => {
                        return {
                            id: ele.id,
                            point: pointToLatLng(ele.location),
                        };
                    })
            );
        });
}

let searchBar = document.getElementById("search");
searchBar.addEventListener("keydown", (event) => {
    if (event.key != "Enter") return;

    searchWithFilters();
});

let searchBarBtn = document.getElementById("search-button");
searchBarBtn.addEventListener("click", (event) => {
    searchWithFilters();
});

const params = new URL(document.location).searchParams;
const title = params.get("title");
if (title != null) {
    searchBar.value = lastText = title;
    search(curLoc, lastText, lastTags, lastMinRating, lastProximity);
    window.history.pushState({}, document.title, window.location.pathname);
} else {
    search(curLoc, lastText, lastTags, lastMinRating, lastProximity);
}

navigator.geolocation.getCurrentPosition(
    function (location) {
        curLoc = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        };
        search(curLoc, lastText, lastTags, lastMinRating, lastProximity);
    },
    function (positionError) {
        /* "Error Handling" :(*/
    }
);

window.addEventListener(
    "click",
    function (event) {
        if (!document.getElementById("filter").contains(event.target)) {
            hideFilters();
        }
    },
    false
);
