// Create hash of data. From
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;  // Convert to 32bit integer
    }
    return hash;
};

function updateGenderSummary(data) {
    // Group data by team and gender.
    var nested = d3.nest()
        .key(function (d) {
            return d.team;
        })
        .key(function (d) {
            return d.gender.toLowerCase();
        })
        .rollup(function (leaves) {
            return leaves.length;
        })
        .entries(data)
        .sort(function (a, b) {
            return a.key - b.key;
        });

    // Update number of players by gender for each team.
    for (var teamID = 1; teamID <= 12; ++teamID) {
        var summary = d3.select("div#summary-" + teamID);
        if (summary) {
            summary.remove();
        }
        summary = d3.select("div#summary-container-" + teamID)
            .append("div")
            .attr("id", "summary-" + teamID)
            .attr("class", "row");
        var index = teamID - 1;
        summary.append("div")
            .attr("class", "col summary-male male")
            .text(nested[index].values[0].value);
        summary.append("div")
            .attr("class", "col summary-female female")
            .text(nested[index].values[1].value);
    }
}

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

function key_func(d) {
    return d.player_index;
}

function populateTeamAssignmentTable(data) {
    // NOTE(Jonas): Alternatively, use d3.nest() here and/or d3.data(data, key_func), see Udacity examples.
    for (var i = 1; i <= 12; ++i) {
        populateTeamColumn(i, data);
    }
    populateTeamColumn(0, data, "male");
    populateTeamColumn(0, data, "female");
};

function getSortOrder() {
    return d3.select("#sort-order-select").node().value;
};

