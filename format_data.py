#!/usr/env/python3
""" format_data.py

This script takes a CSV file with player information as input and formats it in
a neat way as HTML, which can be printed on paper.

Run with
  python3 format_data.py CSV-file

Unicode does not work with python2, so use python3.

"""
import sys
import re
import csv
import math
import locale


NO_RESPONSE_OR_PAYMENT = {396, 478, 463, 456, 440, 430, 412, 413, 558, 562, 427, 590, 588}


def fix(text):
    """Repairs encoding problems."""
    # NOTE(Jonas): This seems to be fixed on the PHP side for now.
    # import ftfy
    # return ftfy.fix_text(text)
    return text


def get_color_code(value):
    value = int(value)
    color_code = "black"
    if value == 1:
        color_code = "#33cc33"
    elif value == 2:
        color_code = "#33ccff"
    elif value == 3:
        color_code = "#0066ff"
    elif value == 4:
        color_code = "#cc66ff"
    elif value == 5:
        color_code = "#ff6666"
    elif value == 6:
        color_code = "#ff9900"
    return color_code


def encode_color(value):
    return "<span class='colored-value' style='color: " + get_color_code(value) + ";'>" + str(value) + "</span>"


def format_skill(skill):
    return "<div>Throwing</div> " + "<div>" + encode_color(skill) + "</div>"


def format_gender(gender):
    return "<img src='" + gender + ".png' height='60px' />"


def format_position(pos):
    return "Position:" + pos


def format_experience(experience):
    def experience_to_color(years):
        color_code = "black"
        level = 0
        if years <= 1:
            level = 1
        elif years <= 2:
            level = 2
        elif years <= 3:
            level = 3
        elif years <= 5:
            level = 4
        elif years <= 8:
            level = 5
        else:
            level = 6
        color_code = get_color_code(level)
        return color_code
    s = "<div>Experience</div> "
    s += "<div><span class='colored-value' style='color: {color};'>{exp} {y}</span></div>".format(
            color=experience_to_color(experience),
            exp=experience,
            y="year" if experience == 1 else "years")
    return s


def format_fitness(fitness):
    # TOOD(Jonas) Use some color code or image here.
    return "<div>Fitness</div>" + "<div>" + encode_color(fitness) + "</div>"
#    s = "<img src='"
#    if fitness.startswith("Miss"):
#        s += "panda"
#    elif fitness.startswith("Columbo"):
#        s += "hedgehog"
#    elif fitness.startswith("Mr. X"):
#        s += "gnu"
#    elif fitness.startswith("Jason"):
#        s += "cheetah"
#    elif fitness.startswith("Ethan"):
#        s += "roadrunner"
#    else:
#        print("Error: Wrong fitness " + fitness)
#        exit(1)
#    s += ".png' height='60px' />"
#    return s



def format_height(height, gender):
    def classify_height(cms, gender):
        assert cms
        if gender == "Female":
            if cms > 180:
                level = 6
            elif cms > 175:
                level = 5
            elif cms > 170:
                level = 4
            elif cms > 165:
                level = 3
            elif cms > 160:
                level = 2
            else:
                level = 1
        else:  # "Male"
            if cms > 200:
                level = 6
            elif cms > 192:
                level = 5
            elif cms > 185:
                level = 4
            elif cms > 178:
                level = 3
            elif cms > 170:
                level = 2
            else:
                level = 1
        return level
    s = "<div>Height</div>"
    s += "<div><span class='colored-value' style='color: {};'>{} cm<span></div>".format(
            get_color_code(classify_height(height, gender)),
            height)
    return s


KEY_PATTERN = re.compile(r"\((Rooky|Mastermind)\)", re.IGNORECASE)


def parse_int(string):
    """Tries to interprete (obscure) strings as integers.

    Strips "(Rooky)", "(Mastermind)", "cm" from the string.
    Interpretes integer as such, e.g. "3" stays 3.
    Interpretes floats as rounded up integers, e.g. "4.2" becomes 5.
    Interpretes "2-3" as 3, ...
    """
    string = KEY_PATTERN.sub("", string)
    try:
        return int(string)
    except ValueError:
        pass

    try:
        return int(math.ceil(parse_float(string)))
    except ValueError:
        pass

    print(string, "cannot be parsed as int, trying what?")
    exit(1)


def parse_float(string):
    """Similar to parse_int().

    Interpretes also "3 1/2" as 3.5.
    """
    string = KEY_PATTERN.sub("", string)
    try:
        return float(string)
    except ValueError:
        pass

    locale.setlocale(locale.LC_NUMERIC, "de_DE.UTF-8")
    try:
        return locale.atof(string)
    except ValueError:
        pass

    WICKED_FLOAT_PATTERN = re.compile(r"(\d+ )?(\d)\/(\d)", re.IGNORECASE)
    match = WICKED_FLOAT_PATTERN.search(string)
    if match:
        result = 0
        if match.group(1):
            result = int(match.group(1))
        result += float(match.group(2)) / float(match.group(3))
        return result

    RANGE_PATTERN = re.compile(r"(\d+)-(\d+)", re.IGNORECASE)
    match = RANGE_PATTERN.search(string)
    if match:
        return float(match.group(2))

    print(string, "cannot be parsed as float (with comma delimiter)")
    exit(1)


