function addReview() {
    const reviewModal=document.getElementById("hideReviewForm");
    reviewModal.style.display="block";
}

function closeModal() {
    const reviewModal=document.getElementById("hideReviewForm");
    reviewModal.style.display="none";
}

document.getElementById("addBtn").addEventListener("click", addReview);