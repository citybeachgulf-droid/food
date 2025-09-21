# Dinner Meetup Matcher

FastAPI service that forms balanced, interest-based dinner groups.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Example usage

1) Create interests
```bash
curl -X POST localhost:8000/interests -H 'Content-Type: application/json' -d '{"name":"Travel"}'
curl -X POST localhost:8000/interests -H 'Content-Type: application/json' -d '{"name":"Arts"}'
curl -X POST localhost:8000/interests -H 'Content-Type: application/json' -d '{"name":"Food"}'
```

2) Create users
```bash
curl -X POST localhost:8000/users -H 'Content-Type: application/json' -d '{
  "name":"Alex", "speaking_style":"Speaker", "conversation_preference":"Deep",
  "primary_interest_id":1, "secondary_interest_ids":[2,3]
}'
curl -X POST localhost:8000/users -H 'Content-Type: application/json' -d '{
  "name":"Blair", "speaking_style":"Listener", "conversation_preference":"Light",
  "primary_interest_id":1, "secondary_interest_ids":[3]
}'
```

3) Create a session and register users
```bash
curl -X POST localhost:8000/sessions -H 'Content-Type: application/json' -d '{
  "name":"Friday Dinner", "group_size":4, "randomness":0.15, "weighting_enabled":true
}'
# Suppose the created session has id 1
curl -X POST localhost:8000/sessions/1/register -H 'Content-Type: application/json' -d '{"user_id":1}'
curl -X POST localhost:8000/sessions/1/register -H 'Content-Type: application/json' -d '{"user_id":2}'
```

4) Run matching and fetch groups
```bash
curl -X POST localhost:8000/sessions/1/match
curl localhost:8000/sessions/1/groups | jq
```

## Endpoints

- POST `/users` – create user profile with speaking style, preference, interests (mark primary)
- GET `/interests` – list interests; POST `/interests` – add interest
- POST `/sessions` – create a session (configure group size and options)
- POST `/sessions/{id}/register` – register users to session
- POST `/sessions/{id}/match` – run the matcher
- GET `/sessions/{id}/groups` – fetch generated groups

## Notes

- Uses SQLite at `app.db` by default.
- Ensures each group includes at least one Speaker and one Listener where possible.
- Avoids repeating previous pairings using stored history.
- Optional slight randomness and weighting by shared interests.
