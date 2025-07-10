# Store Layout Server

A simple Node.js server using Express and MongoDB to persist store layout dimensions.

## Features

- Store and retrieve store layout data (dimensions and zones)
- Single store support
- RESTful API endpoints
- MongoDB persistence

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/walmart-store-layout
```

Adjust MongoDB URI as needed. You'll need to have MongoDB installed and running.

3. Start the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Get Store Layout

```
GET /api/store
```

Returns the store layout data with dimensions and zones.

### Update Store Dimensions

```
PUT /api/store/dimensions
```

Body:
```json
{
  "width": 30,
  "height": 20
}
```

Updates just the width and height of the store.

### Update Entire Store Layout

```
PUT /api/store
```

Body:
```json
{
  "width": 30,
  "height": 20,
  "zones": [
    {
      "id": "1",
      "name": "Grocery",
      "color": "#10b981",
      "x": 2,
      "y": 2,
      "width": 12,
      "height": 8
    },
    // more zones...
  ]
}
```

Updates the entire store layout including dimensions and zones.

### Add a Zone

```
POST /api/store/zones
```

Body:
```json
{
  "id": "4",
  "name": "Clothing",
  "color": "#8B5CF6",
  "x": 5,
  "y": 5,
  "width": 10,
  "height": 6
}
```

Adds a new zone to the store.

### Update a Zone

```
PUT /api/store/zones/:id
```

Body:
```json
{
  "name": "Updated Zone Name",
  "color": "#FF5733",
  "x": 3,
  "y": 3,
  "width": 8,
  "height": 5
}
```

Updates an existing zone with the specified ID.

### Delete a Zone

```
DELETE /api/store/zones/:id
```

Deletes a zone with the specified ID.

## Health Check

```
GET /health
```

Returns status information about the server.
