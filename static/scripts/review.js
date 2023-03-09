// FIXME: this is jank

function edit(event) {
  const rev_id = event.currentTarget.rev_id;
  changeButtonVisibility(rev_id, true);
  changeReviewVisibility(rev_id, true);
  // TODO: show hidden div of content
}

function exit(event) {
  const rev_id = event.currentTarget.rev_id;
  changeButtonVisibility(rev_id, false);
  changeReviewVisibility(rev_id, false);
}

async function save(event) {
  const rev_id = event.currentTarget.rev_id;
  // TODO: big vulnerability right here VVVVVVVVVVV
  const review = document.getElementById("edit-text-" + rev_id).value;
  // const rating = document.getElementById("edit-stars-" + rev_id).stars;
  // const tags = document.getElementById("edit-tags-" + rev_id).tags;
  const loc_id = event.currentTarget.getAttribute('loc_id');

  // const response = await fetch('/location/edit_review', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     'id': rev_id,
  //     'loc_id': loc_id,
  //     'rating': rating,
  //     'review': review
  //   }),
  // });

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
  const labels = ["text"];
  labels.forEach(label => {
    const data = document.getElementById(label + "-" + rev_id);
    const editable_data = document.getElementById("edit-" + label + "-" + rev_id);
    data.style.display = edit_mode ? "none" : "block";
    editable_data.style.display = edit_mode ? "block" : "none";
  });
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