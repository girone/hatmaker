# hatmaker
A tool to setup teams for an ultimate frisbee HAT tournament.

## Prerequisites
Python3 to handle european special characters.

## Usage

***TODO(Jonas):** Document payments management and other new features.*

1. Fetch the data from the registration database by running the bash script
```
./get_data.sh  # creates data.csv
```
In order to perform this step, you need to put the credentials file into the
same directory.

2. Generate a list of formated player information.
```
python3 format_data.py data.csv  > player_list.html
```
TODO(girone): Use jquery and/or bootstrap to make the list sortable by
different attributes.

3. Open the generated HTML file in a web browser of you choice.
