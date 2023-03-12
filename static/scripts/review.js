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
  const review = document.getElementById(`edit-text-${rev_id}`).value; 
  const tags = getPickedTags(`picked-tags-input-${rev_id}`).join(',');

  // Done: get the star rating value somehow
  let newRating = 0 ;
  for( let i=1; i <= 5; i++ ){
    if(document.getElementById(`star-${i}-`+rev_id).checked){
      newRating= i;
    }
  }
  
  const response = await fetch(location.href + `/edit`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review_id: rev_id,
      rating: newRating,
      review: review,
      tags: tags
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update review");
  }


  document.getElementById(`rev-rating-${rev_id}`).textContent = newRating;
  document.getElementById(`stars-${rev_id}`).querySelector(".rating-upper").style.width = `${parseFloat(newRating) / 5 * 100}%`;
  const listOfRatings = document.querySelectorAll('.rev-number');
  let ratings = 0;
  for (let i = 1; i < listOfRatings.length; i++) {
    ratings += parseFloat(listOfRatings[i].textContent);
  }
  ratings = (ratings / (listOfRatings.length - 1)).toFixed(1);
  document.getElementById("rating-number").textContent = ratings;
  document.getElementById('rating').querySelector('.rating-upper').style.width = `${parseFloat(ratings) / 5 * 100}%`; 
  document.getElementById(rev_id).querySelector(`.text`).textContent = review;

  let tagsDiv = document.getElementById(`tags-${rev_id}`);
  tagsDiv.innerHTML = "";
  tags.split(",").forEach( ele => {
    let tag = document.createElement("div");
    tag.classList.add("picked");
    tag.classList.add("tag");
    tag.textContent = ele;
    tagsDiv.appendChild(tag);
  }); 

  averageRating();
  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);
}

function changeButtonVisibility(rev_id, edit_mode = False) {
  const div = document.getElementById(rev_id);
  const edit_btn = div.querySelector(".edit-button");
  const exit_btn = div.querySelector(".exit-button");
  const save_btn = div.querySelector(".save-button");

  exit_btn.style.display = edit_mode ? "block" : "none";
  save_btn.style.display = edit_mode ? "block" : "none";
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

  //Done: display current stars:
  const rating = document.getElementById("rev-rating-"+rev_id).textContent;//current rating
  // 
  for( let i=1; i <= rating; i++ ){
    document.getElementById(`star-${i}-`+rev_id).checked = true;
  }
}

function hideEdit(rev_id) {
  const div = document.getElementById(rev_id);
  const edit_btn = div.querySelector(".edit-button");
  edit_btn.style.display = "none";
}


document.querySelectorAll('.review').forEach(group => {
  const rev_id = group.id;
  const labels = ["edit-button", "exit-button", "save-button"];
  const funcs = [edit, exit, save];
  
  const div = document.getElementById(rev_id);

  // user can only edit their own reviews
  const rev_user_id = div.getAttribute("rev_user_id");
  const user_id = div.getAttribute("user_id");
  if (rev_user_id === user_id) {
    for (let i = 0; i < labels.length; i++) {
      const button = div.querySelector("." + labels[i]);
      button.rev_id = rev_id;
      button.addEventListener("click", funcs[i]);
    }
  } else {
    hideEdit(rev_id);
  }
});