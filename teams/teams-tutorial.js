var teamsTutorialIsActive = false;
var currentPopover = -1;
var popovers;

function addPopovers() {
    currentPopover = -1;
    popovers = [];
    popovers.push($("#team_assignment_table").popover({
        placement: "top", trigger: "manual", template: popoverTemplate,
        title: "Step 1",
        content: "team columns, d&amp;d"
    }));
    popovers.push($("#player618").popover({
        placement: "right", trigger: "manual", template: popoverTemplate,
        title: "Step 2 (player cards)",
        content: ", gender-dependent background color, lets have a look into those breadcrumbs below ..."
    }));
    popovers.push($("#player618 > div.row-fluid").popover({
        placement: "left", trigger: "manual", template: popoverTemplate,
        title: "Step 2 (player cards - detail)",
        content: "Each player assessed his own properties and skills during registration. Hover over the individual fields to see what they encode."
    }));
    popovers.push($("div#player752").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate,
        title: "Step 3",
        content: "column height = number of players per team"
    }));
    popovers.push($("#summary-container-4").popover({
        placement: "top", trigger: "manual", template: popoverTemplate,
        title: "Step 4",
        content: "number of players per gender"
    }));
    popovers.push($("#controlsLeft").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate,
        title: "Step 5",
        content: "control panel: order by, show/hide information, ..."
    }));
    popovers.push($("#showSummaryButton").popover({
        placement: "right", trigger: "manual", template: popoverTemplate,
        title: "Step 6",
        content: "Show summary now..."
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

