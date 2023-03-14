function averageRating() {
  let ratings = document.querySelectorAll(".rev-number");
  console.log(ratings);
  let star_counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (let i = 1; i < ratings.length; i++) {
    star_counts[parseInt(ratings[i].innerText)] += 1;
  }

  let rating_bars = document.querySelectorAll(".single-progress-bar");
  for (let i = 0; i < rating_bars.length; i++) {
    rating_text = rating_bars[i].querySelector(".rating-text").innerText;
    rating_value = rating_bars[i].querySelector(".rating-value");
    prog_bar = rating_bars[i].querySelector(".progress-bar");

    rating_text = rating_text.split("★")[0];
    rating_number = parseInt(rating_text);

    if (star_counts[rating_number] == 0) {
      prog_bar.style.width = "0%";
      rating_value.innerText = "0";
    } else {
      prog_bar.style.width = `${
        (star_counts[rating_number] / (ratings.length - 1)) * 100
      }%`;
      rating_value.innerText = star_counts[rating_number];
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let stars = document.querySelectorAll(".rating-upper");
  let rating = document.querySelectorAll(".rev-number");
  for (let i = 0; i < stars.length; i++) {
    stars[i].style.width = `${(parseFloat(rating[i].innerText) / 5) * 100}%`;
  }
});

document.addEventListener("DOMContentLoaded", averageRating);
