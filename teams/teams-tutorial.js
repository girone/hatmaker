var teamsTutorialIsActive = false;
var currentPopover = -1;
var popovers;

function addPopovers() {
    currentPopover = -1;
    popovers = [];
    popovers.push($("#team_assignment_table").popover({
        placement: "top", trigger: "manual", template: popoverTemplate,
        title: "Team columns",
        content: "The main part of the screen shows twelve team columns."
    }));
    popovers.push($("#player618").popover({
        placement: "right", trigger: "manual", template: popoverTemplate,
        title: "Player cards",
        content: "Each player is represented by a draggable card. The card shows the player name and the data from the self-assessment. The player name has been shortened for privacy protection (European GDPR legislation applies). The background indicates the gender of the player. Some player names are highlighted. These are the so called locals. Each team has a local, which shows his team around the camping ground, the city and nearby bars between the tournament days. There is one local per team and thus they should not be moved to another team."
    }));
    popovers.push($("#player618 > div.row-fluid").popover({
        placement: "left", trigger: "manual", template: popoverTemplate,
        title: "Player cards (detail)",
        content: "Each player assessed his own properties and skills during registration. Hover over the individual fields to see what they encode. The four different skills use a color scale where higher intensity encodes higher values. The players are sorted by experience now. Note how that causes a gradient over the first skill in each team, which helps to assess the balance of the teams with regard to player experience. You will see how to order w.r.t. other skills later on."
    }));
    popovers.push($("div#player752").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate,
        title: "Players per team",
        content: "As the cards are stacked up, the height of the columns encodes the total number of players in each team."
    }));
    popovers.push($("#summary-container-4").popover({
        placement: "top", trigger: "manual", template: popoverTemplate,
        title: "Players per gender",
        content: "The current number of male and female players per team is shown below."
    }));
    popovers.push($("#team-container-0-male").popover({
        placement: "top", trigger: "manual", template: popoverTemplate,
        title: "Unassigned players",
        content: "On the bottom of the screen, there is space for players which have not yet been assigned to any team. As the tournament is in the past, this is empty."
    }));
    popovers.push($("#controlsRight").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate,
        title: "Credentials",
        content: "Normally, only admins from the organization committee can change the player assignment. When not signed in, you are only able to view the current assignment. This can been used to stream the assignment process to via the web."
    }));
    popovers.push($("#controlsLeft").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate,
        title: "View controls",
        content: "Here you can change the sort order of the players per team, which comes in helpful when balancing the strengths. Also the origin of each player can be shown. Finally, you can restart this tutorial at any later point and view the summary."
    }));
    popovers.push($("#showSummaryButton").popover({
        placement: "right", trigger: "manual", template: popoverTemplate,
        title: "Summary visualization",
        content: "Lets proceed with the summary window."
    }));
}

function startTeamsTutorial() {
    teamsTutorialIsActive = true;
    addPopovers();
    $("#teamTutorialEntrypoint").modal();
}

function endTeamsTutorial() {
    teamsTutorialIsActive = false;
}

// On each button click, hide the currently displayed popover and show the next one.
function tutorialNextStep() {
    if (currentPopover >= 0) {
        popovers[currentPopover].popover("hide");
    }
    currentPopover = currentPopover + 1;
    if (currentPopover >= popovers.length) {
        endTeamsTutorial();
        openSummaryWindow(true);
        return;
    }
    popovers[currentPopover].popover("show");
    if (currentPopover == 0) {
        return;  // Would break the optical flow otherwise.
    }
    popovers[currentPopover][0].scrollIntoView({ behavior: "smooth" });  // Not supported by all browsers yet.
}
