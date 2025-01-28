// Import Firebase Admin SDK and Firebase Client SDK
const admin = require("firebase-admin");
const firebase = require("firebase/compat/app"); // Correct import for Firebase App
require("firebase/compat/auth"); // Correct import for Firebase Authentication

// Firebase Client SDK Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa-nGlHMBKuHp5vOZlYEZyut1g65fGRNQ",
  authDomain: "bizkifyapp.firebaseapp.com",
  projectId: "bizkifyapp",
  storageBucket: "bizkifyapp.firebasestorage.app",
  messagingSenderId: "951814763342",
  appId: "1:951814763342:web:24e4bffa5f71208bd2241f",
  measurementId: "G-T5LGYEE9TZ",
};

// Initialize Firebase Client SDK
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Admin SDK for Firestore Emulator
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"; // Firestore Emulator Host
admin.initializeApp({
  projectId: "bizkifyapp", // Ensure this matches your Firebase project ID
});
const db = admin.firestore();

// 🔹 Authenticate User Using Firebase Client SDK
async function authenticateUser() {
  try {
    const email = "hamadazizkhan@hotmail.com";
    const password = "Hamadazizkhan1@9";

    // Sign in the user
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log(`✅ User authenticated: ${user.email}`);
    const idToken = await user.getIdToken();
    console.log("✅ ID Token retrieved");
    return { idToken, uid: user.uid }; // Return the user's ID token and UID
  } catch (e) {
    console.error("❌ Error authenticating user:", e.message);
    process.exit(1); // Exit the script if authentication fails
  }
}

// 🔹 Function to Add Firestore Schema
async function setupFirestore({ idToken, uid }) {
  try {
    console.log("🔥 Setting up Firestore schema in Emulator...");

    // Add Users
    const users = [
      {
        user_id: uid, // Use UID instead of email
        name: "Hamad Aziz Khan",
        email: "hamadazizkhan@hotmail.com",
        profile_picture: "https://example.com/profile.jpg",
        company: { name: "Bizkify Inc.", industry: "Tech", employees: 10 },
        location: { country: "Pakistan", state: "Punjab", city: "Lahore" },
        preferred_currency: "PKR",
        budget_cycle: "Monthly",
        created_at: admin.firestore.Timestamp.now(),
      },
    ];

    for (const user of users) {
      await db.collection("users").doc(user.user_id).set(user);
      console.log(`✅ Firestore User Added: ${user.email}`);
    }

    // Add Expenses
    const expenses = [
      {
        expense_id: "expense001",
        user_id: uid, // Use UID instead of email
        vendor_id: "vendor001",
        amount: 250.75,
        category: "Office Supplies",
        description: "Purchased office chairs",
        payment_status: "Paid",
        delivery_status: "Delivered",
        receipt_image_url: "https://example.com/receipt.jpg",
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now(),
      },
    ];

    for (const expense of expenses) {
      await db.collection("expenses").doc(expense.expense_id).set(expense);
      console.log(`✅ Firestore Expense Added: ${expense.expense_id}`);
    }

    // Add Vendors
    const vendors = [
      {
        vendor_id: "vendor001",
        user_id: uid, // Use UID instead of email
        name: "ABC Supplies",
        contact_info: { email: "vendor001@example.com", phone: "123-456-7890" },
        address: "123 Vendor St, Cityville",
        transaction_count: 15,
        total_spent: 1500.5,
        rating: 4.5,
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now(),
      },
    ];

    for (const vendor of vendors) {
      await db.collection("vendors").doc(vendor.vendor_id).set(vendor);
      console.log(`✅ Firestore Vendor Added: ${vendor.vendor_id}`);
    }

    // Add Budgets
    const budgets = [
      {
        budget_id: "budget001",
        user_id: uid, // Use UID instead of email
        categories: ["Office Supplies", "Travel"],
        amount: 5000.0,
        start_date: admin.firestore.Timestamp.fromDate(new Date("2023-01-01")),
        end_date: admin.firestore.Timestamp.fromDate(new Date("2023-12-31")),
        remaining_amount: 2500.0,
        alert_threshold: 80.0,
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now(),
      },
    ];

    for (const budget of budgets) {
      await db.collection("budgets").doc(budget.budget_id).set(budget);
      console.log(`✅ Firestore Budget Added: ${budget.budget_id}`);
    }

    // Add Reports
    const reports = [
      {
        report_id: "report001",
        user_id: uid, // Use UID instead of email
        report_type: "Expense Report",
        generated_data: "https://example.com/report.pdf",
        created_at: admin.firestore.Timestamp.now(),
      },
    ];

    for (const report of reports) {
      await db.collection("reports").doc(report.report_id).set(report);
      console.log(`✅ Firestore Report Added: ${report.report_id}`);
    }

    // Add Analytics
    const analytics = [
      {
        analytics_id: "analytics001",
        user_id: uid, // Use UID instead of email
        total_expenses: 1500.0,
        top_categories: ["Office Supplies", "Travel"],
        top_vendors: ["ABC Supplies"],
        last_updated: admin.firestore.Timestamp.now(),
      },
    ];

    for (const analytic of analytics) {
      await db.collection("analytics").doc(analytic.analytics_id).set(analytic);
      console.log(`✅ Firestore Analytics Added: ${analytic.analytics_id}`);
    }

    console.log("✅ Firestore schema setup complete.");
  } catch (e) {
    console.error("❌ Error setting up Firestore schema:", e.message);
  }
}

// 🔹 Execute Functions
(async function initialize() {
  const { idToken, uid } = await authenticateUser(); // Authenticate user and get ID token and UID
  await setupFirestore({ idToken, uid }); // Set up Firestore schema using the authenticated user
})();
