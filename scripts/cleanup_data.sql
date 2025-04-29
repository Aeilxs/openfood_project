-- fyi: we don't use really the validity flag in the database, but it might be useful
-- for some queries, and it is a good practice to have it

-- 0. Add a validity flag
ALTER TABLE products
ADD COLUMN is_valid BOOLEAN DEFAULT 1;

-- 1. Flag invalid or troll entries
UPDATE products
SET is_valid = 0
WHERE energy_kcal >= 10000
   OR energy_kcal < 0
   OR sodium > 100
   OR sodium < 0
   OR LENGTH(product_name) > 200
   OR LOWER(product_name) LIKE '%uranium%'
   OR energy_kcal >= 1e12;

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
   OR brands LIKE '%to-be-completed%';

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

-- 5. Standardize nutrition grade
UPDATE products
SET nutrition_grade_fr = NULL
WHERE nutrition_grade_fr IN ('', 'not-applicable', 'unknown');
