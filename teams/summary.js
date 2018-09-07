function computeSkillMetrics(leaves, skillName) {
    var sum = d3.sum(leaves, function(d) {
        return d[skillName];
    });
    var avg = d3.mean(leaves, function(d) {
        return d[skillName];
    });
    var min = d3.min(leaves, function(d) {
        return d[skillName];
    });
    var max = d3.max(leaves, function(d) {
        return d[skillName];
    });

    return {
        sum: sum,
        min: min,
        avg: avg,
        max: max,
    };
};

function aggregate_skills(leaves) {
    return {
        experience: computeSkillMetrics(leaves, "experience"),
        throwing_skill: computeSkillMetrics(leaves, "throwing_skill"),
        fitness: computeSkillMetrics(leaves, "fitness"),
        height: computeSkillMetrics(leaves, "height"),
        count: leaves.length,
    };
};

function updateSummaryScreen() {
    d3.json("backend.php?action=fetchAll&user=readonly&pass=")
        .then(function (data) {
            if (data.error) {
                alert("Error: " + data.error);
                return false;
            }
            data = auditPlayers(data);

            // TODO(Jonas): Clear old graphs, or use enter() etc. to update.
            var width = 960, height = 500;
            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

            var nested = d3.nest()
                .key(function (d) {
                    return d.team;
                })
                .key(function(d) {
                    return d.gender.toLowerCase();
                })
                .rollup(aggregate_skills)
                .entries(data)
                .sort(function (a, b) {
                    return a.key - b.key;
                });
            console.log(nested);

            svg.append("g")
                .attr("class", "blub")
                .selectAll("g")
                .data(nested, function(d) {
                    return d.key;
                })
                .enter()
                .append("g")
                .each(function (d, i) {

                    d3.select(this)
                        .selectAll("circle")
                        .data(d.values)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            // debugger;
                            return 40 + 25 * i;
                        })
                        .attr("cy", function (d) {
                            // debugger;
                            if (d.key === "female") {
                                return 200;
                             } else {
                                 return 200 + 50;
                             }
                            })
                        .attr("r", function (d) {
                            // debugger;
                            return d.value.count;  // TODO(Jonas): consider area
                        })
                        .attr("class", function (d) {
                            // debugger;
                            return d.key;
                        });
                });
                // .filter(function (d) {
                //     return d.key === "female";
                // })


            // var summary = d3.select("div#summary-" + teamID);
            // if (summary) {
            //     summary.remove();
            // }
            // summary = d3.select("div#summary-container-" + teamID)
            //     .append("div")
            //     .attr("id", "summary-" + teamID)
            //     .attr("class", "row");
            // summary.append("div")
            //     .attr("class", "col summary-male male")
            //     .text(nested[0].value);
            // summary.append("div")
            //     .attr("class", "col summary-female female")
            //     .text(nested[1].value);
            // return true;
        });
};

$(document).ready(function () {
    // registerEventHandlers();

    // TODO(Jonas): Enable periodic updates before going live.
    // d3.interval(function () {
    updateSummaryScreen();
    // }, 2000);
});
