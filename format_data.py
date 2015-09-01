#!/usr/env/python3
""" format_data.py 

This script takes a CSV file with player information as input and formats it in
a neat way as HTML, which can be printed on paper.

Run with 
  python3 format_data.py CSV-file

Unicode does not work with python2, so use python3.

"""
import sys
import ftfy

def fix(text):
    """
    This repairs encoding problems which have been wront before even reaching
    the server via HTTP POST.

    HACKYHACKYHACKY!
    """
    return text.replace("Ã?sterreich", "Österreich").replace("Ã?", "ß")

def parse_line(csv):
    """
    The data is probably enclosed with " so we cannot just split(","), since
    this would split at enclosed , as well.
    """
    fields = csv.split(",")
    fields = [f for f in fields if f != "," and f != "" and f != '\n']
    fields = [f.strip('"') for f in fields]
    fields = [f.replace("\\#", ",") for f in fields]
    try:
        #print("#".join([repr(f) for f in fields]))
        #print("#".join([ftfy.fix_text(f) for f in fields]))
        return [fix(ftfy.fix_text(field)) for field in fields]
    except Exception as e:
        print("ftfy exception: " + str(e))
        print("Run this script with python3 to avoid this.")
        return []


def format_skill(skill):
    if skill.startswith("Pro") or skill.startswith("All"):
        return "blue"
    elif skill.startswith("Adva"):
        return "red"
    elif skill.startswith("Bas"):
        return "green"
    else:
        print("Error: wrong skill '" + skill + "'")
        exit(1)


def format_gender(gender):
    return "<img src='" + gender + ".png' height='60px' />"


def format_position(pos):
    return "Position:" + pos


def format_num_tournaments(num):
    s = " Tournaments this year: "
    if num.startswith("More"):
        s += "> 5"
    else:
        s += num
    return s


def format_fitness(fitness):
    s = "<img src='"
    if fitness.startswith("Miss"):
        s += "panda"
    elif fitness.startswith("Columbo"):
        s += "hedgehog"
    elif fitness.startswith("Mr. X"):
        s += "gnu"
    elif fitness.startswith("Jason"):
        s += "cheetah"
    elif fitness.startswith("Ethan"):
        s += "roadrunner"
    else:
        print("Error: Wrong fitness " + fitness)
        exit(1)
    s += ".png' height='60px' />"
    return s


class PlayerData(object):
    def __init__(self, csvLine):
        (name, origin, gender, team, num_tournaments, position, throwing_skill,
                fitness, arrival, notes, time, index) = parse_line(csvLine)
        self.name            = name
        self.origin          = origin
        self.gender          = gender
        self.team            = team
        self.num_tournaments = num_tournaments
        self.position        = position
        self.throwing_skill  = throwing_skill
        self.fitness         = fitness
        self.arrival         = arrival
        self.notes           = notes

    def __repr__(self):
        s = [" "]
        s.append("  <div class='row'>")
        s.append("      <div class='col-md-6'>")
        s.append("          <div class='skill'>")
        s.append("              <h4>" + self.name + "</h4> ")
        s.append("          </div>")
        s.append("          <div class='skill'>")
        s.append("              " + self.origin + "")
        s.append("          </div>")
        s.append("      </div>")
        s.append("      <div class='col-md-6' style='border:3px solid " +  \
                                format_skill(self.throwing_skill) +  \
                                "; border-radius:5px;'>")
        s.append("          <span class='skill pull-left'>")
        s.append("              " + format_gender(self.gender))
        s.append("          </span>")
        s.append("          <span class='skill'>")
        s.append("              " + format_position(self.position))
        s.append("          </span>")
        s.append("          <span class='skill'>")
        s.append("              " + format_num_tournaments(self.num_tournaments) )
        s.append("          </span>")
        s.append("          <span class='skill pull-right'>")
        s.append("              " + format_fitness(self.fitness) )
        s.append("          </span>")
        s.append("      </div>")
        s.append("  </div>")
        s.append("  ")
        return "\n".join(s)


def parse_data(filename):
    """Reads the data from a CSV file."""
    data = []
    with open(filename) as file:
        for line in file:
            data.append(PlayerData(line))
    return data


def print_header():
    """Prints the html header."""
    print("    <!DOCTYPE html>")
    print("    <html lang='en'>")
    print("    <head>")
    print("      <meta charset='UTF-8'>")
    print("      <title>26th MischMasch HAT Player Information</title>")
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


if __name__ == "__main__":
    main()

