#!/bin/bash
# fix_dates.sh — Fixes created dates in PocketBase news records
# Pure bash/curl/python3 — no Deno needed
set -euo pipefail

# --- Config: read from server .env if available ---
SERVER_ENV="/var/www/tkd-dzwirzyno/.env"
if [ -f "$SERVER_ENV" ]; then
  echo "Reading credentials from $SERVER_ENV"
  export $(grep -v '^#' "$SERVER_ENV" | xargs)
fi

PB_URL="${POCKETBASE_URL:-http://127.0.0.1:8090}"
PB_EMAIL="${PB_ADMIN_EMAIL:-}"
PB_PASS="${PB_ADMIN_PASSWORD:-}"
CSV_FILE="${1:-./static/Posts - Arkusz1.csv}"

if [ -z "$PB_EMAIL" ] || [ -z "$PB_PASS" ]; then
  echo "ERROR: Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD"
  exit 1
fi

echo "=== PocketBase Date Fixer ==="
echo "PB URL: $PB_URL"
echo "CSV: $CSV_FILE"

# --- Auth (try both old and new PocketBase endpoints) ---
echo ""
echo "[1/4] Authenticating..."
AUTH_BODY="{\"identity\":\"$PB_EMAIL\",\"password\":\"$PB_PASS\"}"

# Try new endpoint first (PB >= 0.23: _superusers)
TOKEN=$(curl -s --max-time 5 -X POST "$PB_URL/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "$AUTH_BODY" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)

# Fallback to old endpoint (PB < 0.23: /api/admins)
if [ -z "$TOKEN" ]; then
  echo "  Trying legacy /api/admins endpoint..."
  TOKEN=$(curl -s --max-time 5 -X POST "$PB_URL/api/admins/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "$AUTH_BODY" 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)
fi

if [ -z "$TOKEN" ]; then
  echo "FAILED to authenticate with both endpoints!"
  echo "Testing connectivity..."
  curl -s --max-time 3 "$PB_URL/api/health" 2>&1 || echo "(no response)"
  exit 1
fi
echo "OK - authenticated."

# --- Fetch all news records ---
echo ""
echo "[2/4] Fetching news records..."
rm -f /tmp/pb_news_items.txt
touch /tmp/pb_news_items.txt
PAGE=1
while true; do
  RESP=$(curl -s --max-time 10 "$PB_URL/api/collections/news/records?page=$PAGE&perPage=200&fields=id,title,created" \
    -H "Authorization: $TOKEN")
  
  python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data.get('items', []):
    # Use tab separator to avoid issues with pipes in titles
    print(item['id'] + '\t' + item.get('title','') + '\t' + item.get('created',''))
" <<< "$RESP" >> /tmp/pb_news_items.txt 2>/dev/null

  COUNT=$(python3 -c "import sys,json; print(len(json.load(sys.stdin).get('items',[])))" <<< "$RESP" 2>/dev/null || echo "0")
  TOTAL=$(python3 -c "import sys,json; print(json.load(sys.stdin).get('totalItems',0))" <<< "$RESP" 2>/dev/null || echo "?")
  echo "  Page $PAGE: $COUNT items (total: $TOTAL)"
  
  if [ "$COUNT" -lt 200 ]; then break; fi
  PAGE=$((PAGE + 1))
done

TOTAL_FETCHED=$(wc -l < /tmp/pb_news_items.txt | tr -d ' ')
echo "Fetched $TOTAL_FETCHED records."

# --- Parse CSV ---
echo ""
echo "[3/4] Parsing CSV for dates..."

python3 << PYEOF > /tmp/csv_title_dates.txt
import csv

with open("$CSV_FILE", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        created = row.get("Created Time", "").strip()
        message = row.get("Message", "") or row.get("Post Story", "") or ""
        message = message.strip()
        if not message or not created:
            continue
        first_line = message.split("\n")[0]
        title = first_line[:60].strip()
        if len(first_line) >= 60:
            title += "..."
        # tab-separated: title \t date
        print(f"{title}\t{created}")
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

while IFS=$'\t' read -r PB_ID PB_TITLE PB_CREATED; do
  [ -z "$PB_ID" ] && continue
  
  # Find matching CSV entry (exact title match)
  CSV_DATE=$(grep -F "$PB_TITLE" /tmp/csv_title_dates.txt 2>/dev/null | head -1 | cut -f2 || true)
  
  if [ -z "$CSV_DATE" ]; then
    NO_MATCH=$((NO_MATCH + 1))
    continue
  fi
  
  # Check if already correct
  CSV_PREFIX=$(echo "$CSV_DATE" | cut -c1-19)
  if echo "$PB_CREATED" | grep -q "$CSV_PREFIX" 2>/dev/null; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  # PATCH update
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

rm -f /tmp/pb_news_items.txt /tmp/csv_title_dates.txt

echo ""
echo "==============================="
echo "Done!"
echo "  Updated:  $UPDATED"
echo "  Skipped:  $SKIPPED (already correct)"
echo "  No match: $NO_MATCH"  
echo "  Errors:   $ERRORS"
echo "==============================="
