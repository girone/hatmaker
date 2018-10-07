# HATMaker Team Assignment

## Summary

I created a team assignment tool which provides assistance through visualization. The tool has already been used to create teams for an Ultimate HAT tournament with ~150 players. If you haven't heard about the sport Ultimate or don't know HAT tournaments, I am afraid you need to read [ABOUT.md](ABOUT.md) because it's impossible to explain that in four sentences.

## Design

As the screen would need to fit much information, I decided to split the assigment view from the detailed team summary. The former should focus on easy visibility of players, their skill and current assignment. The latter should be used to get a better feeling if the teams are evenly strong.

For the first screen I decided to use drag and drop for player cards into team columns instead of individual select forms for each players, as this would have cluttered up the screen immensely.

After getting feedback on a first version with simple colors, it turned out that the skills could not easily be distinguished, as the colors were too similar. Also, there was no distinction between players with high value and low value for a skill (e.g. fit and unfit players would have the same color for fitness). So I added a color scale to each skill. I selected the four color scales such that they were sufficiently different.

The screen was still cluttered up a lot, as there was too much information on each player card. I added a control to show the team name if need be (you don't want to have many players from the same home team in a HAT team) and hid the name by default. Obfuscating the player names killed two birds with one stone: The data got anonymized (for privacy regulations and to reduce bias induced by the person assigning the players) and the cards became evenly large, so that the number of players in a team now coincides with the optical size of the column.

Also I added an "order by" control such that the team assignment view already provides an insight about the distribution of skills over the teams, and a row showing the number of male and female players in each team.

The feedback from the assignment board showed that the assignment screen lacked comparability of the teams as a whole. Because the visualization was already complex, I decided to show a summary in a separate window. This would show the average and bars indicating the min-max range for each team and each skill, subdivided by gender.

To keep the summary in sync with the assignment, it is periodically updated. I decided take the color-hue from the first visualization so that the skills have the same base color. To improve the readability, I added hover labels to the bars.

## Feedback

First review by my brother:

* Visualization is confusing, because there is so much data to grasp.
* Equally sized cards would help.
* Differnt skill levels should have different colors, not just numbers.

Second review by a colleague:

* Some sorting would help to see which team needs, e.g. a tall player or a strong female player.
* Gender should be summarized separately, because when sorting by skills, the gender is not taken into account.

Final review by the assignment board:

* We need some summary to compare the teams as a whole.
* What is the average fitness of one team compared to the others? This is an important question during the assignment process and cannot yet be answered from the visualization.
* Some legend would be helpful.

## Resources

[ColorBrewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3) for selecting distinctive color scales for the different skills.

[Stackoverflow](https://stackoverflow.com/questions/51650427/send-post-request-in-d3-with-d3-fetch) as usual, was the most important source for help.