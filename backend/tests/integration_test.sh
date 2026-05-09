#!/usr/bin/env bash
# =============================================================================
#  GymTracker — Comprehensive Integration Test Suite
#  Aligned with docs/openapi.yaml
# =============================================================================

set -euo pipefail

BASE_URL="http://localhost:8000"
ADMIN_AUTH="nicokoechli:12345678"
USER_AUTH="lorissbaa:12345678"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass=0
fail=0

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    exit 1
fi

# Helper: perform request and check response
# Usage: request "Label" "Auth" "Method" "/path" "ExpectedStatus" ["Body"] ["JQ_Filter"]
request() {
    local label="$1"
    local auth="$2"
    local method="$3"
    local path="$4"
    local expected_status="$5"
    local body="${6:-}"
    local jq_filter="${7:-.}"

    echo -ne "${BLUE}Testing:${NC} $label... "

    local curl_opts=("-s" "-w" "%{http_code}" "-o" "/tmp/gym_resp.json" "-X" "$method")
    if [ -n "$auth" ]; then
        curl_opts+=("-u" "$auth")
    fi
    if [ -n "$body" ]; then
        curl_opts+=("-H" "Content-Type: application/json" "-d" "$body")
    fi

    local status_code
    status_code=$(curl "${curl_opts[@]}" "$BASE_URL$path")

    if [ "$status_code" -eq "$expected_status" ]; then
        if [ -n "$jq_filter" ] && [ "$status_code" -ne 204 ]; then
            if ! jq -e "$jq_filter" /tmp/gym_resp.json > /dev/null 2>&1; then
                echo -e "${RED}✗ (Status OK, but JQ filter failed)${NC}"
                echo "Response: $(cat /tmp/gym_resp.json)"
                fail=$((fail + 1))
                return 1
            fi
        fi
        echo -e "${GREEN}✓ ($status_code)${NC}"
        pass=$((pass + 1))
        return 0
    else
        echo -e "${RED}✗ (Expected $expected_status, got $status_code)${NC}"
        echo "Response: $(cat /tmp/gym_resp.json)"
        fail=$((fail + 1))
        return 1
    fi
}

# Cleanup previous data if possible (optional, depends on server state)
# For this script, we assume a fresh-ish DB or at least seeded ones.

echo -e "${YELLOW}=== STARTING INTEGRATION TESTS ===${NC}\n"

# -----------------------------------------------------------------------------
#  1. AUTHENTICATION
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[1/7] Auth Tests${NC}"
request "Register new user" "" "POST" "/auth/register" 201 '{"username":"tester","password":"password123"}' '.username == "tester"'
request "Register existing user (Conflict)" "" "POST" "/auth/register" 409 '{"username":"tester","password":"password123"}'
request "Get current user (Admin)" "$ADMIN_AUTH" "GET" "/auth/me" 200 "" '.role == "admin"'
request "Get current user (Regular)" "$USER_AUTH" "GET" "/auth/me" 200 "" '.role == "user"'
request "Unauthorized access" "wrong:pass" "GET" "/auth/me" 401

# -----------------------------------------------------------------------------
#  2. EXERCISES (Admin-only management)
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/7] Exercise Tests${NC}"
request "Create exercise (Admin)" "$ADMIN_AUTH" "POST" "/exercises" 201 '{"name":"Bench Press","muscle_group":"Chest","is_cardio":false}' '.id == 1'
request "Create exercise (User -> Forbidden)" "$USER_AUTH" "POST" "/exercises" 403 '{"name":"Should fail","muscle_group":"Arms","is_cardio":false}'
request "List exercises" "$USER_AUTH" "GET" "/exercises" 200 "" 'length > 0'
request "Get exercise by ID" "$USER_AUTH" "GET" "/exercises/1" 200 "" '.name == "Bench Press"'
request "Update exercise (Admin)" "$ADMIN_AUTH" "PUT" "/exercises/1" 200 '{"name":"Flat Bench Press","muscle_group":"Chest","is_cardio":false}' '.name == "Flat Bench Press"'
request "Soft-delete exercise (Admin)" "$ADMIN_AUTH" "DELETE" "/exercises/1" 200 "" '.is_active == false'

# Create a few more for later use
request "Create Squat" "$ADMIN_AUTH" "POST" "/exercises" 201 '{"name":"Squat","muscle_group":"Legs","is_cardio":false}'
request "Create Treadmill" "$ADMIN_AUTH" "POST" "/exercises" 201 '{"name":"Treadmill","muscle_group":"Cardio","is_cardio":true}'

# -----------------------------------------------------------------------------
#  3. EXERCISE REQUESTS
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/7] Exercise Request Tests${NC}"
request "Submit request (User)" "$USER_AUTH" "POST" "/exercise-requests" 201 '{"suggested_name":"Deadlift","muscle_group":"Back","is_cardio":false}' '.status == "pending"'
request "List requests (Admin sees all)" "$ADMIN_AUTH" "GET" "/exercise-requests" 200 "" 'length >= 1'
request "List requests (User sees own)" "$USER_AUTH" "GET" "/exercise-requests" 200 "" 'length == 1'

# Test anti-spam (Max 5 pending)
for i in {1..4}; do
    request "Spam request $i" "$USER_AUTH" "POST" "/exercise-requests" 201 "{\"suggested_name\":\"Spam $i\",\"muscle_group\":\"Arms\",\"is_cardio\":false}"
done
request "Submit 6th request (Too Many)" "$USER_AUTH" "POST" "/exercise-requests" 429 '{"suggested_name":"Too Many","muscle_group":"Arms","is_cardio":false}'