YEAR_UNIT_PATTERN = re.compile(r"(years?|jahre?)", re.IGNORECASE)
MONTH_UNIT_PATTERN = re.compile(r"(months?|monate?)", re.IGNORECASE)
NON_UNIT_PATTERN = re.compile(r"(on and off|on/off)", re.IGNORECASE)


def audit_experience(experience):
    def fix_fancy_input(string):
        string = NON_UNIT_PATTERN.sub("", string)
        if string.lower() in {"one", "around one"}:
            return "1"
        return string
    experience = fix_fancy_input(experience)
    if MONTH_UNIT_PATTERN.search(experience):
        assert not YEAR_UNIT_PATTERN.match(experience)
        experience = MONTH_UNIT_PATTERN.sub("", experience)
        experience_in_months = parse_int(experience)
        experience = parse_int(str(experience_in_months / 12.))
        return experience
    experience = YEAR_UNIT_PATTERN.sub("", experience)
    return parse_int(experience)


def is_valid_height(height):
    return type(height) == int and 120 < height < 230


CM_PATTERN = re.compile(r"cm")


def audit_height(height):
    """The player height should be a value in cm."""
    height = CM_PATTERN.sub("", height)
    height = parse_float(height)

    if is_valid_height(int(height)):
        return int(height)
    if is_valid_height(int(100 * height)):
        return int(100 * height)
    print(height, "is not a valid height")
    exit(1)


def audit_throwing(skill):
    return audit_fitness(skill)


def audit_fitness(level):
    return parse_int(level)


class PlayerData(object):
    def __init__(self, csv_line):
        (name, email, origin, gender, experience, throwing_skill, fitness,
         height, arrival, notes, time, playersfee_received, index) = csv_line
        self.name            = name
        self.origin          = origin
        self.gender          = gender
        self.experience      = audit_experience(experience)
        self.throwing_skill  = audit_throwing(throwing_skill)
        self.fitness         = audit_fitness(fitness)
        self.height          = audit_height(height)
        self.arrival         = arrival
        self.notes           = notes

    def __repr__(self):
        s = [" "]
        s.append("  <div class='row'>")
        s.append("      <div class='col-md-8' style='border:3px solid; border-radius:5px;'>")
        s.append("          <div class='skill pull-left'>")
        s.append("              " + format_gender(self.gender))
        s.append("          </div>")
        s.append("          <div class='col-md-4'>")
        s.append("              <div class='name'>")
        s.append("                  <h4>" + self.name + "</h4> ")
        s.append("              </div>")
        s.append("              <div class='origin'>")
        s.append("                  " + self.origin + "")
        s.append("              </div>")
        s.append("          </div>")
        s.append("          <div class='col-md-1 skill-box'>")
        s.append("              " + format_skill(self.throwing_skill) )
        s.append("          </div>")
        s.append("          <div class='col-md-1 skill-box'>")
        s.append("              " + format_fitness(self.fitness) )
        s.append("          </div>")
        s.append("          <div class='col-md-2 skill-box'>")
        s.append("              " + format_experience(self.experience) )
        s.append("          </div>")
        s.append("          <div class='col-md-2 skill-box pull-right'>")
        s.append("              " + format_height(self.height, self.gender) )
        s.append("          </div>")
        s.append("      </div>")
        s.append("      <div class='col-md-2'>")
        s.append("      </div>")
        s.append("  </div>")
        s.append("  ")
        return "\n".join(s)


def parse_data(filename):
    """Reads the data from a CSV file."""
    data = []
    with open(filename) as file:
        reader = csv.reader(file, delimiter=",", quotechar="\"")
        next(reader)  # skip header -- TODO(Jonas): Use a DictReader to ease this even more.
        for line in reader:
            data.append(PlayerData(line))
    return data


def print_header():
    """Prints the html header."""
    print("    <!DOCTYPE html>")
    print("    <html lang='en'>")
    print("    <head>")
    print("      <meta charset='UTF-8'>")
    print("      <title>27th MischMasch HAT Player Information</title>")
    print("      <link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'/>")
    print("      <link rel='stylesheet' href='style.css' />")
    print("    </head>")
    print("    <body>")
    print("      <div class='container'>")


def print_footer():
    """Prints the HTML footer."""
    print("      </div>")
    print("    </body>")
    print("    </html>")
    print("")


def output_formatted(data):
    """Prints the data to stdout in a nice format."""
    print_header()
    for line in data:
        print(line)
        print("<hr>")
        print("")
    print_footer()


def main():
    if len(sys.argv) < 2:
        print("No .csv file specified. Usage is:")
        print(" python format_data.py <PlayerDataAsCSV>")
        exit(1)
    player_data = parse_data(sys.argv[1])
    output_formatted(player_data)

# TODO(Jonas): Auditing should be done column by column after reading from CSV.
# The formatting should expect only valid data. This eases debugging of auditing.


if __name__ == "__main__":
    main()

