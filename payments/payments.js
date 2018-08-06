"use strict";

// TODO(Jonas): Rewrite this even more data driven: On input, change the data and redraw(), instead of chaning the HTML.

var timeFormat = d3.timeFormat("%Y-%m-%d %H:%M:%S");

function populatePlayerList(data) {
    var card =
        d3.select("#player_list")
            .selectAll("div.card")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "card mb-2")
            .attr("id", function (d) {
                return "player_" + d["player_index"];
            });

    var card_body =
        card.append("div")
            .attr("class", "card-body")
            .append("div")
            .attr("class", "row");

    var left_part =
        card_body.append("div")
            .attr("class", "col");

    var header =
        left_part.append("h3")
            .attr("class", "card-title")
            .text(function (d) {
                return d["name"];
            });

    left_part.append("p")
        .attr("class", "card-text text-muted")
        .text(function (d) {
            return "Home team: " + d["origin"];
        });
    left_part.append("p")
        .attr("class", "card-text text-muted")
        .text(function (d) {
            return "Registered at " + d["time"];
        });

    var center_part =
        card_body.append("div")
            .attr("class", "col");

    var status_input_group = center_part.append("div")
        .attr("class", "input-group");

    status_input_group.append("div")
        .attr("class", "input-group-prepend")
        .append("label")
        .attr("class", "input-group-text")
        .attr("for", function (d) {
            return "selectPaymentStatus_" + d["player_index"];
        })
        .text("Payment status")

    var select = status_input_group.append("select")
        .attr("class", "custom-select")
        .attr("id", function (d) {
            return "selectPaymentStatus_" + d["player_index"];
        });

    select.append("option")
        .attr("value", "not paid")
        .text("Not paid")
        .property("selected", function (d) {
            return d.status === "not paid";
        });
    select.append("option")
        .attr("value", "paid")
        .text("Paid")
        .property("selected", function (d) {
            return d.status === "paid";
        });
    select.append("option")
        .attr("value", "no fee")
        .text("Disconnection (no fee)")
        .property("selected", function (d) {
            return d.status === "no fee";
        });
    select.append("option")
        .attr("value", "reimbursed")
        .text("Reimbursed")
        .property("selected", function (d) {
            return d.status === "reimbursed";
        });
    select.append("option")
        .attr("value", "other")
        .text("Other")
        .property("selected", function (d) {
            return d.status === "other";
        });

    select.on("change", function (player) {
        triggerPlayerUpdate(player);
        // TODO(Jonas): Update summary accordingly.
        // updateSummary(data) -- I guess this is way easier if the whole thing
        // is more data driven (e.g. single player updates update the data,
        // not the view directly.)
        // Workaround: Set Login-Button to "Refresh Summary" after login.
    });

    center_part.append("div")
        .attr("class", "form-group")
        .append("textarea")
        .attr("class", "form-control")
        .attr("rows", 2)
        .attr("id", function (d) {
            return "notes_" + d["player_index"];
        })
        .text(function (d) {
            if (d["notes"]) {
                return d["notes"];
            }
        }).on("change", function (player) {
            triggerPlayerUpdate(player);
        });

    var right_part =
        card_body.append("div")
            .attr("class", "col");

    right_part.append("p")
        .attr("style", "display: none")
        .attr("id", function (d) {
            return "old_status_" + d["player_index"];
        })
        .text(function (d) {
            return d["status"];
        });

    right_part.append("p")
        .attr("class", "card-text text-muted")
        .attr("id", function (d) {
            return "change_info_" + d["player_index"];
        })
        .text(function (d) {
            if (d["last_author"]) {
                return "Last change: " + d["last_change"] + " (" + d["last_author"] + ")";
            }
        });

    right_part.append("p")
        .attr("class", "card-text text-muted")
        .attr("id", function (d) {
            return "confirmation_date_" + d["player_index"];
        })
        .text(function (d) {
            if (d["confirmation_date"]) {
                return "Payment confirmed: " + d["confirmation_date"];
            }
        });

    right_part.append("p")
        .attr("class", "card-text text-muted")
        .attr("id", function (d) {
            return "reimburse_date_" + d["player_index"];
        })
        .text(function (d) {
            if (d["reimburse_date"]) {
                return "Payment reimbursed: " + d["reimburse_date"];
            }
        });
};

