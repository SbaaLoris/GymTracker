#!/usr/bin/env bash
# Integration tests for workout plans router.
# Assumes a fresh DB (rm mova.db before starting the server).

set -u
BASE="http://localhost:8000"

# Colors for readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0

# Helper: run curl, check status, optionally check body contains a string.
# Usage: check "label" "expected_status" "METHOD" "/path" ["json_body"] ["expected_substring"]
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

echo -e "${YELLOW}=== SETUP: Create master exercises ===${NC}"
check "Create strength exercise #1 (Squat)" "201" "POST" "/exercises" \
  '{"name":"Barbell Squat","muscle_group":"Legs","is_cardio":false}'
check "Create strength exercise #2 (Bench)" "201" "POST" "/exercises" \
  '{"name":"Bench Press","muscle_group":"Chest","is_cardio":false}'
check "Create cardio exercise (Treadmill)" "201" "POST" "/exercises" \
  '{"name":"Treadmill","muscle_group":"Cardio","is_cardio":true}'
# Soft-deleted exercise: create then delete
check "Create exercise to soft-delete" "201" "POST" "/exercises" \
  '{"name":"Deprecated Move","muscle_group":"Arms","is_cardio":false}'
check "Soft-delete exercise #4" "200" "DELETE" "/exercises/4"

echo -e "\n${YELLOW}=== PLANS: List (empty) ===${NC}"
check "List plans — empty array" "200" "GET" "/workout-plans" "" "[]"

echo -e "\n${YELLOW}=== PLANS: Create — happy paths ===${NC}"
check "Create valid plan with target_weight" "201" "POST" "/workout-plans" \
  '{"name":"Leg Day A","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":4,"target_reps":10,"target_weight":80.0}]}' \
  '"id"'

check "Create valid plan WITHOUT target_weight" "201" "POST" "/workout-plans" \
  '{"name":"Push Day","is_template":false,"exercises":[{"exercise_id":2,"order_index":1,"target_sets":3,"target_reps":8}]}'

check "Create template (stub user is admin)" "201" "POST" "/workout-plans" \
  '{"name":"Beginner Full Body","is_template":true,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":3,"target_reps":12},{"exercise_id":2,"order_index":2,"target_sets":3,"target_reps":12}]}'

echo -e "\n${YELLOW}=== PLANS: Create — validation errors ===${NC}"
check "Reject plan with cardio exercise" "422" "POST" "/workout-plans" \
  '{"name":"Bad Plan","is_template":false,"exercises":[{"exercise_id":3,"order_index":1,"target_sets":1,"target_reps":1}]}' \
  "cardio"

check "Reject plan with inactive exercise" "422" "POST" "/workout-plans" \
  '{"name":"Bad Plan","is_template":false,"exercises":[{"exercise_id":4,"order_index":1,"target_sets":1,"target_reps":1}]}' \
  "not active"

check "Reject plan with nonexistent exercise" "422" "POST" "/workout-plans" \
  '{"name":"Bad Plan","is_template":false,"exercises":[{"exercise_id":999,"order_index":1,"target_sets":1,"target_reps":1}]}'

check "Reject plan with duplicate order_index" "422" "POST" "/workout-plans" \
  '{"name":"Bad Plan","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":3,"target_reps":10},{"exercise_id":2,"order_index":1,"target_sets":3,"target_reps":10}]}' \
  "order_index"

check "Reject plan with empty exercises (Pydantic)" "422" "POST" "/workout-plans" \
  '{"name":"Empty Plan","is_template":false,"exercises":[]}'

check "Reject plan with name too short" "422" "POST" "/workout-plans" \
  '{"name":"X","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":3,"target_reps":10}]}'

check "Reject plan with negative target_weight" "422" "POST" "/workout-plans" \
  '{"name":"Bad Weight","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":3,"target_reps":10,"target_weight":-5}]}'

echo -e "\n${YELLOW}=== PLANS: List & Get ===${NC}"
check "List all plans" "200" "GET" "/workout-plans" "" "Leg Day A"
check "Filter templates only" "200" "GET" "/workout-plans?is_template=true" "" "Beginner Full Body"
check "Filter personal only" "200" "GET" "/workout-plans?is_template=false" "" "Leg Day A"
check "Get plan by id" "200" "GET" "/workout-plans/1" "" "Leg Day A"
check "Get nonexistent plan — 404" "404" "GET" "/workout-plans/9999"

echo -e "\n${YELLOW}=== PLANS: Update ===${NC}"
check "Update plan (replace-all semantics)" "200" "PUT" "/workout-plans/1" \
  '{"name":"Leg Day A v2","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":5,"target_reps":5,"target_weight":100.0},{"exercise_id":2,"order_index":2,"target_sets":3,"target_reps":8}]}' \
  "v2"

check "Update: verify old slots replaced (GET shows 2 slots)" "200" "GET" "/workout-plans/1" "" "100"

check "Update nonexistent plan — 404" "404" "PUT" "/workout-plans/9999" \
  '{"name":"Ghost","is_template":false,"exercises":[{"exercise_id":1,"order_index":1,"target_sets":3,"target_reps":10}]}'

check "Update with cardio — 422" "422" "PUT" "/workout-plans/1" \
  '{"name":"Leg Day A","is_template":false,"exercises":[{"exercise_id":3,"order_index":1,"target_sets":1,"target_reps":1}]}'

echo -e "\n${YELLOW}=== PLANS: Delete ===${NC}"
check "Delete plan" "204" "DELETE" "/workout-plans/2"
check "Delete: verify it's gone" "404" "GET" "/workout-plans/2"
check "Delete nonexistent plan — 404" "404" "DELETE" "/workout-plans/9999"

echo -e "\n${YELLOW}=== SUMMARY ===${NC}"
echo -e "${GREEN}Passed: $pass${NC}"
echo -e "${RED}Failed: $fail${NC}"
[ "$fail" -eq 0 ] && exit 0 || exit 1
