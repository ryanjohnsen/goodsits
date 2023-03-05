function showFilters() {
    const filters = document.getElementById("filter-modal");
    filters.style.display = "block";
}

function hideFilters() {
    const filters = document.getElementById("filter-modal");
    filters.style.display = "none";
}

async function search(location, text, tags, minRating, proximity) {
    fetch("/api/search?" + new URLSearchParams({
        location: location.coords.latitude + "," + location.coords.longitude,
        miles: proximity,
        tags: tags.join(",")
    })).then(response => response.json()).then(data => {
        console.log(data);
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