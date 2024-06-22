// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// JavaScript for opening and closing the cart menu
document.getElementById('cart-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    event.stopPropagation(); // Prevent click event from propagating to the document
    document.getElementById('cart-menu').classList.toggle('open');
});

// Close the cart if clicking outside of it
document.addEventListener('click', function(event) {
    const cartMenu = document.getElementById('cart-menu');
    if (!cartMenu.contains(event.target) && !event.target.closest('#cart-button')) {
        cartMenu.classList.remove('open');
    }
});

// Prevent clicks inside the cart menu from closing it
document.getElementById('cart-menu').addEventListener('click', function(event) {
    event.stopPropagation();
});


// Product list
const products = [
    { id: 1, image: '../imgs/macbook-pro-13.jpeg', title: 'Apple MacBook Pro 13"', price: 1299 },
    { id: 2, image: '../imgs/iphone14.jpeg', title: 'Apple iPhone 14 Blue', price: 699 },
    { id: 3, image: '../imgs/ipad.jpg', title: 'Apple iPad Pro 13 Black', price: 499 },
    { id: 4, image: '../imgs/homepod.jpeg', title: 'Apple HomePod Mini', price: 199 },
    { id: 5, image: '../imgs/apple-pencil', title: 'Apple Pencil', price: 119 },
    { id: 6, image: '../imgs/airpods-max.jpeg', title: 'Apple AirPods Max Green', price: 499 },
];

let cart = [];

// Load cart from local storage
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
});

function addToCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        // Product already in cart, increase quantity
        cart[productIndex].quantity += 1;
    } else {
        // Product not in cart, add as new entry
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    console.log('Product added to cart:', productId);
    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    console.log('Product removed from cart:', productId);
    saveCart();
    renderCart();
}

function renderCart() {
    const cartContent = document.getElementById('cart-content');
    let totalCost = 0;
    cartContent.innerHTML = '';
    cart.forEach(item => {
        totalCost += item.price * item.quantity;
        cartContent.innerHTML += `
            <div class="cart-box">
                <img src="${item.image}" alt="${item.title}" class="cart-img">
                <div class="detail-box">
                    <div class="quantity-and-remove">
                        <div style="margin:0;">
                            <div class="cart-product-title">${item.title}</div>
                            <div class="cart-price">$${item.price}</div>
                        </div>
                        <input type="number" value="${item.quantity}" class="cart-quantity" style="margin:0;" min="1" onchange="updateQuantity(${item.id}, this.value)">
                        <!--Remove Cart-->
                        <i class="bx bxs-trash-alt cart-remove" style="color:purple;" onclick="removeFromCart(${item.id})"></i>  
                    </div>
                </div>
            </div>`;
    });
    document.querySelector('.checkout p').innerText = `Total: ${formatPrice(totalCost)}`;
}

function updateQuantity(productId, quantity) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = parseInt(quantity, 10);
        console.log('Product quantity updated:', productId, quantity);
        saveCart();
        renderCart();
    }
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}
