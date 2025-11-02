const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// 🔧 Load service account from Render environment variable
let serviceAccount = {};
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

  // 🔥 Convert escaped newline characters back to real newlines
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (error) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error.message);
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully!");
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error.message);
  }
}

const db = admin.firestore();
const reviewsCol = db.collection('reviews');
