function computeSkillMetrics(leaves, skillName) {
    var sum = d3.sum(leaves, function (d) {
        return d[skillName];
    });
    var avg = d3.mean(leaves, function (d) {
        return d[skillName];
    });
    var min = d3.min(leaves, function (d) {
        return d[skillName];
    });
    var max = d3.max(leaves, function (d) {
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
            var width = 960, height = 500, rowHeight = 100, barWidth = 10, heightScale = 10, marginLeft = 40;
            barHeight = function (skill) {
                return (skill.max - skill.min) * heightScale;
            };
            createAvgMarkerPath = function (gender, skill, i) {
                var x0 = marginLeft + 24 * i;
                if (gender === "male") {
                    x0 += barWidth + 1;
                }
                var x1 = x0 + barWidth;
                var y = rowHeight - skill.avg * heightScale;
                return "M " + x0 + " " + y + " L " + x1 + " " + y;
            };
            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

            var nested = d3.nest()
                .key(function (d) {
                    return d.team;
                })
                .key(function (d) {
                    return d.gender.toLowerCase();
                })
                .rollup(aggregate_skills)
                .entries(data)
                .sort(function (a, b) {
                    return a.key - b.key;
                });
            console.log(nested);

            var skillGroup = svg.append("g")
                .attr("class", "gender-overview")
                .selectAll("g")
                .data(nested, function (d) {
                    return d.key;
                })
                .enter()
                .append("g")
                .each(function (d, i) {

                    // Gender.
                    d3.select(this)
                        .selectAll("circle")
                        .data(d.values)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            // debugger;
                            return marginLeft + 25 * i;
                        })
                        .attr("cy", function (d) {
                            // debugger;
                            if (d.key === "male") {
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

            var skill = "fitness";
            var skillGroup = svg.append("g")
                .attr("class", "skill-" + skill + "-overview")
                .selectAll("g")
                .data(nested, function (d) {
                    return d.key;
                })
                .enter()
                .append("g")
                .each(function (d, i) {
                    d3.select(this)
                        .selectAll("rect.bar-" + skill)
                        .data(d.values)
                        .enter()
                        .append("rect")
                        .attr("class", "bar-" + skill)
                        .attr("height", function (d) {
                            return barHeight(d.value[skill]);
                        })
                        .attr("width", barWidth)
                        .attr("x", function (d) {
                            var offset = marginLeft + 24 * i;
                            if (d.key === "male") {
                                offset += barWidth + 1;
                            }
                            return offset;
                        })
                        .attr("y", function (d) {
                            return rowHeight - barHeight(d.value[skill]) - d.value[skill].min * heightScale;
                        });

                    // Draw line for avg.
                    d3.select(this)
                        .selectAll("path")
                        .data(d.values)
                        .enter()
                        .append("path")
                        .attr("d", function (d) {
                            return createAvgMarkerPath(d.key, d.value[skill], i);
                        })
                        .attr("stroke", "red");
                });
            // Skill axis.
            // TODO(Jonas): Could use this to scale the whole thingy, instead of doing it manually above.
            var skillScale = d3.scaleLinear()
                .domain([0, 6])
                .range([rowHeight, rowHeight - 6 * heightScale]);
            var skillAxis = d3.axisLeft(skillScale)
                .ticks(7);
            skillGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + marginLeft + ", 0)")
                .call(skillAxis);
        });

    // TODO(Jonas): Align columns.
};

$(document).ready(function () {
    // registerEventHandlers();

    // TODO(Jonas): Enable periodic updates before going live.
    // d3.interval(function () {
    updateSummaryScreen();
    // }, 2000);
});