function updateSummary(data) {
    // Create SVG placeholder, delete old if there is one.
    var chart = d3.select("div#summary").select("svg");
    if (chart) {
        chart.remove();
    }
    var svg = d3.select("div#summary")
        .append("svg")
        .attr("class", "col-md");

    // Aggregate data.
    var nested = d3.nest()
        .key(function (d) {
            return d["status"];
        })
        .rollup(function (v) {
            return v.length;
        })
        .entries(data);

    console.log(nested);

    var chartData = [];
    nested.forEach(function (keyValue, index) {
        chartData.push({ "Status": keyValue.key, "Count": keyValue.value });
    });

    // Create chart.
    var chart = new dimple.chart(svg, chartData);
    chart.addMeasureAxis("x", "Count");
    chart.addCategoryAxis("y", "Status");
    chart.addSeries("Status", dimple.plot.bar);
    chart.draw();
};

function showInitiallyHiddenElements() {
    d3.selectAll(".initiallyHidden")
        .attr("class", "");
};

function deactivateLoginControls() {
    d3.select("#inputUsername").property("disabled", true);
    d3.select("#inputPassword").property("disabled", true);
    d3.select("#loginButton").text("Refresh Summary");
};

function triggerPlayerUpdate(player) {
    setSaveStatus(player.player_index, "progress");

    var newPlayer = extractPlayerData(player);

    if (storeData(newPlayer)) {
        setSaveStatus(newPlayer.player_index, "saved");
        setChangeInfo(newPlayer);
    } else {
        setSaveStatus(newPlayer.player_index, "error");
    };
};

function setSaveStatus(id, status) {
    // TODO(Jonas): Rather/also use the card border to indicate changes.
    var button = d3.select("#saveStatus_" + id);
    if (status === "error") {
        button.attr("class", "btn btn-error")
            .text("Error");
    } else if (status === "progress") {
        button.attr("class", "btn btn-primary")
            .text("Saving...");
    } else if (status === "saved") {
        button.attr("class", "btn btn-success")
            .text("Saved");
    }
};

function setChangeInfo(player) {
    d3.select("p#change_info_" + player.player_index)
        .text("Last change: " + player.last_change + " (" + player.last_author + ")");

    if (player.confirmation_date) {
        d3.select("p#confirmation_date_" + player.player_index)
            .text("Payment confirmed: " + player.confirmation_date);
    }

    if (player.reimburse_date) {
        d3.select("p#reimburse_date_" + player.player_index)
            .text("Payment reimbursed: " + player.reimburse_date);
    }
};

function getAuthor() {
    return d3.select("#inputUsername").node().value;
};

function now() {
    return timeFormat(new Date());
};

function extractPlayerData(player) {
    var cardID = "player_" + player.player_index;
    var card = d3.select("div.card#" + cardID);
    var newStatus = card.select("#selectPaymentStatus_" + player.player_index).node().value;
    var newNotes = card.select("#notes_" + player.player_index).node().value;
    var newPlayer = {
        "player_index": player.player_index,
        "name": player.name,
        "status": newStatus,
        "notes": newNotes,
        "last_change": now(),
        "last_author": getAuthor(),
    };

    if (newPlayer.status === "paid" && player.status !== "paid") {
        newPlayer.confirmation_date = now();
    }
    if (newPlayer.status === "reimbursed" && player.status !== "reimbursed") {
        newPlayer.reimburse_date = now();
    }
    return newPlayer;
};

function storeData(playerData) {
    console.log(playerData);
    var username = d3.select("#inputUsername").node().value;
    var password = d3.select("#inputPassword").node().value;
    var request = d3.text("backend.php?action=store&user=" + username + "&pass=" + password, {
        method: "POST",
        body: "entry=" + JSON.stringify(playerData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(function (data) {
        console.log(data);
    });
    return true;
};

function loadData() {
    var username = d3.select("#inputUsername").node().value;
    var password = d3.select("#inputPassword").node().value;
    d3.json("backend.php?action=fetchAll&user=" + username + "&pass=" + password)
        .then(function (data) {
            if (data.error && data.error === "Not authenticated.") {
                alert("Error: " + data.error);
            } else {
                showInitiallyHiddenElements();
                populatePlayerList(data);
                updateSummary(data);
                deactivateLoginControls();
            }
        }, function (error) {
            alert("Unexpected error: " + error);
        });
};

function getTitle() {
    return "HATMaker (" + TOURNAMENT_TITLE + ") Payments Management";
};

function registerEventHandlers() {
    d3.select("#loginButton").on("click", function () {
        loadData();
    });
};

$(document).ready(function () {
    $("title").text(getTitle());
    $("h1").text(getTitle());
    registerEventHandlers();
});
