// Import Firebase Admin SDK and Firebase Client SDK
const admin = require("firebase-admin");
const firebase = require("firebase/compat/app"); // Firebase Client SDK
require("firebase/compat/auth"); // Firebase Authentication
require("firebase/compat/firestore"); // Firestore SDK

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

// 🔹 Check if Document Exists
async function documentExists(collection, docId) {
  const docRef = db.collection(collection).doc(docId);
  const docSnapshot = await docRef.get();
  return docSnapshot.exists;
}

// 🔹 CRUD Functions for Users
async function createUser(userId, userData) {
  const exists = await documentExists("users", userId);
  if (exists) {
    console.log(`⚠ User ${userId} already exists! Skipping creation.`);
    return;
  }
  await db.collection("users").doc(userId).set(userData);
  console.log(`✅ User Created: ${userId}`);
}

async function readUser(userId) {
  const docRef = db.collection("users").doc(userId);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log(`⚠ User ${userId} not found.`);
    return;
  }
  console.log(`✅ User Data:`, doc.data());
}

async function updateUser(userId, updatedFields) {
  const exists = await documentExists("users", userId);
  if (!exists) {
    console.log(`⚠ User ${userId} not found! Skipping update.`);
    return;
  }
  await db.collection("users").doc(userId).update(updatedFields);
  console.log(`✅ User Updated: ${userId}`);
}

async function deleteUser(userId) {
  const exists = await documentExists("users", userId);
  if (!exists) {
    console.log(`⚠ User ${userId} not found! Skipping deletion.`);
    return;
  }
  await db.collection("users").doc(userId).delete();
  console.log(`✅ User Deleted: ${userId}`);
}

// 🔹 CRUD Functions for Vendors
async function createVendor(vendorId, vendorData) {
  const exists = await documentExists("vendors", vendorId);
  if (exists) {
    console.log(`⚠ Vendor ${vendorId} already exists! Skipping creation.`);
    return;
  }
  await db.collection("vendors").doc(vendorId).set(vendorData);
  console.log(`✅ Vendor Created: ${vendorId}`);
}

async function readVendor(vendorId) {
  const docRef = db.collection("vendors").doc(vendorId);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log(`⚠ Vendor ${vendorId} not found.`);
    return;
  }
  console.log(`✅ Vendor Data:`, doc.data());
}

async function updateVendor(vendorId, updatedFields) {
  const exists = await documentExists("vendors", vendorId);
  if (!exists) {
    console.log(`⚠ Vendor ${vendorId} not found! Skipping update.`);
    return;
  }
  await db.collection("vendors").doc(vendorId).update(updatedFields);
  console.log(`✅ Vendor Updated: ${vendorId}`);
}

async function deleteVendor(vendorId) {
  const exists = await documentExists("vendors", vendorId);
  if (!exists) {
    console.log(`⚠ Vendor ${vendorId} not found! Skipping deletion.`);
    return;
  }
  await db.collection("vendors").doc(vendorId).delete();
  console.log(`✅ Vendor Deleted: ${vendorId}`);
}

// 🔹 Perform CRUD Operations
async function testCRUDOperations() {
  try {
    console.log("🔥 Testing Firestore CRUD Operations...");

    // Sample Expense Data
    const expenseId = "expense002";
    const expense = {
      expense_id: expenseId,
      user_id: "UID_HERE", // Use UID instead of email
      vendor_id: "vendor002",
      amount: 500.0,
      category: "Travel",
      description: "Flight ticket",
      payment_status: "Paid",
      delivery_status: "Completed",
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
    };

    // Expense CRUD Operations
    console.log("🔹 CREATE: Adding a new expense...");
    if (await documentExists("expenses", expenseId)) {
      console.log(`⚠ Expense ${expenseId} already exists! Skipping creation.`);
    } else {
      await db.collection("expenses").doc(expenseId).set(expense);
      console.log("✅ Expense added successfully!");
    }

    console.log("🔹 READ: Fetching the expense...");
    const doc = await db.collection("expenses").doc(expenseId).get();
    if (doc.exists) {
      console.log("✅ Expense data:", doc.data());
    } else {
      console.log("❌ Expense not found!");
    }

    console.log("🔹 UPDATE: Updating the expense amount...");
    if (await documentExists("expenses", expenseId)) {
      await db.collection("expenses").doc(expenseId).update({
        amount: 600.0,
        updated_at: admin.firestore.Timestamp.now(),
      });
      console.log("✅ Expense updated successfully!");
    } else {
      console.log(`⚠ Expense ${expenseId} not found! Skipping update.`);
    }

    console.log("🔹 DELETE: Deleting the expense...");
    if (await documentExists("expenses", expenseId)) {
      await db.collection("expenses").doc(expenseId).delete();
      console.log("✅ Expense deleted successfully!");
    } else {
      console.log(`⚠ Expense ${expenseId} not found! Skipping deletion.`);
    }

    // User CRUD Operations
    const userId = "UID_HERE"; // Use UID instead of email
    const userData = {
      name: "Hamad Aziz Khan",
      email: "hamadazizkhan@hotmail.com",
      profile_picture: "https://example.com/profile.jpg",
      company: { name: "Bizkify Inc.", industry: "Tech", employees: 10 },
      location: { country: "Pakistan", state: "Punjab", city: "Lahore" },
      preferred_currency: "PKR",
      created_at: admin.firestore.Timestamp.now(),
    };

    console.log("🔹 CREATE: Adding a new user...");
    await createUser(userId, userData);

    console.log("🔹 READ: Fetching the user...");
    await readUser(userId);

    console.log("🔹 UPDATE: Updating the user name...");
    await updateUser(userId, { name: "Hamad Khan" });

    console.log("🔹 DELETE: Deleting the user...");
    await deleteUser(userId);

    // Vendor CRUD Operations
    const vendorId = "vendor002";
    const vendorData = {
      vendor_id: vendorId,
      user_id: userId, // Use UID instead of email
      name: "ABC Supplies",
      contact_info: { email: "vendor001@example.com", phone: "123-456-7890" },
      address: "123 Vendor St, Cityville",
      transaction_count: 15,
      total_spent: 1500.5,
      rating: 4.5,
      created_at: admin.firestore.Timestamp.now(),
    };

    console.log("🔹 CREATE: Adding a new vendor...");
    await createVendor(vendorId, vendorData);

    console.log("🔹 READ: Fetching the vendor...");
    await readVendor(vendorId);

    console.log("🔹 UPDATE: Updating the vendor rating...");
    await updateVendor(vendorId, { rating: 5.0 });

    console.log("🔹 DELETE: Deleting the vendor...");
    await deleteVendor(vendorId);

    console.log("✅ All CRUD operations completed!");
  } catch (e) {
    console.error("❌ Error during CRUD operations:", e.message);
  }
}

// 🔹 Execute CRUD Testing
(async function initialize() {
  const { idToken, uid } = await authenticateUser(); // Authenticate user and get ID token and UID
  await testCRUDOperations(); // Test CRUD operations with UID
})();
