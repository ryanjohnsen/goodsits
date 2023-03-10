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
  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);
}

async function save(event) {
  const rev_id = event.currentTarget.rev_id;
  // FIXME: big vulnerability right here VVVVVVVVVVV
  const review = document.getElementById("edit-text-" + rev_id).value;
  const loc_id = event.currentTarget.getAttribute('loc_id');
  const tags = document.getElementById("edit-tags-" + rev_id).tags;

  // TODO: get the star rating value somehow
  const rating = document.getElementById("rev-rating-"+rev_id).textContent;//current rating





  const response = await fetch('/location/'+ loc_id + '/edit_review', {
    method: 'POST',
    body: JSON.stringify({
      'id': rev_id,
      'loc_id': loc_id,
      'rating': rating,
      'review': review
    }),
  });

  // if (response.ok) {
  //   // celebrate
  // } else {
  //   // idk struggle tweet
  // }

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
    data.style.display = edit_mode ? "none" : "block";
    editable_data.style.display = edit_mode ? "block" : "none";
  });

  //TODO: display current stars:
  //not pretty but does the job
  const rating = document.getElementById("rev-rating-"+rev_id).textContent;//current rating
  console.log(rating);
  // switch(rating){
  //   case 5 :
  //     document.getElementById("star-5-"+rev_id).checked = true;
  //     document.getElementById("star-5-"+rev_id).style.color = "red";
  //     document.getElementById("star-4-"+rev_id).checked = true;
  //     document.getElementById("star-3-"+rev_id).checked = true;
  //     document.getElementById("star-2-"+rev_id).checked = true;
  //     document.getElementById("star-1-"+rev_id).checked = true;
  //   case 4 :
  //     document.getElementById("star-4-"+rev_id).checked = true;
  //     document.getElementById("star-3-"+rev_id).checked = true;
  //     document.getElementById("star-2-"+rev_id).checked = true;
  //     document.getElementById("star-1-"+rev_id).checked = true;
  //   case 3 :
  //     document.getElementById("star-3-"+rev_id).checked = true;
  //     document.getElementById("star-2-"+rev_id).checked = true;
  //     document.getElementById("star-1-"+rev_id).checked = true;
  //   case 2 :
  //     document.getElementById("star-2-"+rev_id).checked = true;
  //     document.getElementById("star-1-"+rev_id).checked = true;
  //   default:
  //     document.getElementById("star-1-"+rev_id).checked = true;
  // }
    
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