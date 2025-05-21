//wishlist page
let fav =localStorage.getItem('myFavs');
console.log(fav);


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