# Approval / Denial
request "Approve request (Admin)" "$ADMIN_AUTH" "POST" "/exercise-requests/1/approve" 200 "" '.status == "approved"'
request "Verify exercise created from request" "$USER_AUTH" "GET" "/exercises" 200 "" 'any(.name == "Deadlift")'
request "Deny request (Admin)" "$ADMIN_AUTH" "POST" "/exercise-requests/2/deny" 200 "" '.status == "denied"'

# -----------------------------------------------------------------------------
#  4. WORKOUT PLANS
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/7] Workout Plan Tests${NC}"
request "Create personal plan" "$USER_AUTH" "POST" "/workout-plans" 201 \
    '{"name":"My Push Day","exercises":[{"exercise_id":2,"order_index":1,"target_sets":3,"target_reps":10}]}' \
    '.id == 1'

request "Create template (Admin)" "$ADMIN_AUTH" "POST" "/workout-plans" 201 \
    '{"name":"Pro Template","is_template":true,"exercises":[{"exercise_id":2,"order_index":1,"target_sets":5,"target_reps":5}]}'

request "Reject plan with cardio (Business Rule)" "$USER_AUTH" "POST" "/workout-plans" 422 \
    '{"name":"Bad Plan","exercises":[{"exercise_id":3,"order_index":1,"target_sets":1,"target_reps":1}]}'

request "Reject plan with duplicate order" "$USER_AUTH" "POST" "/workout-plans" 422 \
    '{"name":"Bad Plan","exercises":[{"exercise_id":2,"order_index":1,"target_sets":1,"target_reps":1},{"exercise_id":2,"order_index":1,"target_sets":1,"target_reps":1}]}'

request "List plans (User sees template + personal)" "$USER_AUTH" "GET" "/workout-plans" 200 "" 'length == 2'

# -----------------------------------------------------------------------------
#  5. WORKOUT SESSIONS
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[5/7] Workout Session Tests${NC}"
request "Log session (Strength)" "$USER_AUTH" "POST" "/users/2/workout-sessions" 201 \
    '{"date":"2026-05-09","sets":[{"type":"strength","exercise_id":2,"reps":10,"weight":60.0}]}' \
    '.id == 1'

request "Log session (Cardio)" "$USER_AUTH" "POST" "/users/2/workout-sessions" 201 \
    '{"date":"2026-05-09","sets":[{"type":"cardio","exercise_id":3,"duration":1800}]}' \
    '.id == 2'

request "Reject empty session (Business Rule 3)" "$USER_AUTH" "POST" "/users/2/workout-sessions" 422 \
    '{"date":"2026-05-09","sets":[]}'

request "List user sessions" "$USER_AUTH" "GET" "/users/2/workout-sessions" 200 "" 'length == 2'
request "Get session details" "$USER_AUTH" "GET" "/users/2/workout-sessions/1" 200 "" '.sets | length == 1'

# -----------------------------------------------------------------------------
#  6. BODY METRICS
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[6/7] Body Metric Tests${NC}"
request "Log weight" "$USER_AUTH" "POST" "/users/2/body-metrics" 201 '{"date":"2026-05-09","body_weight":80.5}' '.id == 7'
request "Update weight" "$USER_AUTH" "PUT" "/users/2/body-metrics/7" 200 '{"date":"2026-05-09","body_weight":80.0}' '.body_weight == 80.0'
request "List metrics" "$USER_AUTH" "GET" "/users/2/body-metrics" 200 "" 'length >= 1'

# -----------------------------------------------------------------------------
#  7. EXPORT
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}[7/7] Export Tests${NC}"
# Note: JQ won't work for binary/csv, so we just check status
echo -ne "${BLUE}Testing:${NC} Export sessions (CSV)... "
status=$(curl -s -o /tmp/gym_export.csv -w "%{http_code}" -u "$USER_AUTH" "$BASE_URL/users/2/export/workout-sessions?format=csv")
if [ "$status" -eq 200 ]; then echo -e "${GREEN}✓${NC}"; pass=$((pass + 1)); else echo -e "${RED}✗ ($status)${NC}"; fail=$((fail + 1)); fi

echo -ne "${BLUE}Testing:${NC} Export sessions (PDF)... "
status=$(curl -s -o /tmp/gym_export.pdf -w "%{http_code}" -u "$USER_AUTH" "$BASE_URL/users/2/export/workout-sessions?format=pdf")
if [ "$status" -eq 200 ]; then echo -e "${GREEN}✓${NC}"; pass=$((pass + 1)); else echo -e "${RED}✗ ($status)${NC}"; fail=$((fail + 1)); fi

echo -ne "${BLUE}Testing:${NC} Export metrics (CSV)... "
status=$(curl -s -o /tmp/gym_export_metrics.csv -w "%{http_code}" -u "$USER_AUTH" "$BASE_URL/users/2/export/body-metrics?format=csv")
if [ "$status" -eq 200 ]; then echo -e "${GREEN}✓${NC}"; pass=$((pass + 1)); else echo -e "${RED}✗ ($status)${NC}"; fail=$((fail + 1)); fi

# -----------------------------------------------------------------------------
#  SUMMARY
# -----------------------------------------------------------------------------
echo -e "\n${YELLOW}=== TEST SUMMARY ===${NC}"
echo -e "${GREEN}Passed: $pass${NC}"
echo -e "${RED}Failed: $fail${NC}"

if [ "$fail" -eq 0 ]; then
    echo -e "\n${GREEN}ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "\n${RED}SOME TESTS FAILED.${NC}"
    exit 1
fi
