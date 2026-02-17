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

  const productsLink = document.getElementById("productsLink");
  const mobileProductsLink = document.getElementById("mobileProductsLink");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /* ================= FLOATING HEADER ================= */
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 10) {
      header.classList.add("shadow-md");
    } else {
      header.classList.remove("shadow-md");
    }
  });

  /* ================= MOBILE MENU TOGGLE ================= */
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  /* ================= PRODUCTS LINK ================= */
  productsLink.addEventListener("click", () => {
    loadProducts();
  });

  mobileProductsLink.addEventListener("click", () => {
    loadProducts();
    mobileMenu.classList.add("hidden");
  });

  /* ================= LOAD CATEGORIES ================= */
  async function loadCategories() {
    const res = await fetch(`${API}/products/categories`);
    const data = await res.json();

    // Create the "All" button first
    categoriesContainer.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.className =
      "category-btn bg-indigo-500 text-white px-4 py-1 rounded";
    allBtn.innerText = "All";
    categoriesContainer.appendChild(allBtn);

    // Create other category buttons
    data.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "category-btn bg-gray-200 px-4 py-1 rounded";
      btn.innerText = cat;
      categoriesContainer.appendChild(btn);
    });

    // Add click event to all category buttons
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active classes from all buttons
        document.querySelectorAll(".category-btn").forEach((b) => {
          b.classList.remove("bg-indigo-500", "text-white");
          b.classList.add("bg-gray-200");
        });

        // Set active classes on the clicked button
        btn.classList.add("bg-indigo-500", "text-white");
        btn.classList.remove("bg-gray-200");

        // Load products based on category
        loadProducts(btn.innerText === "All" ? "" : btn.innerText);
      });
    });
  }

  /* ================= LOAD PRODUCTS ================= */
  async function loadProducts(category = "") {
    loading.classList.remove("hidden");
    productsContainer.innerHTML = "";

    const url = category
      ? `${API}/products/category/${category}`
      : `${API}/products`;

    const res = await fetch(url);
    const data = await res.json();

    loading.classList.add("hidden");

    data.forEach((product) => {
      productsContainer.innerHTML += productCard(product);
    });

    addCardEvents();
  }

  /* ================= TRENDING ================= */
  async function loadTrending() {
    const res = await fetch(`${API}/products`);
    const data = await res.json();

    const topRated = data
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 3);

    trendingContainer.innerHTML = "";
    topRated.forEach((product) => {
      trendingContainer.innerHTML += productCard(product);
    });

    addCardEvents();
  }

  /* ================= PRODUCT CARD TEMPLATE ================= */
  function productCard(product) {
    return `
  <div class="bg-white p-4 rounded shadow">
    <img src="${product.image}" class="h-40 mx-auto object-contain">
    <h3 class="font-semibold mt-2 text-sm">
      ${product.title.substring(0, 40)}...
    </h3>
    <p class="text-indigo-600 font-bold">$${product.price}</p>
    <p class="text-sm">⭐ ${product.rating.rate}</p>
    <div class="mt-2 flex gap-2">
      <button class="details-btn bg-gray-200 px-3 py-1 rounded text-xs" data-id="${product.id}">
        Details
      </button>
      <button class="cart-btn bg-indigo-500 text-white px-3 py-1 rounded text-xs" data-id="${product.id}">
        Add to Cart<i class="fa-solid fa-cart-arrow-down"></i>
      </button>
    </div>
  </div>`;
  }

  /* ================= CARD EVENTS ================= */
  function addCardEvents() {
    document.querySelectorAll(".details-btn").forEach((btn) => {
      btn.onclick = async () => {
        const res = await fetch(`${API}/products/${btn.dataset.id}`);
        const product = await res.json();
        showModal(product);
      };
    });

    document.querySelectorAll(".cart-btn").forEach((btn) => {
      btn.onclick = async () => {
        const res = await fetch(`${API}/products/${btn.dataset.id}`);
        const product = await res.json();
        addToCart(product);
      };
    });
  }

  /* ================= MODAL ================= */
  function showModal(product) {
    // Show modal
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Inject modal content with close button
    modalContent.innerHTML = `
    <button id="closeModalInner" class="absolute top-2 right-2 text-gray-500 hover:text-red-700 text-sm">✕</button>
    <div class="overflow-y-auto max-h-[60vh] pr-2">
      <img src="${product.image}" class="h-40 mx-auto object-contain mb-4">
      <h2 class="font-bold text-sm">${product.title}</h2>
      <p class="text-gray-500 text-xs mt-2">${product.description}</p>
      <p class="font-bold mt-2">$${product.price}</p>
      <button id="modalAdd"
        class="mt-3 bg-indigo-500 text-white text-xs px-3 py-2 rounded w-full">
        Add to Cart<i class="fa-solid fa-cart-arrow-down"></i>
      </button>
    </div>
  `;

    // Safely attach events after content is injected
    const closeBtn = document.getElementById("closeModalInner");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      };
    }

    const addBtn = document.getElementById("modalAdd");
    if (addBtn) {
      addBtn.onclick = () => {
        addToCart(product);
      };
    }

    // Close modal if click outside modal content
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    };
  }

  const closeBtn = document.getElementById("closeModalInner");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    };
  }

  /* ================= CART ================= */
  function updateCart() {
    cartCount.innerText = cart.length;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      console.log(item);

      // Create cart item div
      const div = document.createElement("div");
      div.className =
        "flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-4 p-2 border rounded";

      div.innerHTML = `
  <div class="flex items-center justify-between w-full gap-2">
    <div class="flex items-center gap-3">
      <img src="${item.image}" class="h-16 w-16 object-contain rounded" alt="${item.title}">
      <div class="flex flex-col">
        <h4 class="text-sm font-semibold">${item.title.substring(0, 30)}${item.title.length > 30 ? "..." : ""}</h4>
      </div>
    </div>

    <!-- Price and remove button -->
    <div class="flex flex-col items-end gap-1">
      <p class="text-indigo-600 font-bold">$${item.price}</p>
      <button class="remove text-red-500 font-bold" data-index="${index}">✕</button>
    </div>
  </div>
`;

      const closeCartBtn = document.getElementById("closeCartSidebar");

      closeCartBtn.onclick = () => {
        const cartSidebar = document.getElementById("cartSidebar");
        cartSidebar.classList.add("translate-x-full"); // hide sidebar
      };

      const checkoutBtn = document.getElementById("checkoutBtn");

      checkoutBtn.onclick = () => {
        const cartSidebar = document.getElementById("cartSidebar");
        cartSidebar.classList.add("translate-x-full"); // hide sidebar
      };
      cartItemsContainer.appendChild(div);
    });

    // Attach remove event
    document.querySelectorAll(".remove").forEach((btn) => {
      btn.onclick = () => {
        cart.splice(btn.dataset.index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      };
    });

    totalPriceEl.innerText = total.toFixed(2);
  }

  /* ================= CART SIDEBAR TOGGLE ================= */
  cartBtn.onclick = () => {
    cartSidebar.classList.toggle("translate-x-full");
  };

  /* ================= INIT ================= */
  loadCategories();
  loadProducts();
  loadTrending();
  updateCart();
});
