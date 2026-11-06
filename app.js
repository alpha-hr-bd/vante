import { db, $, money, esc, price, bottle } from "./firebase.js";
import { collection, getDocs, getDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const DISTRICTS = "Bagerhat,Bandarban,Barguna,Barishal,Bhola,Bogura,Brahmanbaria,Chandpur,Chapainawabganj,Chattogram,Chuadanga,Cumilla,Cox's Bazar,Dhaka,Dinajpur,Faridpur,Feni,Gaibandha,Gazipur,Gopalganj,Habiganj,Jamalpur,Jashore,Jhalokati,Jhenaidah,Joypurhat,Khagrachhari,Khulna,Kishoreganj,Kurigram,Kushtia,Lakshmipur,Lalmonirhat,Madaripur,Magura,Manikganj,Meherpur,Moulvibazar,Munshiganj,Mymensingh,Naogaon,Narail,Narayanganj,Narsingdi,Natore,Netrokona,Nilphamari,Noakhali,Pabna,Panchagarh,Patuakhali,Pirojpur,Rajbari,Rajshahi,Rangamati,Rangpur,Satkhira,Shariatpur,Sherpur,Sirajganj,Sunamganj,Sylhet,Tangail,Thakurgaon".split(",");
let products = [], S = { bkash: "", nagad: "", delivery: 100, phone: "" };
let cart = JSON.parse(localStorage.getItem("vante-cart") || "[]");
const save = () => { localStorage.setItem("vante-cart", JSON.stringify(cart)); render(); };
const byId = id => products.find(p => p.id === id);
const lines = () => cart.map(c => ({ p: byId(c.id), qty: c.qty })).filter(l => l.p);
const sub = () => lines().reduce((s, l) => s + price(l.p) * l.qty, 0);
const ship = () => (lines().length ? Number(S.delivery) || 0 : 0);
const art = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : bottle;

function card(p) {
  const out = !(p.stock > 0), sale = price(p) < p.price;
  return `<article class="card"><div class="ph">${art(p)}</div><div class="cb">
  <span class="meta">${esc(p.fragrance)} · ${esc(p.size)}</span><h3>${esc(p.name)}</h3><p class="desc">${esc(p.description)}</p>
  <div class="pr">${money(price(p))}${sale ? `<s>${money(p.price)}</s>` : ""}</div>
  <span class="stock ${out ? "out" : "in"}">${out ? "Out of stock" : p.stock <= 5 ? `Only ${p.stock} left` : "In stock"}</span>
  <div class="row"><button class="btn ghost sm" data-act="view" data-id="${p.id}">View details</button>
  <button class="btn sm" data-act="add" data-id="${p.id}" ${out ? "disabled" : ""}>Add to cart</button></div></div></article>`;
}
function fill(el, list) { $(el).innerHTML = list.length ? list.map(card).join("") : `<p class="empty">Nothing here yet. Check back soon.</p>`; }
function render() {
  fill("#featured", products.filter(p => p.featured));
  fill("#newest", [...products].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 4));
  fill("#best", products.filter(p => p.bestseller));
  $("#count").textContent = cart.reduce((s, c) => s + c.qty, 0);
  drawer();
}
function drawer() {
  const L = lines();
  $("#drawer").innerHTML = `<button class="x" data-act="closecart" aria-label="Close cart">×</button><h2>Your cart</h2><div style="flex:1;overflow:auto">
  ${L.length ? L.map(l => `<div class="ci"><div><strong>${esc(l.p.name)}</strong><br><small>${esc(l.p.size)}</small>
  <div class="qty"><button data-act="dec" data-id="${l.p.id}" aria-label="Decrease">−</button>${l.qty}<button data-act="inc" data-id="${l.p.id}" aria-label="Increase">+</button></div></div>
  <div style="text-align:right">${money(price(l.p) * l.qty)}<br><button class="cartbtn" style="margin-top:8px;padding:2px 8px" data-act="rm" data-id="${l.p.id}">Remove</button></div></div>`).join("") : `<p class="empty">Your cart is empty.</p>`}</div>
  <div class="tot"><span>Subtotal</span><span>${money(sub())}</span></div><div class="tot"><span>Delivery</span><span>${money(ship())}</span></div>
  <div class="tot big"><span>Total</span><span>${money(sub() + ship())}</span></div>
  <button class="btn" style="margin-top:16px" data-act="checkout" ${L.length ? "" : "disabled"}>Checkout</button>`;
}
const openCart = o => $("#drawer").classList.toggle("open", o);
const dlg = html => { $("#m").innerHTML = `<button class="x" data-act="close" aria-label="Close">×</button>` + html; if (!$("#m").open) $("#m").showModal(); };

