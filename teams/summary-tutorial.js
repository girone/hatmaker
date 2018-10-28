var currentPopover = -1;
var popovers;

function startSummaryTutorial() {
    $("#summaryTutorialEntrypoint").modal();

    // Create popovers only after the screen has finished loading.
    setTimeout(function () {
        addPopovers();
    }, 1000);
}

function endSummaryTutorial() {

}

function addPopovers() {
    currentPopover = -1;
    popovers = [];
    popovers.push($("g#container-experience").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Experience graph",
        content: "The first row compares the experience of the teams, measured in years."
    }));
    popovers.push($("g#container-experience > g > g > rect.bar-experience:first").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Experience range of team 1",
        content: "For example, the first two bars show the experience distribution for female and male players of team 1. The bars depict the range between minimum and maximum experience in years. The black horizontal line marks the experience mean."
    }));
    popovers.push($("g#container-throwing_skill").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Throwing skill graph",
        content: "This row shows the combined skills of each team when it comes to handling the disc, on a scale 0 to 6. The graph type is the same as before."
    }));
    popovers.push($("g#container-fitness").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Fitness level graph",
        content: "This one shows the self-assessed fitness level of the players. Again on a scale 0 to 6. Can you see which team has got that super-fast Aussie girl?"
    }));
    popovers.push($("g#container-height").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Player height graph",
        content: "Now the player height. This time the scale is centimeters. Note that there is more variance here, and that the graph reflects the difference between male and females average body height."
    }));
    popovers.push($("g#gender-histogram").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Gender histogram",
        content: "The final graph shows the gender distribution. Female and male players should be equally distributed over the teams."
    }));
    popovers.push($("#team-names-bottom").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Lets improve the balance...",
        content: "Now return to the assignment window and drag a player into another team. See how this affects the comparison visualization. In a perfect assignment, the bars on these graphs are almost equally sized. Now go and try to find a more balanced assignment..."
    }));
}

function tutorialNextStep() {
    if (currentPopover >= 0) {
        popovers[currentPopover].popover("hide");
    }
    currentPopover = currentPopover + 1;
    if (currentPopover >= popovers.length) {
        endSummaryTutorial();
        return;
    }
    popovers[currentPopover].popover("show");
}
