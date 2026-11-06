# VANTÉ — setup (about 15 minutes)

Files: `index.html` + `app.js` (store), `admin.html` (separate admin), `firebase.js` (config), `style.css`, `firestore.rules`, `storage.rules`.

1. **Firebase project**: console.firebase.google.com → create project → add a Web app → paste its config into `firebase.js`.
2. **Enable**: Authentication (Email/Password), Firestore Database, Storage.
3. **Rules**: paste `firestore.rules` into Firestore → Rules, and `storage.rules` into Storage → Rules. Publish both.
4. **Create your admin**: Authentication → Users → Add user (your email + a strong password). Copy that user's UID.
   Firestore → start collection `admins` → Document ID = the UID → add any field (e.g. `role: "owner"`).
   Only this document grants admin access. Customers can never create it (rules block writes).
5. **Admin panel**: open `admin.html`, sign in, go to Settings, set bKash/Nagad numbers and delivery charge, then add products (or load the demo products and edit them).
6. **Host**: push the folder to a GitHub repo → Settings → Pages → deploy from main. Then in Firebase → Authentication → Settings → Authorized domains, add `yourname.github.io`.

## Good to know
- Stock is managed by you in the admin panel; it does not drop automatically when an order arrives. The store blocks orders above the listed stock.
- Prices in an order are sent from the browser. Always check the order total in the admin panel before verifying payment.
- Payments are never auto-verified. Only you can set a payment to Verified.
- Customers track orders with the Order ID and their phone number.
