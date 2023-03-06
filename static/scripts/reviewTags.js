const tagList = ["Outlets", "Monitors", "Computers", "Quiet", "Noisy", "Comfy", "Outside", "Inside", "Food"];

function createTagElement(tag) {
    let ele = document.createElement("div");
    ele.classList.add("tag");
    ele.classList.add("unpicked");
    ele.textContent = tag;

    ele.addEventListener("click", event => {
        ele.parentNode.removeChild(ele);
        if (ele.classList.contains("unpicked")) {
            ele.classList.remove("unpicked");
            ele.classList.add("picked");
            let picked = document.getElementById("review-picked-tags");
            picked.appendChild(ele);
        } else {
            ele.classList.remove("picked");
            ele.classList.add("unpicked");
            let unpicked = document.getElementById("review-unpicked-tags");
            unpicked.appendChild(ele);
        }
    });

    return ele;
}

function populateTags() {
    let unpicked = document.getElementById("review-unpicked-tags");
    tagList.forEach(e => {
        unpicked.appendChild(createTagElement(e));
    });
}

function setupTags() {
    let tags = document.getElementById("review-tags");



    let picked = document.createElement("div");
    picked.id = "review-picked-tags"
    tags.appendChild(picked);

    let unpicked = document.createElement("div");
    unpicked.id = "review-unpicked-tags";
    tags.appendChild(unpicked);

    populateTags();
}

function getPickedTags() {
    let picked = document.getElementById("review-picked-tags");
    return [...picked.querySelectorAll(".picked")].map(e => e.textContent);
}

setupTags();