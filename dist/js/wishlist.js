//wishlist page
let fav = JSON.parse(localStorage.getItem('myFavs'));
let products =JSON.parse(localStorage.getItem('products'));


const wishlistHasItems = [];
const emptyWishList = document.getElementById('emptyWishList');
const wishlist = document.getElementById('wishlist');

if (wishlistHasItems) {
    emptyWishList.style.display = 'none';
    wishlist.style.display = 'block';
} else {
    emptyWishList.style.display = 'block';
    wishlist.style.display = 'none';
}

function continueShopping() {
    window.location.href = 'index.html';
}
