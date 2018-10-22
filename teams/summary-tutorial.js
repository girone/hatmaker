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
        title: "Step 2",
        content: "skill rows, graph type, ..."
    }));
    popovers.push($("g#container-experience > g > g > rect.bar-experience:first").popover({
        placement: "bottom", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Step 2",
        content: "team 1, experience, bars show range min-to-max, horizontal line is average, separated for male and female players with same background as in main screen..."
    }));
    popovers.push($("g#container-throwing_skill").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Step 2",
        content: "skill rows, graph type, ..."
    }));
    popovers.push($("g#container-fitness").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Step 2",
        content: "skill rows, graph type, ..."
    }));
    popovers.push($("g#container-height").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Step 2",
        content: "skill rows, graph type, ..."
    }));
    popovers.push($("g#gender-histogram").popover({
        placement: "right", trigger: "manual", template: popoverTemplate, container: "body",
        title: "Step 2",
        content: "Gender histogram, ..."
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
