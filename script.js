const products = [
 {id:1,name:"Nova X Pro Smartphone",category:"Electronics",price:44999,old:49999,rating:4.8,icon:"📱"},
 {id:2,name:"AirBeat Pro Headphones",category:"Electronics",price:6999,old:8999,rating:4.7,icon:"🎧"},
 {id:3,name:"Chrono Smart Watch",category:"Electronics",price:5999,old:7499,rating:4.6,icon:"⌚"},
 {id:4,name:"Minimal Runner Sneakers",category:"Fashion",price:3299,old:4499,rating:4.8,icon:"👟"},
 {id:5,name:"Classic Oversized Tee",category:"Fashion",price:999,old:1499,rating:4.5,icon:"👕"},
 {id:6,name:"Urban Everyday Backpack",category:"Fashion",price:1899,old:2499,rating:4.7,icon:"🎒"},
 {id:7,name:"Nordic Table Lamp",category:"Home",price:2199,old:2999,rating:4.6,icon:"💡"},
 {id:8,name:"CloudSoft Cushion Set",category:"Home",price:1299,old:1699,rating:4.4,icon:"🛋️"},
 {id:9,name:"Aroma Diffuser",category:"Home",price:1599,old:2199,rating:4.7,icon:"🌿"},
 {id:10,name:"Glow Daily Skincare Kit",category:"Beauty",price:2499,old:3299,rating:4.9,icon:"✨"},
 {id:11,name:"Hydra Face Serum",category:"Beauty",price:799,old:1099,rating:4.6,icon:"🧴"},
 {id:12,name:"Everyday Fitness Bottle",category:"Sports",price:899,old:1199,rating:4.5,icon:"🥤"},
 {id:13,name:"Pro Yoga Mat",category:"Sports",price:1499,old:1999,rating:4.8,icon:"🧘"},
 {id:14,name:"Training Football",category:"Sports",price:1199,old:1599,rating:4.7,icon:"⚽"},
 {id:15,name:"Mechanical Keyboard",category:"Electronics",price:3999,old:4999,rating:4.8,icon:"⌨️"},
 {id:16,name:"Ceramic Coffee Set",category:"Home",price:1799,old:2299,rating:4.5,icon:"☕"}
];

let cart = JSON.parse(localStorage.getItem("shopease-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("shopease-wishlist") || "[]");
let currentCategory = "All";

const money = n => "₹" + n.toLocaleString("en-IN");
const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("shopease-cart", JSON.stringify(cart));
  localStorage.setItem("shopease-wishlist", JSON.stringify(wishlist));
  updateCounts();
}
function updateCounts() {
  $("cartCount").textContent = cart.reduce((a,x)=>a+x.qty,0);
  $("wishCount").textContent = wishlist.length;
}
function renderProducts() {
  const q = $("searchInput").value.toLowerCase().trim();
  let list = products.filter(p =>
    (currentCategory==="All" || p.category===currentCategory) &&
    (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );
  const sort = $("sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);

  $("productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
      <div class="product-image">${p.icon}</div>
      <div class="product-info">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <div class="rating">⭐ ${p.rating}</div>
        <div class="price">${money(p.price)} <span class="old-price">${money(p.old)}</span></div>
        <button class="btn primary add" onclick="addToCart(${p.id})">Add to cart</button>
      </div>
    </article>
  `).join("");
  $("emptyState").classList.toggle("hidden", list.length !== 0);
}
function toggleWish(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  save(); renderProducts();
  showToast(wishlist.includes(id) ? "Added to wishlist" : "Removed from wishlist");
}
function addToCart(id) {
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  save(); renderCart(); showToast("Added to cart");
}
function changeQty(id, delta) {
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(x=>x.id!==id);
  save(); renderCart();
}
function renderCart() {
  if(!cart.length) {
    $("cartItems").innerHTML = '<div class="empty">Your cart is empty.<br>Start shopping to add items.</div>';
  } else {
    $("cartItems").innerHTML = cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `<div class="cart-row">
        <div class="cart-thumb">${p.icon}</div>
        <div><h4>${p.name}</h4><p>${money(p.price)}</p>
          <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
        </div>
        <button class="remove" onclick="changeQty(${p.id},-${item.qty})">Remove</button>
      </div>`;
    }).join("");
  }
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  $("subtotal").textContent=money(total);
}
function openCart() {
  $("cartDrawer").classList.add("open"); $("overlay").classList.add("show"); renderCart();
}
function closeAll() {
  $("cartDrawer").classList.remove("open"); $("overlay").classList.remove("show");
  $("checkoutModal").classList.add("hidden");
}
function showToast(msg) {
  const t=$("toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove("show"),1800);
}

$("cartBtn").onclick=openCart;
$("overlay").onclick=closeAll;
$("searchBtn").onclick=renderProducts;
$("searchInput").addEventListener("input",renderProducts);
$("categoryFilter").addEventListener("change",e=>{currentCategory=e.target.value;renderProducts()});
$("sortSelect").addEventListener("change",renderProducts);
$("menuBtn").onclick=()=>$("navLinks").classList.toggle("show");

document.querySelectorAll("[data-category]").forEach(btn=>btn.onclick=()=>{
  currentCategory=btn.dataset.category; $("categoryFilter").value=currentCategory; renderProducts();
  location.hash="products";
});
document.querySelectorAll("[data-category-link]").forEach(a=>a.onclick=()=>{
  currentCategory=a.dataset.categoryLink; $("categoryFilter").value=currentCategory; renderProducts();
});
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);

$("wishlistBtn").onclick=()=>{
  if(!wishlist.length) return showToast("Your wishlist is empty");
  const names=wishlist.map(id=>products.find(p=>p.id===id).name);
  showToast(`${names.length} item${names.length>1?"s":""} in wishlist`);
};
$("checkoutBtn").onclick=()=>{
  if(!cart.length) return showToast("Your cart is empty");
  $("checkoutModal").classList.remove("hidden");
};
$("checkoutForm").onsubmit=e=>{
  e.preventDefault();
  cart=[]; save(); renderCart(); closeAll();
  showToast("Order placed successfully! 🎉");
  e.target.reset();
};
renderProducts(); updateCounts();
