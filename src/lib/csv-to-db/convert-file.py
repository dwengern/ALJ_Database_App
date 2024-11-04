# Use Google Cloud Console

import pandas as pd
import io
from google.cloud import storage, firestore

# Initialize storage and Firestore clients
storage_client = storage.Client()
client = firestore.Client()

# Define GCS bucket and file name
bucket_name = 'gcf-v2-uploads-930702959478-us-central1'
file_path = '2020-data-new.csv.csv'

# Read the file from GCS
bucket = storage_client.get_bucket(bucket_name)
blob = bucket.blob(file_path)
data = blob.download_as_text()

# Use io.StringIO to load CSV data from the downloaded text
voyages = pd.read_csv(io.StringIO(data), header=None)

# Convert DataFrame to list
voyages_list = voyages.values.tolist()

# Set Firestore batch size and initialize batch
batch_size = 5  # Firestore's recommended batch size
batch = client.batch()

# Write each row of data as a separate document
for i, row in enumerate(voyages_list):
    doc_ref = client.collection('voyages_db').document(f'voyage_{i}')
    batch.set(doc_ref, {'voyage_data': row})

    # Commit the batch every batch_size documents
    if (i + 1) % batch_size == 0:
        try:
            print(f"Committing batch {i // batch_size + 1}")
            batch.commit()  # Commit the current batch
        except Exception as e:
            print(f"Error committing batch: {e}")
            break  # Exit loop on error
        batch = client.batch()  # Start a new batch

# Commit any remaining documents if not a full batch
if len(voyages_list) % batch_size != 0:
    try:
        batch.commit()  # Commit the final batch
    except Exception as e:
        print(f"Error committing final batch: {e}")

print("Data uploaded to Firestore successfully.")



