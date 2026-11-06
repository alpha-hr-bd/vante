<div align="center">

# VANTÉ

**Your Scent. Your Identity.**

A premium perfume store for Bangladesh, built with plain HTML, CSS and JavaScript.
Hosted free on GitHub Pages, powered by Firebase.

</div>

---

## What's inside

| Part | What it does |
|---|---|
| **Storefront** | Hero, featured perfumes, new arrivals, best sellers, about and contact |
| **Cart and checkout** | Local-storage cart, delivery charge, 64 districts, order summary |
| **Payments** | bKash, Nagad and Cash on Delivery, with manual verification by you |
| **Order tracking** | Customers look up an order with Order ID and phone number |
| **Admin panel** | Separate login, product and order management, payment verification, settings |

## Project files

```
vante/
├── index.html        Customer store
├── app.js            Store logic (cart, checkout, tracking)
├── admin.html        Admin panel (separate page, noindex)
├── firebase.js       Your Firebase config and shared helpers
├── style.css         Brand styling
├── firestore.rules   Database security rules
├── storage.rules     Image upload security rules
└── README.md
```

---

## Setup (about 15 minutes)

### 1. Create the Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project.
2. Add a **Web app** and copy its config.
3. Paste the config into `firebase.js`, replacing the `YOUR_...` values.

> The config values are public identifiers, not secrets. Your data is protected by the security rules in step 3.

### 2. Turn on the services
- **Authentication** → Sign-in method → enable **Email/Password**
- **Firestore Database** → Create database (production mode)
- **Storage** → Get started

### 3. Publish the security rules
- Firestore → **Rules** → paste `firestore.rules` → **Publish**
- Storage → **Rules** → paste `storage.rules` → **Publish**

### 4. Create your admin account
1. Authentication → **Users** → **Add user** with your email and a strong password.
2. Copy that user's **UID**.
3. Firestore → **Start collection** named `admins`.
4. Set **Document ID** to your UID and add any field, for example `role` = `owner`.

Only a user with a document in `admins` can use the admin panel. Customers cannot create one, because the rules block it.

### 5. Set up your store
Open `admin.html`, sign in, then:
1. **Settings**: enter your bKash number, Nagad number, delivery charge and contact phone.
2. **Products**: add your perfumes and upload photos. You can also click **Load 4 demo products** to see the store filled, then edit or delete them.

### 6. Publish the website
1. Push the `vante` folder to a GitHub repository.
2. Repository → **Settings** → **Pages** → deploy from the `main` branch.
3. In Firebase → Authentication → **Settings** → **Authorized domains**, add `yourname.github.io`.

Your store is live at `https://yourname.github.io/your-repo/` and the admin panel at `.../admin.html`.

---

## Daily use

**When an order arrives**
1. Open **Orders** in the admin panel.
2. For bKash or Nagad, check the Transaction ID in your merchant account.
3. Match the amount, then click **Verify payment** (or **Reject**).
4. Move the order through Confirmed, Processing, Shipped and Delivered.

**Payment statuses:** Pending Verification, Verified, Rejected, Cash on Delivery
**Order statuses:** Pending, Confirmed, Processing, Shipped, Delivered, Cancelled

---

## Good to know

- **Payments are never auto-verified.** A submitted Transaction ID only means the customer says they paid. Only you can mark a payment Verified.
- **The store never asks for a PIN or OTP.** Keep it that way.
- **Check totals before verifying.** Order prices are calculated in the customer's browser, so compare the amount paid with the order total.
- **Stock is manual.** It does not drop automatically after an order. Update it in **Products**. The store blocks orders above the listed stock.
- **Tracking privacy.** Order IDs are long and random, and tracking also needs the phone number.
- **Images** must be under 2 MB (JPG, PNG or WebP).

## Troubleshooting

| Problem | Fix |
|---|---|
| Store shows "Nothing here yet" | Add products in the admin panel, and tick **Featured** or **Best seller** |
| Admin says "not an admin" | Check the `admins` document ID matches your user's UID exactly |
| "Missing or insufficient permissions" | Re-publish both rules files |
| Sign-in fails on GitHub Pages | Add your `github.io` domain to Firebase authorized domains |
| Image upload fails | Check the file is an image under 2 MB and `storage.rules` is published |

---

<div align="center">VANTÉ · Dhaka, Bangladesh</div>
