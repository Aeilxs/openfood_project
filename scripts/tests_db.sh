#!/bin/bash

DB="server/products.db"
OUT="test_results.txt"

if [ ! -f "$DB" ]; then
  echo "[ERROR] Database $DB not found." >&2
  exit 1
fi

echo "[*] Running data quality test on $DB..."
echo "==== OpenFoodFacts DB Quality Test ====" >"$OUT"
echo "Date: $(date)" >>"$OUT"
echo >>"$OUT"

exec_sql() {
  echo "$1" >>"$OUT"
  sqlite3 "$DB" "$2" >>"$OUT"
  echo >>"$OUT"
}

#
# === 1. Stats ===
#
echo "[*] Part 1: General stats"
echo "=== 1. General statistics ===" >>"$OUT"

exec_sql "[1] Total number of products:" \
  "SELECT COUNT(*) FROM products;"

exec_sql "[2] Products with a non-empty name:" \
  "SELECT COUNT(*) FROM products WHERE product_name IS NOT NULL AND product_name != '';"

exec_sql "[3] Products with energy data (kcal > 0):" \
  "SELECT COUNT(*) FROM products WHERE energy_kcal > 0;"

exec_sql "[4] Nutriscore grade distribution:" \
  "SELECT nutrition_grade_fr, COUNT(*) FROM products GROUP BY nutrition_grade_fr ORDER BY COUNT(*) DESC;"

exec_sql "[5] Distribution of sodium values (rounded g):" \
  "SELECT ROUND(sodium, 1) AS g_sodium, COUNT(*) FROM products WHERE sodium > 0 GROUP BY g_sodium ORDER BY g_sodium ASC;"

#
# === 2. Données aberrantes ===
#
echo "[*] Part 2: Outliers and nonsense values"
echo "=== 2. Outliers and invalid values ===" >>"$OUT"

exec_sql "[6] Products with energy_kcal > 10,000:" \
  "SELECT COUNT(*) FROM products WHERE energy_kcal > 10000;"

exec_sql "[7] Products with insane kcal values (>= 1e16):" \
  "SELECT code, product_name, energy_kcal FROM products WHERE energy_kcal >= 1e16 LIMIT 10;"

exec_sql "[8] Products with sodium > 10g:" \
  "SELECT COUNT(*) FROM products WHERE sodium > 10;"

exec_sql "[9] Products with name length > 100 characters:" \
  "SELECT COUNT(*) FROM products WHERE LENGTH(product_name) > 100;"

exec_sql "[10] Products with negative numeric values (any major nutrient):" \
  "SELECT COUNT(*) FROM products WHERE energy_kcal < 0 OR fat < 0 OR saturated_fat < 0 OR carbohydrates < 0 OR sugars < 0 OR fiber < 0 OR proteins < 0 OR sodium < 0;"

#
# === 3. Qualité des textes ===
#
echo "[*] Part 3: Textual field quality"
echo "=== 3. Text content quality ===" >>"$OUT"

exec_sql "[11] Product names with only digits or non-letters:" \
  "SELECT COUNT(*) FROM products WHERE product_name GLOB '*[0-9]*' AND product_name NOT GLOB '*[A-Za-z]*';"

exec_sql "[12] Brand fields with only digits (no letters):" \
  "SELECT COUNT(*) FROM products WHERE brands GLOB '[0-9]*' AND brands NOT GLOB '*[A-Za-z]*';"

exec_sql "[13] Brands containing 'unknown' or 'to-be-completed':" \
  "SELECT COUNT(*) FROM products WHERE brands LIKE '%unknown%' OR brands LIKE '%to-be-completed%';"

#
# === 4. Champs vides ===
#
echo "[*] Part 4: Empty and missing values"
echo "=== 4. Empty or missing data ===" >>"$OUT"

exec_sql "[14] Products with missing name:" \
  "SELECT COUNT(*) FROM products WHERE product_name IS NULL OR product_name = '';"

exec_sql "[15] Products with missing brands:" \
  "SELECT COUNT(*) FROM products WHERE brands IS NULL OR brands = '';"

exec_sql "[16] Products with missing categories:" \
  "SELECT COUNT(*) FROM products WHERE categories IS NULL OR categories = '';"

exec_sql "[17] Products with missing ingredients_text:" \
  "SELECT COUNT(*) FROM products WHERE ingredients_text IS NULL OR ingredients_text = '';"

exec_sql "[18] Products with missing image_url:" \
  "SELECT COUNT(*) FROM products WHERE image_url IS NULL OR image_url = '';"

exec_sql "[19] Products with missing packaging info:" \
  "SELECT COUNT(*) FROM products WHERE packaging IS NULL OR packaging = '';"

exec_sql "[20] Products with missing labels:" \
  "SELECT COUNT(*) FROM products WHERE labels IS NULL OR labels = '';"

#
# === 5. Cas suspects (trolls, bruit) ===
#
echo "[*] Part 5: Suspicious or troll data"
echo "=== 5. Suspicious entries ===" >>"$OUT"

exec_sql "[21] Products mentioning 'Uranium':" \
  "SELECT COUNT(*) FROM products WHERE LOWER(product_name) LIKE '%uranium%';"

exec_sql "[22] Products with Cyrillic characters:" \
  "SELECT COUNT(*) FROM products WHERE product_name GLOB '*[А-Яа-яЁё]*';"

exec_sql "[23] Products with emoji in the name:" \
  "SELECT COUNT(*) FROM products WHERE product_name GLOB '*[😀-🙏]*';"

#
# === 6. Exemples bruts ===
#
echo "[*] Part 6: Raw examples (unfiltered)"
echo "=== 6. Concrete examples (raw) ===" >>"$OUT"

exec_sql "[24] Top 5 longest product names:" \
  "SELECT product_name, LENGTH(product_name) AS len FROM products ORDER BY len DESC LIMIT 5;"

exec_sql "[25] Top 10 products with highest energy_kcal:" \
  "SELECT code, product_name, energy_kcal FROM products WHERE energy_kcal > 0 ORDER BY energy_kcal DESC LIMIT 10;"

exec_sql "[26] Top 5 most frequent first brands (unfiltered):" \
  "SELECT TRIM(SUBSTR(brands, 1, INSTR(brands || ',', ',') - 1)) AS main_brand, COUNT(*) 
   FROM products
   GROUP BY main_brand
   ORDER BY COUNT(*) DESC
   LIMIT 5;"

echo "[*] All tests complete. Results written to $OUT"
