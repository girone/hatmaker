# HATMaker Team Assignment Visualization

## Summary

I created a web application for organizing a sports tournament called _HATMaker_ using the techniques from the Udacity course. The app is a suite of tools which have already been used to create an Ultimate HAT tournament with ~150 players. If you haven't heard about the sport Ultimate or don't know HAT tournaments, I am afraid you need to read [ABOUT.md](ABOUT.md) because it's impossible to explain that in four sentences. The app consists of several parts including player registration and self-assessment, payments management and team assigment. For the Udacity project on Data Visualization I decided to hand in the team assignment tool which makes extensive use of data visualization using D3.

Technically, the app uses a HTML+CSS+JavaScript frontend and a PHP backend with a MySQL database. For the sake of submission, I branched off a version which uses a JSON file instead of the database. The dataset of contains an obfuscated version of the registration data for the latest tournament (names cut to initials, email addresses removed).

As the app uses a PHP backend, you need to run a PHP server to view it. In the hatmaker root directory, run `php -S localhost:8080` and then open your browser at [http://localhost:8080/teams/](http://localhost:8080/teams/).

## A note to the reviewer

I am curious if the latest version of the visualization can be easily understood by someone who is not familar with the kind of tournament it is intended to help with. All my feedback so far came from experts of the field. Thus I am afraid there might be a lack of explanation. I don't know where to start without cluttering up the visualization, so I am looking forward for your feedback and any suggestions for improvement.

The code for the submission is inside the directory `teams/`. As the code shares some code with the HATmaker project, I did not find a clean solution to submit this directory exclusively. I am sorry if that causes any inconvenience.

## Design

The team assignment app is used to manually group ~150 players with individual skill ratings into 12 teams. Ideally the resulting teams should have the same number of players with evenly distributed skills. To support the user in this task, the app needs to provide an intuitive way to change the assigment of players, while at the same time providing sufficient information about the resulting teams strengths and weaknesses.

Usually, the team assignment is done using a high resolution projector or multiple screens. As the screen would need to fit much information, I decided to split the assigment view from the detailed team summary. The former should focus on easy visibility of individual players, their skill sets and allow for manipulation of the assignment, whereas the latter faciliates creating evenly strong teams by providing visual clues about the distribution of skills within the teams.

For the first screen I decided to use drag and drop for grouping players into team columns instead of individual select forms for each players, as this would clutter up the screen immensely.

After getting feedback on a first version with simple colors, it turned out that the skills could not easily be distinguished, as the colors were too similar. Also, there was no distinction between players with high value and low value for a skill (e.g. fit and unfit players would have the same color for fitness). So I added a color scale to each skill. I selected the four color scales using color brewer (see resources) such that they were sufficiently different.

The screen was still cluttered up a lot, as there was too much information on each player card. Part of this I solved by adding a control to show the team name if need be (you don't want to have many players from the same home team in a HAT team) and hidding the name by default. Afterwards, obfuscating the player names killed two birds with one stone: The data got anonymized (for privacy regulations and to reduce bias induced by the person assigning the players) and the cards became evenly large, so that the number of players in a team now coincides with the optical size of the column.

Also I added an "order by" control such that the team assignment view already provides an insight about the distribution of skills over the teams, and a row showing the number of male and female players in each team.

The feedback from the assignment board showed that the assignment screen lacked comparability of the teams as a whole. Because the visualization was already complex, I decided to show a summary in a separate window. This would show the average and bars indicating the min-max range for each team and each skill, subdivided by gender.

To keep the summary in sync with the assignment, it is periodically updated. This has a small but valuable side-effect: You can run the app on another browser and you get a kind-of live-stream for free.

I decided reuse the color-hue from the first visualization so that the skills have the same base color. To improve the readability, I added hover labels to the bars.

Finally, when reviewing the app myself after the project paused while I cleared my mind during vacation, I felt that the summary visualization could be improved by adding colors to columns, so that the skill sets of each team can be visually matched with each other. Also, to improve the look and feel, I added some eye-candy like interactive hover effects and transitions which hint what effects the drag and drop actions will have.

After receiving the feedback on the first submitted version, I realized that the tool and its two visualizations cannot be easily understood by someone who is not familar with the tournament format, the sport of Ultimate Frisbee and the HATMaker tool. I remembered having seem nice click-through tutorials when my favorite apps release new feature sets and found that these are called "Popovers". I restructured the HTML and Javascript so that I could include Bootstrap's Popovers into my visualizations and also added two modals for introductory information.

## Resources

[ColorBrewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3) for selecting distinctive color scales for the different skills.

[Stackoverflow](https://stackoverflow.com/questions/51650427/send-post-request-in-d3-with-d3-fetch) as usual, was the most important source for help.

[Scott Murray's Blog posts on D3](http://alignedleft.com/tutorials/d3/binding-data) and [Dashing D3js](https://www.dashingd3js.com/binding-data-to-dom-elements) helped a lot.

I have been using [Twitter's Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) for GUI components before and started to use version 4 and some new features for this project.

The hands-on demo of [Dragula](https://bevacqua.github.io/dragula/) inspired me to use drag and drop as a core feature of the interactive visualization. To cite the author: "drag and drop so simple it hurts".
