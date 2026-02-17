document.addEventListener("DOMContentLoaded", () => {

const API = "https://fakestoreapi.com";

const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");
const trendingContainer = document.getElementById("trending");
const loading = document.getElementById("loading");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const cartBtn = document.getElementById("cartBtn");

const productsLink = document.getElementById('productsLink');
const mobileProductsLink = document.getElementById('mobileProductsLink');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= FLOATING HEADER ================= */
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('shadow-md');
  } else {
    header.classList.remove('shadow-md');
  }
});

/* ================= MOBILE MENU TOGGLE ================= */
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

/* ================= PRODUCTS LINK ================= */
productsLink.addEventListener('click', () => {
  loadProducts();
});

mobileProductsLink.addEventListener('click', () => {
  loadProducts();
  mobileMenu.classList.add('hidden');
});

/* ================= LOAD CATEGORIES ================= */
async function loadCategories(){
  const res = await fetch(`${API}/products/categories`);
  const data = await res.json();

  categoriesContainer.innerHTML =
    `<button class="category-btn bg-indigo-500 text-white px-4 py-1 rounded">All</button>`;

  data.forEach(cat=>{
    categoriesContainer.innerHTML +=
      `<button class="category-btn bg-gray-200 px-4 py-1 rounded">${cat}</button>`;
  });

  document.querySelectorAll(".category-btn").forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll(".category-btn")
        .forEach(b=>b.classList.remove("bg-indigo-500","text-white"));

      btn.classList.add("bg-indigo-500","text-white");

      loadProducts(btn.innerText === "All" ? "" : btn.innerText);
    }
  });
}

/* ================= LOAD PRODUCTS ================= */
async function loadProducts(category=""){
  loading.classList.remove("hidden");
  productsContainer.innerHTML = "";

  const url = category ?
    `${API}/products/category/${category}` :
    `${API}/products`;

  const res = await fetch(url);
  const data = await res.json();

  loading.classList.add("hidden");

  data.forEach(product=>{
    productsContainer.innerHTML += productCard(product);
  });

  addCardEvents();
}

/* ================= TRENDING ================= */
async function loadTrending(){
  const res = await fetch(`${API}/products`);
  const data = await res.json();

  const topRated = data
    .sort((a,b)=>b.rating.rate - a.rating.rate)
    .slice(0,3);

  trendingContainer.innerHTML = "";
  topRated.forEach(product=>{
    trendingContainer.innerHTML += productCard(product);
  });

  addCardEvents();
}

/* ================= PRODUCT CARD TEMPLATE ================= */
function productCard(product){
  return `
  <div class="bg-white p-4 rounded shadow">
    <img src="${product.image}" class="h-40 mx-auto object-contain">
    <h3 class="font-semibold mt-2 text-sm">
      ${product.title.substring(0,40)}...
    </h3>
    <p class="text-indigo-600 font-bold">$${product.price}</p>
    <p class="text-sm">⭐ ${product.rating.rate}</p>
    <div class="mt-2 flex gap-2">
      <button class="details-btn bg-gray-200 px-3 py-1 rounded text-xs" data-id="${product.id}">
        Details
      </button>
      <button class="cart-btn bg-indigo-500 text-white px-3 py-1 rounded text-xs" data-id="${product.id}">
        Add to Cart
      </button>
    </div>
  </div>`;
}

/* ================= CARD EVENTS ================= */
function addCardEvents(){
  document.querySelectorAll(".details-btn").forEach(btn=>{
    btn.onclick = async ()=>{
      const res = await fetch(`${API}/products/${btn.dataset.id}`);
      const product = await res.json();
      showModal(product);
    }
  });

  document.querySelectorAll(".cart-btn").forEach(btn=>{
    btn.onclick = async ()=>{
      const res = await fetch(`${API}/products/${btn.dataset.id}`);
      const product = await res.json();
      addToCart(product);
    }
  });
}

/* ================= MODAL ================= */
function showModal(product){
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  modalContent.innerHTML = `
    <img src="${product.image}" class="h-40 mx-auto object-contain mb-4">
    <h2 class="font-bold text-lg">${product.title}</h2>
    <p class="text-sm mt-2">${product.description}</p>
    <p class="font-bold mt-2">$${product.price}</p>
    <button id="modalAdd"
      class="mt-3 bg-indigo-500 text-white px-4 py-2 rounded">
      Add to Cart
    </button>
  `;

  document.getElementById("modalAdd").onclick = ()=>{
    addToCart(product);
  };
}

document.getElementById("closeModal").onclick = ()=>{
  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

/* ================= CART ================= */
function addToCart(product){
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  cartCount.innerText = cart.length;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item,index)=>{
    total += item.price;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-2";
    div.innerHTML = `
      <span class="text-sm">${item.title.substring(0,20)}...</span>
      <div>
        <span>$${item.price}</span>
        <button class="remove text-red-500 ml-2" data-index="${index}">✕</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  document.querySelectorAll(".remove").forEach(btn=>{
    btn.onclick = ()=>{
      cart.splice(btn.dataset.index,1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    }
  });

  totalPriceEl.innerText = total.toFixed(2);
}

/* ================= CART SIDEBAR TOGGLE ================= */
cartBtn.onclick = ()=>{
  cartSidebar.classList.toggle("translate-x-full");
};

/* ================= INIT ================= */
loadCategories();
loadProducts();
loadTrending();
updateCart();

});
