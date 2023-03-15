// FIXME: this is jank

function edit(event) {
  const rev_id = event.currentTarget.rev_id;

  changeButtonVisibility(rev_id, true);
  changeReviewVisibility(rev_id, true);

  // TODO: show the ratings here
  const rating = document.getElementById("rev-rating-"+rev_id).textContent;

  // TODO: show the stars here
}

function exit(event) {
  const rev_id = event.currentTarget.rev_id;

  // TODO: clear all info in the edit review attempt
  
  
  //stars will readjust by themselves  
  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);
}

async function save(event) {
  const rev_id = event.currentTarget.rev_id;
  const rev_user_id = event.currentTarget.rev_user_id;
  const review = document.getElementById(`edit-text-${rev_id}`).value; 
  const tags = getPickedTags(`picked-tags-input-${rev_id}`).join(',');

  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);

  // Done: get the star rating value somehow
  let newRating = 0 ;
  for( let i=5; i > 0; i--){
    if(document.getElementById(`star-${i}-`+rev_id).checked){
      newRating= i;
      break;
    }
  }

  document.getElementById(`rev-rating-${rev_id}`).textContent = newRating;
  document.getElementById(`stars-${rev_id}`).querySelector(".rating-upper").style.width = `${parseFloat(newRating) / 5 * 100}%`;
  const listOfRatings = document.querySelectorAll('.rev-number');
  let ratings = 0;
  for (let i = 1; i < listOfRatings.length; i++) {
    ratings += parseFloat(listOfRatings[i].textContent);
  }
  const length = Math.max(listOfRatings.length - 1, 1);
  ratings = (ratings / length).toFixed(1);
  document.getElementById("rating-number").textContent = ratings;
  document.getElementById('rating').querySelector('.rating-upper').style.width = `${parseFloat(ratings) / 5 * 100}%`; 
  document.getElementById(rev_id).querySelector(`.text`).textContent = review;

  let tagsDiv = document.getElementById(`tags-${rev_id}`);
  tagsDiv.innerHTML = "";
  if (tags != "") {
    tags.split(",").forEach( ele => {
      let tag = document.createElement("div");
      tag.classList.add("picked");
      tag.classList.add("tag");
      tag.textContent = ele;
      tagsDiv.appendChild(tag);
    });
  }

  averageRating();
  
  const locId = location.href.split("/").pop();
  const response = await fetch(`/review/${rev_id}/edit`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      loc_id: locId,
      rating: newRating,
      review: review,
      tags: tags,
      rev_user_id: rev_user_id
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update review");
  }
}

// Delete is a keyword or something );
async function remove(event) {
  const rev_id = event.currentTarget.rev_id;
  const locId = location.href.split("/").pop();

  document.getElementById(rev_id).remove();
  const listOfRatings = document.querySelectorAll('.rev-number');
  let ratings = 0;
  for (let i = 1; i < listOfRatings.length; i++) {
    ratings += parseFloat(listOfRatings[i].textContent);
  }
  const length = Math.max(listOfRatings.length - 1, 1);
  ratings = (ratings / length).toFixed(1);
  document.getElementById("rating-number").textContent = ratings;
  document.getElementById('rating').querySelector('.rating-upper').style.width = `${parseFloat(ratings) / 5 * 100}%`; 
  averageRating();
  
  const response = await fetch(`/review/${rev_id}/delete`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }
}

function changeButtonVisibility(rev_id, edit_mode = False) {
  const div = document.getElementById(rev_id);
  const edit_btn = div.querySelector(".edit-button");
  const exit_btn = div.querySelector(".exit-button");
  const save_btn = div.querySelector(".save-button");
  const delete_btn = div.querySelector(".delete-button");

  exit_btn.style.display = edit_mode ? "block" : "none";
  save_btn.style.display = edit_mode ? "block" : "none";
  delete_btn.style.display = edit_mode ? "block" : "none";
  edit_btn.style.display = edit_mode ? "none" : "block";
}

function changeReviewVisibility(rev_id, edit_mode = false) {
  const div = document.getElementById(rev_id);
  const labels = ["text", "picked-tags", "stars"];
  labels.forEach(label => {
    const data = document.getElementById(rev_id).querySelector(`.${label}`);
    const editable_data = document.getElementById("edit-" + label + "-" + rev_id);
    data.style.display = edit_mode ? "none" : "flex";
    editable_data.style.display = edit_mode ? "block" : "none";
  });
}

function hideEdit(rev_id) {
  const div = document.getElementById(rev_id);
  const edit_btn = div.querySelector(".edit-button");
  edit_btn.style.display = "none";
}


document.querySelectorAll('.review').forEach(group => {
  const rev_id = group.id;
  const labels = ["edit-button", "exit-button", "save-button", "delete-button"];
  const funcs = [edit, exit, save, remove];
  
  const div = document.getElementById(rev_id);

  // user can only edit their own reviews
  const rev_user_id = div.getAttribute("rev_user_id");
  const user_id = div.getAttribute("user_id");
  if (rev_user_id === user_id) {
    for (let i = 0; i < labels.length; i++) {
      const button = div.querySelector("." + labels[i]);
      button.rev_id = rev_id;
      button.rev_user_id = rev_user_id;
      button.addEventListener("click", funcs[i]);
    }
  } else {
    hideEdit(rev_id);
  }
});