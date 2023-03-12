// FIXME: this is jank
// FIXME: instead of unique ids for every button, just do querySelectors instead

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
  // FIXME: big vulnerability right here VVVVVVVVVVV
  const review = document.getElementById("edit-text-" + rev_id).value;
  const loc_id = event.currentTarget.getAttribute('loc_id');
  const tags = document.getElementById("edit-tags-" + rev_id).tags;

  // Done: get the star rating value somehow
  let newRating = 0 ;
  for( let i=1; i <= 5; i++ ){
    if(document.getElementById(`star-${i}-`+rev_id).checked){
      newRating= i;
    }
  }


  console.log(newRating);

  console.log(review);
  console.log(loc_id);
  console.log(tags);
  




  
  const response = await fetch('/location/'+ loc_id + '/edit_review', {
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

// FIXME: probably a cleaner way to do this?
function changeButtonVisibility(rev_id, edit_mode = False) {
  const edit_btn = document.getElementById("edit-" + rev_id);
  const exit_btn = document.getElementById("exit-" + rev_id);
  const save_btn = document.getElementById("save-" + rev_id);

  exit_btn.style.display = edit_mode ? "block" : "none";
  save_btn.style.display = edit_mode ? "block" : "none";
  edit_btn.style.display = edit_mode ? "none" : "block";
}

function changeReviewVisibility(rev_id, edit_mode = False) {
  const labels = ["text", "tags", "stars"];
  labels.forEach(label => {
    const data = document.getElementById(label + "-" + rev_id);
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

document.querySelectorAll('.edit').forEach(group => {
  const rev_id = group.id;
  const labels = ["edit", "exit", "save"];
  const funcs = [edit, exit, save];
  for (let i = 0; i < labels.length; i++) {
    const button = document.getElementById(labels[i] + "-" + rev_id);
    button.rev_id = rev_id;
    button.addEventListener("click", funcs[i]);
  }
  const test = document.getElementById(rev_id);
});