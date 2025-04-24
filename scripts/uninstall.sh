#!/bin/bash

# Frontend cleanup
rm -rf front/node_modules
rm -rf front/dist
rm -rf front/package-lock.json

# Backend cleanup
rm -f server/products.db
rm -rf server/node_modules
rm -rf server/dist
rm -rf server/package-lock.json

# Logs cleanup
rm -rdf logs

# Import binary cleanup
rm -f scripts/import

rm en.openfoodfacts.org.products.csv
rm en.openfoodfacts.org.products.csv.gz
