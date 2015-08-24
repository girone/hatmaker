#!/bin/bash

# This script is used to fetch all player information and output it as CSV.
# The output can be stored in a file and then processed with the python script
# format_data.py.

# Read the credentials from file:
if [ -e "credentials.txt" ]
then
    server=$(head -1 credentials.txt)
    user=$(head -2 credentials.txt | tail -1); 
    pass=$(head -3 credentials.txt | tail -1);
    db=$(head -4 credentials.txt | tail -1);
else
    echo "Error: File credentials.txt not found."
    exit 1
fi

# enclose with double-quotes 
# remove end-of-line characters 
# remove windows end-of-line characters 
# replace comma by # (undo later)
# replace tabs separators by ","
# skip the column header line
mysql -h $server -u$user -p$pass $db \
  --batch --execute "SELECT * FROM MischMasch;" | \
sed 's/^\(.*\)$/"\1"/g' | \
sed $'s/\r//g' | \
sed 's/\\n//g' | \
sed 's/,/\\#/g' | \
sed 's/\t/","/g' | \
tail -n +2 \
> data.csv

