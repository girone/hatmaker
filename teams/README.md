# HATMaker Team Assignment

## Summary

I created a web application for organizing a sports tournament called _HATMaker_. The app is a suite of tools which have already been used to create an Ultimate HAT tournament with ~150 players. If you haven't heard about the sport Ultimate or don't know HAT tournaments, I am afraid you need to read [ABOUT.md](ABOUT.md) because it's impossible to explain that in four sentences. The app consists of several parts including player registration and self-assessment, payments management and team assigment. For the Udacity project on Data Visualization I decided to hand in the team assignment tool which makes extensive use of data visualization using D3.

Technically, the app uses a HTML+CSS+JavaScript frontend and a PHP backend with a MySQL database. For the sake of submission, I branched off a version which uses a JSON file instead of the database. The dataset of contains an obfuscated version of the registration for the latest tournament (names cut to initials, email addresses removed).

As the app uses a PHP backend, you need to run a PHP server to view it. In the hatmaker root directory, run `php -S localhost:8080` and then open your browser at [http://localhost:8080/teams/](http://localhost:8080/teams/).

## Design

The team assignment app is used to manually group 150 players with individual skill ratings into 12 teams. Ideally the resulting teams should have the same number of players with evenly distributed skills. To support the user in this task, the app needs to provide an intuitive way to change the assigment of players, while at the same time providing sufficient information about the resulting teams strengths and weaknesses.

Usually, the team assignment is done using a high resolution projector or multiple screens. As the screen would need to fit much information, I decided to split the assigment view from the detailed team summary. The former should focus on easy visibility of individual players, their skill sets and allow for manipulation of the assignment. Whereas the latter faciliates creating evenly strong teams by providing visual clues about the distribution of skills within the teams.

For the first screen I decided to use drag and drop for grouping players into team columns instead of individual select forms for each players, as this would have cluttered up the screen immensely.

After getting feedback on a first version with simple colors, it turned out that the skills could not easily be distinguished, as the colors were too similar. Also, there was no distinction between players with high value and low value for a skill (e.g. fit and unfit players would have the same color for fitness). So I added a color scale to each skill. I selected the four color scales such that they were sufficiently different.

The screen was still cluttered up a lot, as there was too much information on each player card. Part of this I solved by adding a control to show the team name if need be (you don't want to have many players from the same home team in a HAT team) and hidding the name by default. Afterwards, obfuscating the player names killed two birds with one stone: The data got anonymized (for privacy regulations and to reduce bias induced by the person assigning the players) and the cards became evenly large, so that the number of players in a team now coincides with the optical size of the column.

Also I added an "order by" control such that the team assignment view already provides an insight about the distribution of skills over the teams, and a row showing the number of male and female players in each team.

The feedback from the assignment board showed that the assignment screen lacked comparability of the teams as a whole. Because the visualization was already complex, I decided to show a summary in a separate window. This would show the average and bars indicating the min-max range for each team and each skill, subdivided by gender.

To keep the summary in sync with the assignment, it is periodically updated. This has a small but valuable side-effect: You can run the app on another browser and you get a kind-of live-stream for free.

I decided reuse the color-hue from the first visualization so that the skills have the same base color. To improve the readability, I added hover labels to the bars.

Finally, when reviewing the app myself after the project paused while I cleared my mind during vacation, I felt that the visualizations could be improved by adding colors to columns, so that it the different information of different parts of the summary can be visually matched with each other. Also, to improve the look and feel, I added some eye-candy like interactive hover effects which hint what effects the drag and drop actions will have.

## Feedback

### First review (by my brother)

* Visualization is confusing, because there is so much data to grasp.
* Equally sized cards would help.
* Differnt skill levels should have different colors, not just numbers.

### Second review (from a colleague)

* Some sorting would help to see which team needs, e.g. a tall player or a strong female player.
* Gender should be summarized separately, because when sorting by skills, the gender is not taken into account.

### Third review (feedback from the assignment board)

* We need some summary to compare the teams as a whole.
* What is the average fitness of one team compared to the others? This is an important question during the assignment process and cannot yet be answered from the visualization.
* Some legend would be helpful.

### Fourth review (myself)

* The graphs are cluttered up, some more spacing or coloring of columns could help.
* Some explanation is needed. Maybe add some effects to encourage interaction and hint effects of actions.

## Resources

[ColorBrewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3) for selecting distinctive color scales for the different skills.

[Stackoverflow](https://stackoverflow.com/questions/51650427/send-post-request-in-d3-with-d3-fetch) as usual, was the most important source for help.

[Scott Murray's Blog posts on D3](http://alignedleft.com/tutorials/d3/binding-data) and [Dashing D3js](https://www.dashingd3js.com/binding-data-to-dom-elements) helped a lot.
