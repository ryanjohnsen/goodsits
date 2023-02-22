function addReview(){
    const reviewModal=document.getElementById("hideReviewForm");
    reviewModal.style.display="block";
}

document.getElementById("addBtn").addEventListener("click", addReview);