function detail(p) {
  dlg(`<div class="ph" style="aspect-ratio:16/10;margin-bottom:16px">${art(p)}</div><span class="meta">${esc(p.fragrance)} · ${esc(p.size)}</span>
  <h2>${esc(p.name)}</h2><p class="desc" style="margin:10px 0">${esc(p.description)}</p><div class="pr">${money(price(p))}${price(p) < p.price ? `<s>${money(p.price)}</s>` : ""}</div>
  <div class="row"><button class="btn" data-act="add" data-id="${p.id}" ${p.stock > 0 ? "" : "disabled"}>${p.stock > 0 ? "Add to cart" : "Out of stock"}</button></div>`);
}
function checkout() {
  openCart(false);
  dlg(`<h2>Checkout</h2><form id="f" novalidate>
  <label>Full name<input name="name" required autocomplete="name"></label>
  <label>Phone number<input name="phone" required inputmode="tel" placeholder="01XXXXXXXXX" autocomplete="tel"></label>
  <label>District<select name="district" required><option value="">Select district</option>${DISTRICTS.map(d => `<option>${esc(d)}</option>`).join("")}</select></label>
  <label>Full delivery address<textarea name="address" rows="3" required></textarea></label>
  <label>Email (optional)<input name="email" type="email" autocomplete="email"></label>
  <label>Payment method</label><div class="pay"><label><input type="radio" name="method" value="bKash" checked>bKash</label><label><input type="radio" name="method" value="Nagad">Nagad</label><label><input type="radio" name="method" value="Cash on Delivery">Cash on Delivery</label></div>
  <div id="payBox"></div>
  <h3 style="margin-top:22px">Order summary</h3>${lines().map(l => `<div class="tot"><span>${esc(l.p.name)} × ${l.qty}</span><span>${money(price(l.p) * l.qty)}</span></div>`).join("")}
  <div class="tot"><span>Delivery</span><span>${money(ship())}</span></div><div class="tot big"><span>Total</span><span>${money(sub() + ship())}</span></div>
  <p class="err" id="err" role="alert"></p><button class="btn" style="width:100%;margin-top:14px" id="sbm">Place order</button></form>`);
  const f = $("#f"), pay = () => {
    const m = f.method.value, n = m === "bKash" ? S.bkash : S.nagad;
    $("#payBox").innerHTML = m === "Cash on Delivery" ? `<div class="note">Pay in cash when your order arrives.</div>` :
      `<div class="note">${n ? `1. Open ${m} and choose <b>Send Money</b>.<br>2. Send <b>${money(sub() + ship())}</b> to <b>${esc(n)}</b>.<br>3. Enter the Transaction ID and your sender number below.<br>We never ask for your PIN or OTP. Your payment is verified by our team after you submit.` : `${m} is not available right now. Please choose another method.`}</div>
      <label>Transaction ID<input name="txn" autocomplete="off"></label><label>Sender ${m} number<input name="sender" inputmode="tel" placeholder="01XXXXXXXXX"></label>`;
  };
  f.addEventListener("change", pay); pay();
  f.addEventListener("submit", submit);
}
async function submit(e) {
  e.preventDefault();
  const f = e.target, v = Object.fromEntries(new FormData(f)), err = t => ($("#err").textContent = t), ph = /^01[3-9]\d{8}$/;
  const mobile = v.method !== "Cash on Delivery";
  if (!v.name.trim() || !v.district || !v.address.trim()) return err("Enter your name, district and delivery address.");
  if (!ph.test(v.phone.trim())) return err("Enter a valid 11-digit mobile number, like 01XXXXXXXXX.");
  if (mobile) {
    if (!(v.method === "bKash" ? S.bkash : S.nagad)) return err("This payment method is unavailable. Choose another.");
    if (!v.txn?.trim()) return err("Enter your Transaction ID.");
    if (!ph.test((v.sender || "").trim())) return err("Enter the sender number you paid from.");
  }
  const L = lines(); if (!L.length) return err("Your cart is empty.");
  const bad = L.find(l => l.qty > l.p.stock); if (bad) return err(`Only ${bad.p.stock} of ${bad.p.name} left. Update your cart.`);
  const id = "VNT-" + Array.from(crypto.getRandomValues(new Uint8Array(10)), b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
  const order = { orderId: id, name: v.name.trim(), phone: v.phone.trim(), district: v.district, address: v.address.trim(), email: (v.email || "").trim(),
    items: L.map(l => ({ id: l.p.id, name: l.p.name, size: l.p.size, price: price(l.p), qty: l.qty })), subtotal: sub(), delivery: ship(), total: sub() + ship(),
    method: v.method, txnId: mobile ? v.txn.trim() : "", senderPhone: mobile ? v.sender.trim() : "",
    paymentStatus: mobile ? "Pending Verification" : "Cash on Delivery", status: "Pending", createdAt: serverTimestamp() };
  $("#sbm").disabled = true; $("#sbm").textContent = "Placing order…";
  try { await setDoc(doc(db, "orders", id), order); } catch (x) { console.error(x); $("#sbm").disabled = false; $("#sbm").textContent = "Place order"; return err("We couldn't submit your order. Check your connection and try again."); }
  cart = []; save();
  dlg(`<h2>Order received</h2><p style="margin:12px 0">Thank you, ${esc(order.name)}. Your order ID is</p><p class="logo" style="letter-spacing:.1em">${id}</p>
  <div class="note">${mobile ? "Your payment is <b>pending verification</b>. We will confirm it after checking your Transaction ID." : "You will pay in cash on delivery."}<br>Save your order ID. Use it with your phone number to track the order.</div>
  <div class="row"><button class="btn" data-act="track">Track order</button></div>`);
}
function track() {
  openCart(false);
  dlg(`<h2>Track your order</h2><form id="t"><label>Order ID<input name="id" placeholder="VNT-XXXXXXXXXX" required></label><label>Phone number<input name="ph" inputmode="tel" required></label>
  <button class="btn" style="margin-top:16px;width:100%">Find order</button></form><div id="tr"></div>`);
  $("#t").onsubmit = async e => {
    e.preventDefault(); const id = e.target.id.value.trim().toUpperCase(), ph = e.target.ph.value.replace(/\D/g, "").slice(-10), out = $("#tr");
    out.innerHTML = `<p class="note">Searching…</p>`;
    try {
      const s = await getDoc(doc(db, "orders", id)), o = s.exists() ? s.data() : null;
      if (!o || o.phone.replace(/\D/g, "").slice(-10) !== ph) return (out.innerHTML = `<p class="err">No order matches that ID and phone number.</p>`);
      out.innerHTML = `<div style="margin-top:20px"><p><span class="badge">${esc(o.status)}</span> <span class="badge">${esc(o.paymentStatus)}</span></p>
      ${o.items.map(i => `<div class="tot"><span>${esc(i.name)} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
      <div class="tot"><span>Delivery</span><span>${money(o.delivery)}</span></div><div class="tot big"><span>Total</span><span>${money(o.total)}</span></div>
      <p class="sub" style="margin-top:10px">${esc(o.method)} · Deliver to ${esc(o.district)}</p></div>`;
    } catch (x) { out.innerHTML = `<p class="err">Could not load the order. Try again.</p>`; }
  };
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return; e.preventDefault();
  const id = b.dataset.id, p = byId(id), c = cart.find(x => x.id === id);
  ({ cart: () => openCart(true), closecart: () => openCart(false), close: () => $("#m").close(), checkout, track,
    view: () => p && detail(p),
    add: () => { if (!p) return; if (c) { if (c.qty < p.stock) c.qty++; } else cart.push({ id, qty: 1 }); save(); $("#m").open && $("#m").close(); openCart(true); },
    inc: () => { if (c && p && c.qty < p.stock) c.qty++; save(); },
    dec: () => { if (c && --c.qty < 1) cart = cart.filter(x => x !== c); save(); },
    rm: () => { cart = cart.filter(x => x.id !== id); save(); } })[b.dataset.act]?.();
});
$("#heroArt").innerHTML = bottle; $("#yr").textContent = new Date().getFullYear();
(async () => {
  try {
    const [ps, st] = await Promise.all([getDocs(collection(db, "products")), getDoc(doc(db, "settings", "store"))]);
    products = ps.docs.map(d => ({ id: d.id, ...d.data() })); if (st.exists()) S = { ...S, ...st.data() };
    if (S.phone) $("#cPhone").textContent = S.phone;
    cart = cart.filter(c => byId(c.id)).map(c => ({ ...c, qty: Math.min(c.qty, byId(c.id).stock || 1) }));
  } catch (x) { console.error(x); }
  render();
})();
