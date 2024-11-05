import pandas as pd
from google.cloud import firestore

# Initialize Firestore client
client = firestore.Client()

# Load the CSV data
df = pd.read_csv("2020-data-new.csv.csv")
df.fillna(-1, inplace=True)

# Set Firestore batch size and initialize batch
batch_size = 5
batch = client.batch()

# Write each row of data as a separate document, up to the first 10 rows
for i, d in df.iterrows():
    if i > 10:  # Stop after 10 rows
        break

    # Convert row to dictionary and set document reference
    doc_ref = client.collection('voyages_db').document(f'voyage_{i}')
    batch.set(doc_ref, d.to_dict())

    # Commit the batch every batch_size documents
    if (i + 1) % batch_size == 0:
        try:
            print(f"Committing batch {i // batch_size + 1}")
            batch.commit()  # Commit the current batch
        except Exception as e:
            print(f"Error committing batch: {e}")
            break  # Exit loop on error
        batch = client.batch()  # Start a new batch




