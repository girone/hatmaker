

function classifyExperience(experience) {
    return 0;
};

function classifyHeight(height) {
    return 0;
};

function populateTeamAssignmentTable(data) {
    var card = d3.select("#team-container-0")
        .selectAll("div.player-card")
        .data(data)
        .enter()
        .append("div")
        .attr("class", function (d) {
            return "card card-body player-card " + d["gender"].toLowerCase();
        });
    card.append("h2")
        .attr("class", "player-name")
        .text(function (d) {
            return d["name"];
        });
    card.append("div")
        .attr("class", "home-team")
        .text(function (d) {
            return d["origin"];
        });
    var skills = card.append("div")
        .attr("class", "row");
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-experience skill-value-" + classifyExperience(d["experience"]);
        })
        .text(function (d) {
            return d["experience"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-throwing skill-value-" + d["throwing_skill"];
        })
        .text(function (d) {
            return d["throwing_skill"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-fitness skill-value-" + d["fitness"];
        })
        .text(function (d) {
            return d["fitness"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-height skill-value-" + classifyHeight(d["height"]);
        })
        .text(function (d) {
            return d["height"];
        });
};

function loadData() {
    var username = d3.select("#inputUsername").node().value;
    var password = d3.select("#inputPassword").node().value;
    return d3.json("backend.php?action=fetchAll&user=" + username + "&pass=" + password)
        .then(function (data) {
            if (data.error && data.error === "Not authenticated.") {
                alert("Error: " + data.error);
                return false;
            }
            showInitiallyHiddenElements();
            populateTeamAssignmentTable(data);
            // updateSummary(data);
            return true;
        });
};

function getTitle() {
    return "HATMaker (" + TOURNAMENT_TITLE + ") Team Assignment";
};

function registerEventHandlers() {
    d3.select("#loginButton").on("click", function () {
        if (loadData()) {
            d3.select("#inputUsername").property("disabled", true);
            d3.select("#inputPassword").property("disabled", true);
            d3.select(this).text("Refresh Summary");
        }
    });
};

$(document).ready(function () {
    $("title").text(getTitle());
    $("h1").text(getTitle());
    registerEventHandlers();

    // Debug, remove later on:
    loadData();
});
