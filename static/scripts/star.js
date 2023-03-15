function averageRating() {
    let ratings = document.querySelectorAll(".rev-number");
    console.log(ratings);
    let starCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };
    for (let i = 1; i < ratings.length; i++) {
        starCounts[parseInt(ratings[i].innerText)] += 1;
    }

    let ratingBars = document.querySelectorAll(".single-progress-bar");
    for (let i = 0; i < ratingBars.length; i++) {
        ratingText = ratingBars[i].querySelector(".rating-text").innerText;
        ratingValue = ratingBars[i].querySelector(".rating-value");
        progBar = ratingBars[i].querySelector(".progress-bar");

        ratingText = ratingText.split("★")[0];
        ratingNumber = parseInt(ratingText);

        if (starCounts[ratingNumber] == 0) {
            progBar.style.width = "0%";
            ratingValue.innerText = "0";
        } else {
            progBar.style.width = `${
                (starCounts[ratingNumber] / (ratings.length - 1)) * 100
            }%`;
            ratingValue.innerText = starCounts[ratingNumber];
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let stars = document.querySelectorAll(".rating-upper");
    let rating = document.querySelectorAll(".rev-number");
    for (let i = 0; i < stars.length; i++) {
        stars[i].style.width = `${
            (parseFloat(rating[i].innerText) / 5) * 100
        }%`;
    }
});

document.addEventListener("DOMContentLoaded", averageRating);
