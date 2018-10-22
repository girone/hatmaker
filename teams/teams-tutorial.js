function showTutorialStartModal() {
    $("#tutorialEntrypoint").modal();
}

function tutorialStep(stepNumber) {
    if (stepNumber > 0) {
        $("#tutorialStepPopover-" + (stepNumber - 1)).popover("dispose");  // try "hide", "toggle"
    }
    $("#tutorialStepPopover-" + stepNumber).popover("show");
}
