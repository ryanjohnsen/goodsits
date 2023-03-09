const tagList = ["Outlets", "Monitors", "Computers", "Quiet", "Noisy", "Comfy", "Outside", "Inside", "Food"];

function createTagElement(tag, picked_label, unpicked_label, limit = null) {
    let ele = document.createElement("div");
    ele.classList.add("tag");
    ele.classList.add("unpicked");
    ele.textContent = tag;

    ele.addEventListener("click", event => {
        ele.parentNode.removeChild(ele);
        if (ele.classList.contains("unpicked") && (!limit || getPickedTags(picked_label).length < limit)) {
            ele.classList.remove("unpicked");
            ele.classList.add("picked");
            let picked = document.getElementById(picked_label);
            picked.appendChild(ele);
        } else {
            ele.classList.remove("picked");
            ele.classList.add("unpicked");
            let unpicked = document.getElementById(unpicked_label);
            unpicked.appendChild(ele);
        }
    });

    return ele;
}

function populateTags(picked_label, unpicked_label, limit) {
    let unpicked = document.getElementById(unpicked_label);
    tagList.forEach(e => {
        unpicked.appendChild(createTagElement(e, picked_label, unpicked_label, limit));
    });
}

function setupTags(picked_label, unpicked_label, tags_label, limit) {
    let tags = document.getElementById(tags_label);

    let picked = document.createElement("div");
    picked.id = picked_label
    tags.appendChild(picked);

    let unpicked = document.createElement("div");
    unpicked.id = unpicked_label;
    tags.appendChild(unpicked);

    populateTags(picked_label, unpicked_label, limit);
}

function getPickedTags(picked_label) {
    let picked = document.getElementById(picked_label);
    return [...picked.querySelectorAll(".picked")].map(e => e.textContent);
}

const picked_label = document.currentScript.getAttribute("picked_label");
const unpicked_label = document.currentScript.getAttribute("unpicked_label");
const tags_label = document.currentScript.getAttribute("tags_label");
const limit = document.currentScript.getAttribute("limit"); // potentially null
console.log(limit)

setupTags(picked_label, unpicked_label, tags_label, limit);