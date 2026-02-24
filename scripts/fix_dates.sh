#!/bin/bash
# fix_dates.sh — Fixes created dates in PocketBase news records
# Uses only curl + jq, no Deno needed. Runs on the server via SSH.
set -euo pipefail

PB_URL="${POCKETBASE_URL:-http://127.0.0.1:8090}"
PB_EMAIL="${PB_ADMIN_EMAIL}"
PB_PASS="${PB_ADMIN_PASSWORD}"
CSV_FILE="${1:-./static/Posts - Arkusz1.csv}"

echo "=== PocketBase Date Fixer ==="
echo "PB URL: $PB_URL"
echo "CSV: $CSV_FILE"

# --- Auth ---
echo ""
echo "[1/4] Authenticating..."
AUTH_RESP=$(curl -s --max-time 5 -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$PB_EMAIL\",\"password\":\"$PB_PASS\"}")

TOKEN=$(echo "$AUTH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])" 2>/dev/null || true)

if [ -z "$TOKEN" ]; then
  echo "FAILED to authenticate! Response: $AUTH_RESP"
  exit 1
fi
echo "OK - authenticated."

# --- Fetch all news records ---
echo ""
echo "[2/4] Fetching news records..."
ALL_ITEMS="[]"
PAGE=1
while true; do
  RESP=$(curl -s --max-time 10 "$PB_URL/api/collections/news/records?page=$PAGE&perPage=200&fields=id,title,created" \
    -H "Authorization: $TOKEN")
  
  ITEMS=$(echo "$RESP" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data.get('items', []):
    print(item['id'] + '|' + item.get('title','').replace('|','') + '|' + item.get('created',''))
total = data.get('totalItems', 0)
print('TOTAL:' + str(total))
" 2>/dev/null)

  # Check total
  TOTAL=$(echo "$ITEMS" | grep "^TOTAL:" | cut -d: -f2)
  # Get records (non-TOTAL lines)
  RECORDS=$(echo "$ITEMS" | grep -v "^TOTAL:")
  
  if [ -n "$RECORDS" ]; then
    echo "$RECORDS" >> /tmp/pb_news_items.txt
  fi
  
  COUNT=$(echo "$RECORDS" | wc -l | tr -d ' ')
  echo "  Page $PAGE: $COUNT items (total: $TOTAL)"
  
  if [ "$COUNT" -lt 200 ]; then
    break
  fi
  PAGE=$((PAGE + 1))
done

TOTAL_FETCHED=$(wc -l < /tmp/pb_news_items.txt | tr -d ' ')
echo "Fetched $TOTAL_FETCHED records."

# --- Parse CSV for title -> date mapping ---
echo ""
echo "[3/4] Parsing CSV for dates..."

# Build mapping: title -> ISO date
# CSV columns: Post Data (JSON), Post ID, Created Time, Post Link, Full Picture URL, Message, Picture URL, Post Story
# We extract Created Time (col 3) and Message (col 6) using python3
python3 << 'PYEOF' > /tmp/csv_title_dates.txt
import csv, sys

with open(sys.argv[1] if len(sys.argv) > 1 else "./static/Posts - Arkusz1.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        created = row.get("Created Time", "").strip()
        message = row.get("Message", "") or row.get("Post Story", "") or ""
        message = message.strip()
        if not message or not created:
            continue
        # Replicate title generation: first line, max 60 chars
        title = message.split("\n")[0][:60].strip()
        if len(message.split("\n")[0]) >= 60:
            title += "..."
        # Output: title|isodate
        print(f"{title.replace('|','')}|{created}")
PYEOF

CSV_COUNT=$(wc -l < /tmp/csv_title_dates.txt | tr -d ' ')
echo "Parsed $CSV_COUNT titles with dates from CSV."

# --- Match and update ---
echo ""
echo "[4/4] Updating dates..."
UPDATED=0
SKIPPED=0
NO_MATCH=0
ERRORS=0

while IFS='|' read -r PB_ID PB_TITLE PB_CREATED; do
  # Find matching CSV entry
  CSV_DATE=$(grep -F "$PB_TITLE" /tmp/csv_title_dates.txt 2>/dev/null | head -1 | cut -d'|' -f2 || true)
  
  if [ -z "$CSV_DATE" ]; then
    NO_MATCH=$((NO_MATCH + 1))
    continue
  fi
  
  # Check if already correct (simple prefix match since PB stores differently)
  if echo "$PB_CREATED" | grep -q "$(echo "$CSV_DATE" | cut -c1-19)"; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  # Update via PATCH
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    -X PATCH "$PB_URL/api/collections/news/records/$PB_ID" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"created\":\"$CSV_DATE\"}")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "  [OK] $PB_TITLE -> $CSV_DATE"
    UPDATED=$((UPDATED + 1))
  else
    echo "  [ERR] $PB_TITLE (HTTP $HTTP_CODE)"
    ERRORS=$((ERRORS + 1))
  fi
done < /tmp/pb_news_items.txt

# Cleanup
rm -f /tmp/pb_news_items.txt /tmp/csv_title_dates.txt

echo ""
echo "==============================="
echo "Done!"
echo "  Updated:  $UPDATED"
echo "  Skipped:  $SKIPPED (already correct)"
echo "  No match: $NO_MATCH"  
echo "  Errors:   $ERRORS"
echo "==============================="
