#!/bin/bash
	
for file in *.sql
do
	echo ""
	echo "		***********************************************************"
	echo "			Executing " $file
	echo "		***********************************************************"
	psql --dbname test_150111 --username clima --file="$file"

done
