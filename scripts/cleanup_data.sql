-- ==============================================
-- OpenFoodFacts - Cleanup Script
-- ==============================================

-- 1. Remove blatantly invalid or troll entries
DELETE FROM products
WHERE energy_kcal >= 10000           -- absurd kcal values
   OR energy_kcal < 0                -- invalid negative kcal
   OR sodium > 100                   -- unreasonable sodium (100g = 10% product!)
   OR sodium < 0                     -- invalid negative sodium
   OR LENGTH(product_name) > 200     -- likely garbage or spam
   OR LOWER(product_name) LIKE '%uranium%' -- explicit troll
   OR energy_kcal >= 1e12;           -- extreme numeric error

-- 2. Nullify invalid nutritional values
UPDATE products SET fat = NULL WHERE fat < 0;
UPDATE products SET saturated_fat = NULL WHERE saturated_fat < 0;
UPDATE products SET carbohydrates = NULL WHERE carbohydrates < 0;
UPDATE products SET sugars = NULL WHERE sugars < 0;
UPDATE products SET fiber = NULL WHERE fiber < 0;
UPDATE products SET proteins = NULL WHERE proteins < 0;
UPDATE products SET sodium = NULL WHERE sodium < 0;

-- 3. Clean up garbage brand values
UPDATE products
SET brands = NULL
WHERE brands LIKE '%unknown%'
   OR brands LIKE '%to-be-completed%'
   OR LENGTH(brands) < 2
   OR (brands GLOB '[0-9]*' AND brands NOT GLOB '*[A-Za-z]*');

-- 4. Nullify empty or useless text fields
UPDATE products
SET ingredients_text = NULL
WHERE ingredients_text IS NULL OR ingredients_text = '';

UPDATE products
SET packaging = NULL
WHERE packaging IS NULL OR packaging = '';

UPDATE products
SET labels = NULL
WHERE labels IS NULL OR labels = '';

-- 5. Standardize nutrition grade: drop 'not-applicable', 'unknown' and empty
UPDATE products
SET nutrition_grade_fr = NULL
WHERE nutrition_grade_fr IN ('', 'not-applicable', 'unknown');
