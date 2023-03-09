function edit(event) {
  const rev_num = event.currentTarget.rev_num;
  const [edit_btn, exit_btn, save_btn] = getButtons(rev_num);
  exit_btn.style.display = "block", save_btn.style.display = "block";
  edit_btn.style.display = "none";

  // TODO: show hidden div of content
}

function exit(event) {
  const rev_num = event.currentTarget.rev_num;
  const [edit_btn, exit_btn, save_btn] = getButtons(rev_num);
  exit_btn.style.display = "none", save_btn.style.display = "none";
  edit_btn.style.display = "block";
}

function save(event) {
  // TODO: edit things
}

// FIXME: probably a cleaner way to do this?
function getButtons(rev_num) {
  const edit_btn = document.getElementById("edit-" + rev_num);
  const exit_btn = document.getElementById("exit-" + rev_num);
  const save_btn = document.getElementById("save-" + rev_num);
  return [edit_btn, exit_btn, save_btn];
}

document.querySelectorAll('.edit').forEach(group => {
  const rev_num = group.id;
  const labels = ["edit", "exit", "save"];
  const funcs = [edit, exit, save];
  for (let i = 0; i < labels.length; i++) {
    const button = document.getElementById(labels[i] + "-" + rev_num);
    button.rev_num = rev_num;
    button.addEventListener("click", funcs[i]);
  }
});