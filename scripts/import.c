#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sqlite3.h>

#define MAX_LINE_LEN 16384
#define SEP "\t"

enum {
    IDX_CODE = 0,
    IDX_PRODUCT_NAME = 10,
    IDX_BRANDS = 18,
    IDX_CATEGORIES = 21,
    IDX_IMAGE_URL = 82,
    IDX_NUTRITION_GRADE = 58,
    IDX_INGREDIENTS = 42,
    IDX_LABELS = 29,
    IDX_PACKAGING = 14,
    IDX_ENERGY_KCAL = 89,
    IDX_FAT = 92,
    IDX_SAT_FAT = 93,
    IDX_CARBS = 129,
    IDX_SUGARS = 130,
    IDX_FIBER = 142,
    IDX_PROTEINS = 145,
    IDX_SODIUM = 151,
    MAX_FIELDS = 300
};

double parse_double(const char *s) {
    if (!s || strlen(s) == 0) return -1.0;
    char *normalized = strdup(s);
    for (char *p = normalized; *p; ++p)
        if (*p == ',') *p = '.';
    char *endptr;
    double result = strtod(normalized, &endptr);
    free(normalized);
    if (*endptr != '\0') return -1.0;
    return result > 0 ? result : -1.0;
}

void create_table(sqlite3 *db) {
    const char *sql =
        "CREATE TABLE IF NOT EXISTS products ("
        "code TEXT PRIMARY KEY,"
        "product_name TEXT, brands TEXT, categories TEXT, image_url TEXT,"
        "nutrition_grade_fr TEXT, ingredients_text TEXT, labels TEXT, packaging TEXT,"
        "energy_kcal REAL, fat REAL, saturated_fat REAL, carbohydrates REAL, sugars REAL,"
        "fiber REAL, proteins REAL, sodium REAL"
        ");";
    char *err = NULL;
    if (sqlite3_exec(db, sql, NULL, NULL, &err) != SQLITE_OK) {
        fprintf(stderr, "Error creating table: %s\n", err);
        sqlite3_free(err);
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <file.csv> <output.db>\n", argv[0]);
        return EXIT_FAILURE;
    }

    FILE *f = fopen(argv[1], "r");
    if (!f) {
        perror("Can't open CSV");
        return EXIT_FAILURE;
    }

    sqlite3 *db;
    if (sqlite3_open(argv[2], &db)) {
        fprintf(stderr, "Can't open DB: %s\n", sqlite3_errmsg(db));
        return EXIT_FAILURE;
    }

    create_table(db);
    sqlite3_exec(db, "BEGIN TRANSACTION;", NULL, NULL, NULL);

    const char *sql_insert =
        "INSERT OR IGNORE INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    sqlite3_stmt *stmt;
    if (sqlite3_prepare_v2(db, sql_insert, -1, &stmt, NULL) != SQLITE_OK) {
        fprintf(stderr, "Error prepare stmt: %s\n", sqlite3_errmsg(db));
        return EXIT_FAILURE;
    }

    char line[MAX_LINE_LEN];
    int count = 0;
    fgets(line, sizeof(line), f); // skip header

    while (fgets(line, sizeof(line), f)) {
        char *fields[MAX_FIELDS] = {NULL};
        int field = 0;
        char *ptr = line, *end;
        while ((end = strchr(ptr, '\t')) && field < MAX_FIELDS) {
            *end = '\0';
            fields[field++] = ptr;
            ptr = end + 1;
        }
        if (field < MAX_FIELDS) fields[field++] = ptr;

        const char *code = fields[IDX_CODE];
        const char *name = fields[IDX_PRODUCT_NAME];
        if (!code || !name || strlen(name) == 0) continue;

        sqlite3_bind_text(stmt, 1, code, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, name, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, fields[IDX_BRANDS], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 4, fields[IDX_CATEGORIES], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 5, fields[IDX_IMAGE_URL], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 6, fields[IDX_NUTRITION_GRADE], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 7, fields[IDX_INGREDIENTS], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 8, fields[IDX_LABELS], -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 9, fields[IDX_PACKAGING], -1, SQLITE_STATIC);
        sqlite3_bind_double(stmt, 10, parse_double(fields[IDX_ENERGY_KCAL]));
        sqlite3_bind_double(stmt, 11, parse_double(fields[IDX_FAT]));
        sqlite3_bind_double(stmt, 12, parse_double(fields[IDX_SAT_FAT]));
        sqlite3_bind_double(stmt, 13, parse_double(fields[IDX_CARBS]));
        sqlite3_bind_double(stmt, 14, parse_double(fields[IDX_SUGARS]));
        sqlite3_bind_double(stmt, 15, parse_double(fields[IDX_FIBER]));
        sqlite3_bind_double(stmt, 16, parse_double(fields[IDX_PROTEINS]));
        sqlite3_bind_double(stmt, 17, parse_double(fields[IDX_SODIUM]));

        if (sqlite3_step(stmt) != SQLITE_DONE) {
            fprintf(stderr, "Insert error (%s): %s\n", code, sqlite3_errmsg(db));
        }

        sqlite3_reset(stmt);
        count++;
        if (count % 100000 == 0) {
            printf("[*] %d rows inserted...\n", count);
        }
    }

    sqlite3_exec(db, "COMMIT;", NULL, NULL, NULL);
    printf("[OK] %d rows inserted into %s\n", count, argv[2]);

    sqlite3_finalize(stmt);
    sqlite3_close(db);
    fclose(f);
    return EXIT_SUCCESS;
}
