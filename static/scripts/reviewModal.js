function addReview() {
    const reviewModal = document.getElementById("hideReviewForm");
    const overlay = document.getElementById("fade-out-container");
    reviewModal.style.display="block";
    overlay.style.display="block";
}

function closeModal() {
    const reviewModal = document.getElementById("hideReviewForm");
    const overlay = document.getElementById("fade-out-container");
    overlay.style.display="none";
    reviewModal.style.display="none";
}

document.getElementById("addBtn").addEventListener("click", addReview);