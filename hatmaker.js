function showInitiallyHiddenElements() {
    d3.selectAll(".initially-hidden")
        .classed("initially-hidden", false);
};

function deactivateLoginControls() {
    d3.select("#inputUsername").property("disabled", true);
    d3.select("#inputPassword").property("disabled", true);
    d3.select("#loginButton").text("Refresh Summary");
};