function populateTeamColumn(index, data, gender) {
    var columnID = index;
    if (index == 0 && gender) {
        columnID += "-" + gender;
    }

    // NOTE(Jonas): There is some indexing glitch here, exit() is always empty below.
    // Thus moved players are not removed. Maybe this is related to d3.filter() usage.
    // Workaround: Always clear the team column before binding data.
    var cards = d3.select("#team-container-" + columnID)
        .selectAll("div.player-card")
        .remove();
    var cards = d3.select("#team-container-" + columnID)
        .selectAll("div.player-card")
        .data(data, key_func);

    cards.exit().remove();

    var sortOrder = getSortOrder();

    var card = cards.enter()
        .filter(function (d) {
            if (!gender) {
                return d.team == index;
            }
            else {
                return d.team == index && d.gender.toLowerCase() == gender;
            }
        })
        .append("div")
        .attr("class", function (d) {
            return "card card-body player-card " + d.gender.toLowerCase();
        })
        .attr("id", function (d) {
            return "player" + d["player_index"];
        })
        .attr("style", function () {
            if (index == 0) {
                return getCustomUnassignedStyle();
            }
        })
        .sort(function (a, b) {  // NOTE: d3.sort must be called after appending/inserting a DOM node.
            // Skills: Descending.
            if (sortOrder === "experience") {
                return b.experience - a.experience;
            } else if (sortOrder === "throwing_skill") {
                return b.throwing_skill - a.throwing_skill;
            } else if (sortOrder === "fitness") {
                return b.fitness - a.fitness;
            } else if (sortOrder === "height") {
                return b.height - a.height;
            }
            // Position: Ascending.
            return a.team_position - b.team_position;
        })
    card.append("h2")
        .attr("class", "player-name")
        .attr("style", function (d) {
            if (d.is_captain) {
                return "font-style: italic; color: cornflowerblue;";
            }
        })
        .text(function (d) {
            return d.name;
        });
    card.append("div")
        .attr("class", "home-team")
        .classed("hidden", true)
        .text(function (d) {
            return d["origin"];
        });
    card.append("div")
        .attr("class", "hidden")
        .text(function (d) {
            var position = d["team_position"];
            if (position === null) {
                position = 0;
            }
            return position;
        });
    var skills = card.append("div")
        .attr("class", "row-fluid");
    skills.append("div")
        .attr("class", function (d) {
            return "col-3 skill skill-experience skill-experience-value-" + classifyExperience(d["experience"]);
        })
        .attr("title", "experience (years)")
        .style("color", function (d) {
            return decideFontColor(classifyExperience(d.experience));
        })
        .text(function (d) {
            return d["experience"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col-3 skill skill-throwing skill-throwing-value-" + d["throwing_skill"];
        })
        .style("color", function (d) {
            return decideFontColor(d.throwing_skill);
        })
        .attr("title", "throwing skill")
        .text(function (d) {
            return d["throwing_skill"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col-3 skill skill-fitness skill-fitness-value-" + d["fitness"];
        })
        .style("color", function (d) {
            return decideFontColor(d.fitness);
        })
        .attr("title", "fitness")
        .text(function (d) {
            return d["fitness"];
        });
    skills.append("div")
        .attr("class", function (d) {
            return "col-3 skill skill-height skill-height-value-" + classifyHeight(d["height"], d["gender"]);
        })
        .attr("title", "height (cms)")
        .style("color", function (d) {
            return decideFontColor(classifyHeight(d.height, d.gender));
        })
        .text(function (d) {
            return d["height"];
        });
};

// TODO(Jonas): Use the audit functions to correct input in bootstrap at registration time.
function auditPlayers(data) {
    data.forEach(function (player) {
        auditGender(player);
        auditExperience(player);
        auditThrowingSkill(player);
        auditFitness(player);
        auditHeight(player);
    });
    return data;
};

var VALID_GENDER_FORMAT = /(fe)?male/i;
var VALID_EXPERIENCE_FORMAT = /^[0-9]+(.[0-9]+)?$/;
var VALID_SKILL_FORMAT = /^[0-6]$/;
var VALID_HEIGHT_FORMAT = /^[1-2][0-9][0-9]$/;
var WICKED_FLOAT_PATTERN = /(\d+ )?(\d)\/(\d)/i;

function customParseFloat(value) {
    if (typeof value === "string" || value instanceof String) {
        value = value.replace(",", ".");
        var res = WICKED_FLOAT_PATTERN.exec(value);
        if (res) {
            value = parseFloat(res[1]) + parseFloat(res[2]) / parseFloat(res[3]);
        }
    }
    return parseFloat(value);
};

function parseNumber(value) {
    return customParseFloat(value);
};

function applyGeneralFormatAudit(value) {
    if (typeof value === "string" || value instanceof String) {
        value = value.replace(/\((Rooky|Mastermind)\)/, "");
        value = value.trim();
        value = parseNumber(value);
    }
    return value;
};

function auditGender(player) {
    var res = VALID_GENDER_FORMAT.exec(player.gender);
    if (!res) {
        console.log("Strange gender of player " + player.name + ": " + player.gender);
    }
};

function auditExperience(player) {
    player.experience = applyGeneralFormatAudit(player.experience);
    if (!VALID_EXPERIENCE_FORMAT.exec(player.experience)) {
        console.log("Strange experience for player " + player.name + ": " + player.experience);
    }
};

function auditThrowingSkill(player) {
    player.throwing_skill = applyGeneralFormatAudit(player.throwing_skill);
    if (!Number.isInteger(player.throwing_skill) || !VALID_SKILL_FORMAT.exec(player.throwing_skill)) {
        console.log("Strange throwing_skill for player " + player.name + ": " + player.throwing_skill);
    }
};

function auditFitness(player) {
    player.fitness = applyGeneralFormatAudit(player.fitness);
    if (!Number.isInteger(player.fitness) || !VALID_SKILL_FORMAT.exec(player.fitness)) {
        console.log("Strange fitness for player " + player.name + ": " + player.fitness);
    }
};

function auditHeight(player) {
    player.height = applyGeneralFormatAudit(player.height);
    var res = /[1-2],[0-9]{2}/.exec(player.height);
    if (res) {
        player.height = player.height.replace(",", ".") * 100;
    }
    if (player.height < 2.30 && 140 < player.height * 100 < 230) {
        player.height *= 100;
    }
    if (!VALID_HEIGHT_FORMAT.exec(player.height)) {
        console.log("Strange height for player " + player.name + ": " + player.height);
    }
};

function loadData(username, password) {
    if (!username) {
        username = d3.select("#inputUsername").node().value;
        password = d3.select("#inputPassword").node().value;
    }
    return d3.json("backend.php?action=fetchAll&obfuscate&user=" + username + "&pass=" + password)
        .then(function (data) {
            if (data.error && data.error === "Not authenticated.") {
                alert("Error: " + data.error);
                return false;
            }
            // Update view only if the data or the sort order changed.
            var newHash = JSON.stringify(data).hashCode();
            var newSortOrder = getSortOrder();
            if (newHash === lastDataHash && newSortOrder === lastSortOrder) {
                return true;
            }
            lastDataHash = newHash;
            lastSortOrder = newSortOrder;

            data = auditPlayers(data);
            populateTeamAssignmentTable(data);
            updateGenderSummary(data);
            return true;
        });
};

function toggleShowTeamName(checkbox) {
    d3.selectAll("div.home-team").classed("hidden", function () {
        if (checkbox.checked) {
            return false;
        } else {
            return true;
        }
    });
};

function updateTeamAndPosition(players) {
    var username = d3.select("#inputUsername").node().value;
    var password = d3.select("#inputPassword").node().value;
    d3.text("backend.php?action=updateTeamAssignment&user=" + username + "&pass=" + password, {
        method: "POST",
        body: "entry=" + JSON.stringify(players),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(function (data) {
        // console.log(data);
    });
};

function storeAssignmentFromTeamColumn(teamColumn) {
    var teamID = /team-container-([0-9]+)/.exec(teamColumn.id)[1];
    // For now, ignore changes of the team 0 aka unassigned.
    if (teamID == 0) {
        return;
    }
    var players = [];
    var position = 0;
    d3.select(teamColumn).selectAll(".player-card").each(function () {
        var playerIndex = /player([0-9]+)/.exec(this.id)[1];
        var isCaptain = d3.select(this).datum().is_captain;
        if (!isCaptain) {
            isCaptain = 0;
        }
        players.push({
            player_index: playerIndex,
            team: teamID,
            team_position: position,
            is_captain: isCaptain,
        });
        position++;
    });

    updateTeamAndPosition(players);
};

function resetCustomStyle(element) {
    d3.select(element).attr("style", "");
};

function getCustomUnassignedStyle() {
    return "display: inline-block; max-width: 16.666666%";
}

function openSummaryWindow() {
    window.open("summary.html", "window", "toolbar=no, menubar=no, resizable=yes");
};

function getTitle() {
    return "HATMaker (" + TOURNAMENT_TITLE + ") Team Assignment";
};

var lastDataHash = 0;
var lastSortOrder = "";

function registerEventHandlers() {
    d3.select("#loginButton").on("click", function () {
        if (enableDragAndDrop() && loadData()) {
            liveStreamEnabled = false;
            d3.select("#inputUsername").property("disabled", true);
            d3.select("#inputPassword").property("disabled", true);
            d3.select(this).text("Drag&Drop unlocked");
            showInitiallyHiddenElements();
        }
    });
};
