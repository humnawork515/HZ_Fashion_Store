const products = [
 {id:1,name:"Noor Printed Lawn Suit",category:"lawn",label:"NEW ARRIVAL",price:4890,oldPrice:5490,image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",description:"A graceful printed lawn look for sunlit days. Fabric and availability details can be customized."},
 {id:2,name:"Gulnaar Embroidered Set",category:"women",label:"BESTSELLER",price:7250,oldPrice:null,image:"https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=85",description:"An elegant statement set with delicate detail and a timeless feel."},
 {id:3,name:"Sage Everyday Kurta",category:"men",label:"JUST IN",price:3990,oldPrice:null,image:"https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=85",description:"A versatile men's kurta-inspired look for smart everyday dressing."},
 {id:4,name:"Zari Statement Earrings",category:"accessories",label:"LIMITED EDITION",price:1850,oldPrice:2200,image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85",description:"A refined finishing touch for festive and everyday outfits."},
 {id:5,name:"Meher Unstitched Lawn",category:"lawn",label:"NEW ARRIVAL",price:5650,oldPrice:null,image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85",description:"A fresh unstitched edit with a soft, easy-to-style palette."},
 {id:6,name:"Ivory Occasion Ensemble",category:"women",label:"HZ EDIT",price:8990,oldPrice:null,image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",description:"A polished occasion look for celebrations and special gatherings."},
 {id:7,name:"Classic Men's Waistcoat",category:"men",label:"TIMELESS",price:6490,oldPrice:null,image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",description:"A classic layering piece to elevate traditional dressing."},
 {id:8,name:"Everyday Mini Tote",category:"accessories",label:"CUSTOMER FAVOURITE",price:3200,oldPrice:null,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",description:"A versatile accessory with a clean, understated silhouette."}
];
const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
const getStore = key => { try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return[]} };
let cart = getStore("hz_cart"), wishlist = getStore("hz_wishlist"), activeFilter="all", searchTerm="";
const grid=document.getElementById("productGrid"), cartDrawer=document.getElementById("cartDrawer"), wishlistDrawer=document.getElementById("wishlistDrawer"), backdrop=document.getElementById("drawerBackdrop");
const productById=id=>products.find(p=>p.id===Number(id));
const save=()=>{localStorage.setItem("hz_cart",JSON.stringify(cart));localStorage.setItem("hz_wishlist",JSON.stringify(wishlist));updateCounts();};
const toast=(message)=>{document.getElementById("toastMessage").textContent=message;if(window.bootstrap){bootstrap.Toast.getOrCreateInstance(document.getElementById("hzToast"),{delay:2200}).show();}};
function renderProducts(){
 const shown=products.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(`${p.name} ${p.category}`).toLowerCase().includes(searchTerm.toLowerCase()));
 grid.innerHTML=shown.map(p=>`<div class="col-6 col-lg-3"><article class="product-card">
  <div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.label}</span>
  <button class="product-wish ${wishlist.includes(p.id)?"active":""}" data-wish="${p.id}" aria-label="${wishlist.includes(p.id)?"Remove from":"Add to"} wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button></div>
  <div class="product-info"><div class="product-category">${p.category}</div><h3 class="product-title">${p.name}</h3><div class="product-price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:""}</div>
  <div class="product-actions"><button class="add-button" data-add="${p.id}">Add to bag +</button><button class="quick-view" data-view="${p.id}" aria-label="View ${p.name}">↗</button></div></div></article></div>`).join("");
 document.getElementById("noResults").classList.toggle("d-none",shown.length!==0);
}
function updateCounts(){
 document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("wishlistCount").textContent=wishlist.length;
 document.getElementById("cartHeadingCount").textContent=`(${cart.reduce((s,i)=>s+i.qty,0)})`;
 document.getElementById("wishlistHeadingCount").textContent=`(${wishlist.length})`;
 renderProducts();
}
function addToCart(id){
 const p=productById(id);if(!p)return;
 const found=cart.find(i=>i.id===p.id);if(found)found.qty++;else cart.push({id:p.id,qty:1});
 save();renderCart();toast(`${p.name} added to your bag.`);
}
function toggleWishlist(id){
 id=Number(id);const p=productById(id);if(!p)return;
 if(wishlist.includes(id)){wishlist=wishlist.filter(x=>x!==id);toast("Removed from your wishlist.");}
 else{wishlist.push(id);toast("Saved to your wishlist.");}
 save();renderWishlist();
}
function renderCart(){
 const host=document.getElementById("cartItems");
 if(!cart.length){host.innerHTML='<div class="drawer-empty"><span>♧</span>Your bag is waiting for something lovely.<br><br><a href="#featured" class="text-link" data-close-drawer>Explore the collection ↗</a></div>';}
 else host.innerHTML=cart.map(i=>{const p=productById(i.id);if(!p)return"";return `<div class="drawer-product"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.category}</p><strong>${money(p.price)}</strong><div class="drawer-product-actions"><button class="qty-btn" data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button class="qty-btn" data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button><button class="remove-btn" data-remove="${p.id}">Remove</button></div></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("");
 document.getElementById("cartSubtotal").textContent=money(cart.reduce((s,i)=>{const p=productById(i.id);return s+(p?p.price*i.qty:0)},0));
}
function renderWishlist(){
 const host=document.getElementById("wishlistItems");
 if(!wishlist.length){host.innerHTML='<div class="drawer-empty"><span>♡</span>Your wishlist is empty.<br><br>Save the pieces you love.</div>';return;}
 host.innerHTML=wishlist.map(id=>{const p=productById(id);if(!p)return"";return `<div class="drawer-product"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.category}</p><strong>${money(p.price)}</strong><div class="drawer-product-actions"><button class="add-button" data-add="${p.id}">Add to bag +</button><button class="remove-btn" data-unwish="${p.id}">Remove</button></div></div></div>`}).join("");
}
function openDrawer(which){
 closeDrawers();const drawer=which==="cart"?cartDrawer:wishlistDrawer;drawer.classList.add("show");drawer.setAttribute("aria-hidden","false");backdrop.classList.add("show");document.body.style.overflow="hidden";
}
function closeDrawers(){[cartDrawer,wishlistDrawer].forEach(d=>{d.classList.remove("show");d.setAttribute("aria-hidden","true")});backdrop.classList.remove("show");document.body.style.overflow="";}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){addToCart(add.dataset.add);return;}
 const wish=e.target.closest("[data-wish]");if(wish){toggleWishlist(wish.dataset.wish);return;}
 const unwish=e.target.closest("[data-unwish]");if(unwish){toggleWishlist(unwish.dataset.unwish);return;}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(i=>i.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id);save();renderCart();}return;}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));save();renderCart();return;}
 const close=e.target.closest("[data-close-drawer]");if(close){closeDrawers();return;}
 const view=e.target.closest("[data-view]");if(view){showQuickView(view.dataset.view);return;}
 const filter=e.target.closest("[data-filter]");if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();return;}
 const category=e.target.closest("[data-category-link]");if(category){activeFilter=category.dataset.categoryLink;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts();}
});
document.getElementById("cartOpen").addEventListener("click",()=>{renderCart();openDrawer("cart")});
document.getElementById("wishlistOpen").addEventListener("click",()=>{renderWishlist();openDrawer("wishlist")});
document.querySelectorAll("[data-close-drawer]").forEach(b=>b.addEventListener("click",closeDrawers));
backdrop.addEventListener("click",closeDrawers);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawers()});
document.getElementById("searchToggle").addEventListener("click",()=>{document.getElementById("searchPanel").classList.toggle("show");document.getElementById("searchInput").focus()});
function runSearch(){searchTerm=document.getElementById("searchInput").value.trim();activeFilter="all";document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderProducts();document.getElementById("featured").scrollIntoView({behavior:"smooth"});}
document.getElementById("searchSubmit").addEventListener("click",runSearch);
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")runSearch()});
document.getElementById("showAllProducts").addEventListener("click",()=>{activeFilter="all";searchTerm="";document.getElementById("searchInput").value="";document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderProducts()});
document.getElementById("checkoutButton").addEventListener("click",()=>toast("Checkout preview only. Connect a secure payment provider before accepting orders."));
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Thank you for joining the HZ list!");e.target.reset()});
function showQuickView(id){
 const p=productById(id);if(!p)return;
 const old=document.getElementById("quickViewModal");if(old)old.remove();
 const modal=document.createElement("div");modal.className="modal fade quick-view-modal";modal.id="quickViewModal";modal.tabIndex=-1;
 modal.innerHTML=`<div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-body"><div class="row g-4"><div class="col-md-6"><img src="${p.image}" alt="${p.name}"></div><div class="col-md-6"><p class="eyebrow">${p.category}</p><h2 style="font-family:var(--serif);font-size:34px">${p.name}</h2><h4 class="mt-3">${money(p.price)}</h4><p class="mt-3" style="line-height:1.9;color:#827a73;font-size:12px">${p.description}</p><button class="btn-hz btn-hz-dark mt-3" data-add="${p.id}" data-bs-dismiss="modal">Add to bag +</button><button class="btn btn-link text-dark d-block mt-3 p-0" data-bs-dismiss="modal">Continue browsing</button></div></div></div></div></div>`;
 document.body.appendChild(modal);const instance=new bootstrap.Modal(modal);instance.show();modal.addEventListener("hidden.bs.modal",()=>modal.remove());
}
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCounts();renderCart();renderWishlist();
