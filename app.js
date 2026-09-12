const defaultProducts=[
{id:1,name:"PlayStation 5 Controller",cat:"ps",price:3499,icon:"🎮"},{id:2,name:"Gaming Headset",cat:"pc",price:1299,icon:"🎧"},
{id:3,name:"Xbox Wireless Controller",cat:"xbox",price:2799,icon:"🕹️"},{id:4,name:"Mechanical Keyboard",cat:"pc",price:1899,icon:"⌨️"},
{id:5,name:"Gaming Mouse",cat:"pc",price:899,icon:"🖱️"},{id:6,name:"PlayStation Gift Card",cat:"ps",price:500,icon:"💳"},
{id:7,name:"Xbox Gift Card",cat:"xbox",price:500,icon:"💚"},{id:8,name:"RGB Desk Setup",cat:"pc",price:2399,icon:"✨"}];
function getProducts(){return JSON.parse(localStorage.getItem("gn_products")||"null")||defaultProducts}
function money(n){return new Intl.NumberFormat("ar-EG").format(n)}
let cart=JSON.parse(localStorage.getItem("gn_cart")||"[]");
function renderProducts(cat="all"){let ps=getProducts();document.getElementById("products").innerHTML=ps.filter(p=>cat==="all"||p.cat===cat).map(p=>`<article class="product"><div class="pimg">${p.icon}</div><div class="pbody"><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><b>${money(p.price)} ج.م</b><button class="primary buy" onclick="add(${p.id})">أضف للسلة</button></div></article>`).join("")}
function add(id){let p=getProducts().find(x=>x.id===id);cart.push(p);localStorage.setItem("gn_cart",JSON.stringify(cart));updateCount();toast("تمت الإضافة 🛒")}
function updateCount(){document.getElementById("count").textContent=cart.length}
function openModal(id){document.getElementById(id).classList.add("show")}function closeModal(id){document.getElementById(id).classList.remove("show")}
function switchModal(a,b){closeModal(a);openModal(b)}
function openCart(){let box=document.getElementById("cartItems");box.innerHTML=cart.length?cart.map((p,i)=>`<div class="cartrow"><span>${p.icon} ${p.name}</span><span>${money(p.price)} <button onclick="cart.splice(${i},1);localStorage.setItem('gn_cart',JSON.stringify(cart));openCart()">حذف</button></span></div>`).join(""):"<p>السلة فارغة.</p>";document.getElementById("total").textContent=money(cart.reduce((s,p)=>s+p.price,0));updateCount();openModal("cart")}
function placeOrder(){if(!cart.length)return toast("السلة فارغة");let u=JSON.parse(localStorage.getItem("gn_user")||"null");if(!u){closeModal("cart");openModal("login");return}
let orders=JSON.parse(localStorage.getItem("gn_orders")||"[]");orders.push({id:"GN-"+Date.now().toString().slice(-6),email:u.email,name:u.name,items:cart,total:cart.reduce((s,p)=>s+p.price,0),status:"جديد",date:new Date().toLocaleString("ar-EG")});localStorage.setItem("gn_orders",JSON.stringify(orders));cart=[];localStorage.setItem("gn_cart","[]");closeModal("cart");toast("تم تسجيل الطلب ✅")}
document.getElementById("signupForm").onsubmit=e=>{e.preventDefault();let users=JSON.parse(localStorage.getItem("gn_users")||"[]");if(users.some(u=>u.email===semail.value))return toast("الإيميل مستخدم");let u={name:sname.value,email:semail.value,pass:spass.value,date:new Date().toLocaleDateString("ar-EG")};users.push(u);localStorage.setItem("gn_users",JSON.stringify(users));localStorage.setItem("gn_user",JSON.stringify(u));closeModal("signup");toast("تم إنشاء الحساب")}
document.getElementById("loginForm").onsubmit=e=>{e.preventDefault();let users=JSON.parse(localStorage.getItem("gn_users")||"[]");let u=users.find(x=>x.email===lemail.value&&x.pass===lpass.value);if(u){localStorage.setItem("gn_user",JSON.stringify(u));closeModal("login");toast("أهلًا "+u.name)}else toast("بيانات غير صحيحة")}
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.className="show";setTimeout(()=>x.className="",2300)}
document.getElementById("filters").innerHTML=["all","ps","xbox","pc"].map((x,i)=>`<button class="filter ${i===0?"active":""}" onclick="filter(this,'${x}')">${x==="all"?"الكل":x.toUpperCase()}</button>`).join("");
function filter(btn,cat){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderProducts(cat)}
renderProducts();updateCount();