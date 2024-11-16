import pandas as pd
import json
import os

# Read the CSV file
df = pd.read_csv('airport.csv')

# Select necessary columns including lat/long
minimal_df = df[['ident', 'name', 'latitude_deg', 'longitude_deg']].copy()

# Create simplified airport entries
airports_list = []
for _, row in minimal_df.iterrows():
    # Only include airports with 'K' prefix (US airports)
    if row['ident'].startswith('K') and len(row['ident']) == 4:
        airport_entry = {
            'code': row['ident'][1:],  # Remove the 'K' prefix
            'display': f"{row['ident'][1:]} - {row['name']}",
            'lat': float(row['latitude_deg']),  # Convert to float for JSON
            'long': float(row['longitude_deg'])
        }
        airports_list.append(airport_entry)

# Sort by code
airports_list.sort(key=lambda x: x['code'])

# Ensure the public/data directory exists
os.makedirs('../public/data', exist_ok=True)

# Save as JSON in the public/data directory
with open('../public/data/airports-min.json', 'w', encoding='utf-8') as f:
    json.dump(airports_list, f, ensure_ascii=False, separators=(',', ':'))

print(f"Processed {len(airports_list)} airports")
print("File saved as public/data/airports-min.json") 