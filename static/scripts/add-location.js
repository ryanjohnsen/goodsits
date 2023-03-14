const form = document.getElementById("add-location");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const location = document.getElementById("location");

    if (location.value == null || location.value.length === 0) {
        alert("Ensure you place a pinpoint on the map!");
        return;
    }

    form.submit();
});

function send_tags() {
    document.getElementById("tags-list").value = getPickedTags();
}
