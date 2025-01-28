// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK for Firestore Emulator
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"; // Firestore Emulator Host
admin.initializeApp({
  projectId: "bizkifyapp", // Replace with your Firebase project ID
});

const db = admin.firestore();

// Fetch and Print Document
async function fetchDocument(collectionName, documentId) {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();

    if (doc.exists) {
      console.log(`Document data for ${collectionName}/${documentId}:`, doc.data());
    } else {
      console.log(`No document found for ${collectionName}/${documentId}`);
    }
  } catch (e) {
    console.error("❌ Error fetching document:", e.message);
  }
}

// Fetch a Sample Document (Replace with your collection/document ID)
fetchDocument("vendors", "vendor001");
