#!/usr/bin/env bash
# Integration tests for workout sessions router.
# Assumes a fresh DB (rm mova.db before starting the server).

set -u
BASE="http://localhost:8000"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0

check() {
  local label="$1"
  local expected_status="$2"
  local method="$3"
  local path="$4"
  local body="${5:-}"
  local expected_substr="${6:-}"

  if [ -n "$body" ]; then
    response=$(curl -s -o /tmp/resp_body -w "%{http_code}" \
      -X "$method" "$BASE$path" \
      -H "Content-Type: application/json" \
      -d "$body")
  else
    response=$(curl -s -o /tmp/resp_body -w "%{http_code}" \
      -X "$method" "$BASE$path")
  fi

  local body_content
  body_content=$(cat /tmp/resp_body)

  if [ "$response" = "$expected_status" ]; then
    if [ -n "$expected_substr" ] && ! echo "$body_content" | grep -Fq "$expected_substr"; then
      echo -e "${RED}✗ $label${NC} — status OK ($response) but body missing '$expected_substr'"
      echo "    body: $body_content"
      fail=$((fail + 1))
    else
      echo -e "${GREEN}✓ $label${NC} ($response)"
      pass=$((pass + 1))
    fi
  else
    echo -e "${RED}✗ $label${NC} — expected $expected_status, got $response"
    echo "    body: $body_content"
    fail=$((fail + 1))
  fi
}

echo -e "${YELLOW}=== SETUP: Master exercises ===${NC}"
check "Create strength exercise (Squat, id=1)" "201" "POST" "/exercises" \
  '{"name":"Barbell Squat","muscle_group":"Legs","is_cardio":false}'
check "Create strength exercise (Bench, id=2)" "201" "POST" "/exercises" \
  '{"name":"Bench Press","muscle_group":"Chest","is_cardio":false}'
check "Create cardio exercise (Treadmill, id=3)" "201" "POST" "/exercises" \
  '{"name":"Treadmill","muscle_group":"Cardio","is_cardio":true}'
check "Create exercise to soft-delete (id=4)" "201" "POST" "/exercises" \
  '{"name":"Deprecated Move","muscle_group":"Arms","is_cardio":false}'
check "Soft-delete exercise #4" "200" "DELETE" "/exercises/4"

echo -e "\n${YELLOW}=== SETUP: Workout plan to reference ===${NC}"
check "Create plan (id=1)" "201" "POST" "/workout-plans" \
  '{"name":"Leg Day","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":4,"target_reps":10}]}'

echo -e "\n${YELLOW}=== SESSIONS: List (empty) ===${NC}"
check "List sessions — empty" "200" "GET" "/users/1/workout-sessions" "" "[]"

echo -e "\n${YELLOW}=== SESSIONS: Create — happy paths ===${NC}"
check "Create strength-only session" "201" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-20","sets":[{"type":"strength","exercise_id":1,"reps":10,"weight":80}]}' \
  '"id"'

check "Create cardio-only session" "201" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-21","sets":[{"type":"cardio","exercise_id":3,"duration":1800}]}'

check "Create mixed session (strength + cardio)" "201" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-22","sets":[{"type":"strength","exercise_id":1,"reps":5,"weight":100},{"type":"cardio","exercise_id":3,"duration":600}]}'

check "Create session with plan reference" "201" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-23","plan_id":1,"sets":[{"type":"strength","exercise_id":1,"reps":8,"weight":90}]}'

echo -e "\n${YELLOW}=== SESSIONS: Pydantic validation ===${NC}"
check "Reject empty sets list" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[]}'

check "Reject strength set without weight" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":1,"reps":10}]}'

check "Reject cardio set with reps" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"cardio","exercise_id":3,"duration":600,"reps":10}]}'

check "Reject negative reps" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":1,"reps":-1,"weight":80}]}'

check "Reject negative weight" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":1,"reps":10,"weight":-5}]}'

check "Reject zero duration" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"cardio","exercise_id":3,"duration":0}]}'

check "Reject unknown set type" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"yoga","exercise_id":1,"reps":10,"weight":80}]}'

echo -e "\n${YELLOW}=== SESSIONS: Service validation ===${NC}"
check "Reject inactive exercise" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":4,"reps":10,"weight":80}]}' \
  "not active"

check "Reject nonexistent exercise" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":999,"reps":10,"weight":80}]}'

check "Reject strength-set with cardio exercise" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"strength","exercise_id":3,"reps":10,"weight":80}]}' \
  "cardio"

check "Reject cardio-set with strength exercise" "422" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","sets":[{"type":"cardio","exercise_id":1,"duration":600}]}' \
  "not cardio"

check "Reject nonexistent plan_id" "404" "POST" "/users/1/workout-sessions" \
  '{"date":"2026-04-24","plan_id":999,"sets":[{"type":"strength","exercise_id":1,"reps":10,"weight":80}]}'

echo -e "\n${YELLOW}=== SESSIONS: List & Get ===${NC}"
check "List all sessions for user" "200" "GET" "/users/1/workout-sessions" "" "2026-04-23"
check "Filter sessions by from-date" "200" "GET" "/users/1/workout-sessions?from=2026-04-22" "" "2026-04-23"
check "Filter sessions by to-date" "200" "GET" "/users/1/workout-sessions?to=2026-04-21" "" "2026-04-20"
check "Get session by id" "200" "GET" "/users/1/workout-sessions/1" "" "strength"
check "Get nonexistent session — 404" "404" "GET" "/users/1/workout-sessions/9999"

echo -e "\n${YELLOW}=== SESSIONS: Update (replace-all) ===${NC}"
check "Update session — replace sets" "200" "PUT" "/users/1/workout-sessions/1" \
  '{"date":"2026-04-20","sets":[{"type":"strength","exercise_id":2,"reps":5,"weight":120},{"type":"strength","exercise_id":1,"reps":12,"weight":70}]}' \
  '"weight":120'

check "Update: verify sets replaced" "200" "GET" "/users/1/workout-sessions/1" "" '"weight":120'

check "Update nonexistent session — 404" "404" "PUT" "/users/1/workout-sessions/9999" \
  '{"date":"2026-04-20","sets":[{"type":"strength","exercise_id":1,"reps":10,"weight":80}]}'

echo -e "\n${YELLOW}=== SESSIONS: Plan delete cascade (SET NULL) ===${NC}"
check "Verify session 4 has plan_id=1" "200" "GET" "/users/1/workout-sessions/4" "" '"plan_id":1'
check "Delete plan referenced by session 4" "204" "DELETE" "/workout-plans/1"
check "Session 4 still exists with plan_id=null" "200" "GET" "/users/1/workout-sessions/4" "" '"plan_id":null'

echo -e "\n${YELLOW}=== SESSIONS: Delete ===${NC}"
check "Delete session" "204" "DELETE" "/users/1/workout-sessions/2"
check "Verify deleted session is gone" "404" "GET" "/users/1/workout-sessions/2"
check "Delete nonexistent session — 404" "404" "DELETE" "/users/1/workout-sessions/9999"

echo -e "\n${YELLOW}=== SUMMARY ===${NC}"
echo -e "${GREEN}Passed: $pass${NC}"
echo -e "${RED}Failed: $fail${NC}"
[ "$fail" -eq 0 ] && exit 0 || exit 1
