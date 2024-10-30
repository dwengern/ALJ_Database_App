/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from 'firebase-admin';
import fs from 'fs';
import csv from 'csv-parser';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('./path/to/serviceAccountKey.json'), // Firebase service account JSON file
  databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com" // Firebase project URL
});

const db = admin.firestore();

// import csv data into firestore
async function importCSVtoFirestore(filePath: string, collectionName: string) {
  const data: Record<string, any>[] = []; // array to hold parsed csv data

  // Read and parse CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => data.push(row)) // Collect each row in an array
    .on('end', async () => {
      console.log(`Parsed ${data.length} records. Uploading to Firestore...`);

      // Loop through parsed data and add each row as a document
      const batch = db.batch(); // Use batch for efficiency
      data.forEach((docData) => {
        const docRef = db.collection(collectionName).doc(); // Auto-generate document ID
        batch.set(docRef, docData);
      });

      try {
        await batch.commit(); // Commit the batch operation
        console.log('Successfully uploaded CSV data to Firestore!');
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    });
}

// Run the import function with your CSV file path and Firestore collection name
const csvFilePath = './src/lib/csv-to-db/2020_data_output.csv'; //path to csv file
const firestoreCollectionName = 'voyages'; // firebase collection name

importCSVtoFirestore(csvFilePath, firestoreCollectionName);


