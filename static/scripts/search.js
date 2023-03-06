function showFilters() {
    const filters = document.getElementById("filter-modal");
    filters.style.display = "block";
}

function hideFilters() {
    const filters = document.getElementById("filter-modal");
    filters.style.display = "none";
}

function clearCards() {
    document.getElementById("cards-container").innerHTML = "";
}

function addCard(location) {
    // This definetly has cross site scripting vulnerabilities right now
    let card = `
        <a href="#">
        <div class="card pure-g">
            <div class="info pure-u-13-24">
            <div class="heading">
                <div class="title">${location.title}</div>
                <div class="subtitle">${location.hours}</div>
            </div>
            <div class="details">
                <div class="proximity">📌 ${location.distance} km away</div>
                <div class="rating">⭐ ${location.rating == null ? "5.0" : location.rating} / 5.0</div>
            </div>
            <div id="tags">(tags go here)</div>
            </div>
            <div class="img-container pure-u-11-24">
            <img class="img pure-img" src="/images/${location.id}" alt="">
            </div>
        </div>
        </a>
    `;
    let div = document.createElement('div');
    div.innerHTML = card;
    document.getElementById("cards-container").appendChild(div);
}

async function search(location, text, tags, minRating, proximity) {
    fetch("/api/search?" + new URLSearchParams({
        location: location.coords.latitude + "," + location.coords.longitude,
        text: text,
        miles: proximity,
        minRating: minRating,
        tags: tags.join(",")
    })).then(response => response.json()).then(data => {
        console.log(data);
        clearCards();
        data.forEach(ele => addCard(ele));
    });
}

let searchBar = document.getElementById("search");
searchBar.addEventListener("keydown", event => {
    if (event.key != "Enter")
        return;

    let tags = getPickedTags();
    let minRating = document.getElementById("min-rating").value;
    let text = searchBar.value;
    let proximity = document.getElementById("proximity-input").value;
    navigator.geolocation.getCurrentPosition(function (location) {
        search(location, text, tags, minRating, proximity);
    }, function (positionError) { /* "Error Handling" */ } );
});