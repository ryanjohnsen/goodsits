// FIXME: this is jank

function edit(event) {
  const rev_id = event.currentTarget.rev_id;
  console.log("edit " + rev_id);

  changeButtonVisibility(rev_id, true);
  changeReviewVisibility(rev_id, true);

  // TODO: show the ratings here
  const rating = document.getElementById("rev-rating-"+rev_id).textContent;

  // TODO: show the stars here
}

function exit(event) {
  const rev_id = event.currentTarget.rev_id;
  console.log("exit " + rev_id);

  // TODO: clear all info in the edit review attempt
  
  
  //stars will readjust by themselves  
  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);
}

async function save(event) {
  const rev_id = event.currentTarget.rev_id;
  const review = document.getElementById(`edit-text-${rev_id}`).value;

  // Done: get the star rating value somehow
  let newRating = 0 ;
  for( let i=1; i <= 5; i++ ){
    if(document.getElementById(`star-${i}-`+rev_id).checked){
      newRating= i;
    }
  }


  console.log(newRating);


  
  const response = await fetch(location.href + `/edit`, {
    method: 'POST',
    body: JSON.stringify({
      'id': rev_id,
      'loc_id': loc_id,
      'rating': newRating,
      'review': review
    }),
  });

  if (response.ok) {
    // celebrate
  } else {
    // idk struggle tweet
  }

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

document.querySelectorAll('.review').forEach(group => {
  const rev_id = group.id;
  const labels = ["edit-button", "exit-button", "save-button"];
  const funcs = [edit, exit, save];
  for (let i = 0; i < labels.length; i++) {
    const div = document.getElementById(rev_id);
    const button = div.querySelector("." + labels[i]);
    button.rev_id = rev_id;
    button.addEventListener("click", funcs[i]);
  }
});