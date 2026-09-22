# TripRescue REST API Cookbook & Integration Guide

This guide covers core REST API endpoints for TripRescue, including authentication, trip management, DAG node modifications, disruption triggers, autonomous recovery, and exports.

---

## Base URLs
- **Local Development**: `http://localhost:8000`
- **Interactive OpenAPI Documentation**: `http://localhost:8000/docs`

---

## 1. Authentication

### Register a New Traveler
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Chen",
    "email": "sarah.chen@example.com",
    "password": "StrongPassword123!"
  }'
```

### Login & Obtain JWT Token
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@example.com",
    "password": "StrongPassword123!"
  }'
```

---

## 2. Trip & DAG Node Operations

### Create a New Trip
```bash
curl -X POST "http://localhost:8000/api/trips" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Japan Sakura Tour 2026",
    "origin": "HND",
    "destination": "KIX",
    "startDate": "2026-04-10",
    "endDate": "2026-04-18"
  }'
```

### Add a Flight Node
```bash
curl -X POST "http://localhost:8000/api/trips/<TRIP_ID>/nodes" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "flight",
    "title": "Tokyo to Osaka",
    "provider": "ANA",
    "confirmation": "ANA-8821",
    "originCode": "HND",
    "destinationCode": "KIX",
    "scheduledStart": "2026-04-10T09:00:00",
    "scheduledEnd": "2026-04-10T10:30:00",
    "cost": 15000
  }'
```

### Add a Hotel Stay Node
```bash
curl -X POST "http://localhost:8000/api/trips/<TRIP_ID>/nodes" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "hotel",
    "title": "Grand Hyatt Tokyo",
    "provider": "Hyatt",
    "confirmation": "HYT-9921",
    "location": "Roppongi, Tokyo",
    "scheduledStart": "2026-04-10T14:00:00",
    "scheduledEnd": "2026-04-14T11:00:00",
    "cost": 85000
  }'
```

### Delete a Node (Atomic Cascade)
```bash
curl -X DELETE "http://localhost:8000/api/trips/<TRIP_ID>/nodes/<NODE_ID>" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Export Full Trip JSON Backup
```bash
curl -X GET "http://localhost:8000/api/trips/<TRIP_ID>/export" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## 3. Disruption & Recovery Engine

### Trigger a Disruption Scenario
```bash
curl -X POST "http://localhost:8000/api/trips/<TRIP_ID>/disruptions" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "flight-delay",
    "primaryNodeId": "<PRIMARY_FLIGHT_NODE_ID>",
    "delayMinutes": 180
  }'
```

### Generate Ranked Recovery Options
```bash
curl -X GET "http://localhost:8000/api/trips/<TRIP_ID>/recovery/options" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Apply a Selected Recovery Plan
```bash
curl -X POST "http://localhost:8000/api/trips/<TRIP_ID>/recovery/apply" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "recoveryId": "<RECOVERY_PLAN_ID>"
  }'
```

---

## 4. Health & Readiness Probes

```bash
# Liveness Probe
curl -i http://localhost:8000/healthz

# Readiness Probe (Database connectivity + latency)
curl -i http://localhost:8000/readyz
```
