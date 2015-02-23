#!/bin/bash
	
for file in sql/*.sql
do
	echo ""
	echo "		***********************************************************"
	echo "			Executing " $file
	echo "		***********************************************************"
	psql --dbname test_150223 --file="$file"

done
