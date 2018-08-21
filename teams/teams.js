

function classifyExperience(experienceInYears) {
    var level = 0;
    if (experienceInYears <= 1) {
        level = 1;
    } else if (experienceInYears <= 2) {
        level = 2;
    } else if (experienceInYears <= 3) {
        level = 3;
    } else if (experienceInYears <= 5) {
        level = 4;
    } else if (experienceInYears <= 8) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
};

function classifyHeight(heightInCms, gender) {
    var level = 0;
    if (gender == "Female") {
        if (heightInCms > 180) {
            level = 6;
        } else if (heightInCms > 175) {
            level = 5;
        } else if (heightInCms > 170) {
            level = 4;
        } else if (heightInCms > 165) {
            level = 3;
        } else if (heightInCms > 160) {
            level = 2;
        } else {
            level = 1;
        }
    } else {  // "Male"
        if (heightInCms > 200) {
            level = 6;
        } else if (heightInCms > 188) {
            level = 5;
        } else if (heightInCms > 182) {
            level = 4;
        } else if (heightInCms > 176) {
            level = 3;
        } else if (heightInCms > 170) {
            level = 2;
        } else {
            level = 1;
        }
    }
    return level;
};

function decideFontColor(value) {
    if (value > 3) {
        return "#efefef";
    } else {
        return "#4f4f4f";
    }
};

function populateTeamAssignmentTable(data) {
    for (var i = 0; i <= 12; ++i) {
        populateTeamColumn(i, data);
    }
};

function populateTeamColumn(index, data) {
    var card = d3.select("#team-container-" + index)
        .selectAll("div.player-card")
        .data(data)
        .enter()
        .filter(function (d) {
            return d["team"] == index;
        })
        .append("div")
        .attr("class", function (d) {
            return "card card-body player-card " + d["gender"].toLowerCase();
        })
        .attr("id", function (d) {
            return "player" + d["player_index"];
        })
        .sort(function (a, b) {  // NOTE: d3.sort must be called after appending/inserting a DOM node.
            return a.team_position - b.team_position;
        })
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
    card.append("div")
        .attr("class", "hidden-team-position")
        .text(function (d) {
            var position = d["team_position"];
            if (position === null) {
                position = 0;
            }
            return position;
        });
    var skills = card.append("div")
        .attr("class", "row");
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-experience skill-experience-value-" + classifyExperience(d["experience"]);
        })
        .style("color", function (d) {
            return decideFontColor(classifyExperience(d.experience));
        })
        .text(function (d) {
            return d["experience"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-throwing skill-throwing-value-" + d["throwing_skill"];
        })
        .style("color", function (d) {
            return decideFontColor(d.throwing_skill);
        })
        .text(function (d) {
            return d["throwing_skill"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-fitness skill-fitness-value-" + d["fitness"];
        })
        .style("color", function (d) {
            return decideFontColor(d.fitness);
        })
        .text(function (d) {
            return d["fitness"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col skill skill-height skill-height-value-" + classifyHeight(d["height"], d["gender"]);
        })
        .style("color", function (d) {
            return decideFontColor(classifyHeight(d.height));
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
