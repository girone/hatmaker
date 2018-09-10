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

            var extent = {
                experience: d3.extent(data, function (d) {
                    return d.experience;
                }),
                height: d3.extent(data, function (d) {
                    return d.height;
                }),
                throwing_skill: [0, 6],
                fitness: [0, 6],
            };

            // TODO(Jonas): Clear old graphs, or use enter() etc. to update.
            var width = 960, height = 120, rowHeight = 100, barWidth = 10, heightScale = 10, margin = { left: 50, }, rowPadding = { top: 5, };

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

            // TODO(Jonas): Add team number as headlines, and some hover background highlight, and color background lightly according to gender.

            function drawSkillSummaryGraph(skill) {

                var skillScale = d3.scaleLinear()
                    .domain(extent[skill])
                    .range([rowHeight, 0 + rowPadding.top]);

                barHeight = function (skill) {

                    return skillScale(skill.min) - skillScale(skill.max);
                };
                createAvgMarkerPath = function (gender, skill, i) {
                    var x1 = margin.left + 24 * i;
                    if (gender === "male") {
                        x1 += barWidth + 1;
                    }
                    var x2 = x1 + barWidth;
                    var y = skillScale(skill.avg);
                    return "M " + x1 + " " + y + " L " + x2 + " " + y;
                };

                var svg = d3.select("body")
                    .append("div")
                    .attr("class", "skill-summary-container container-" + skill)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g");

                var skillGroup = svg.selectAll("g")
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
                                var offset = margin.left + 24 * i;
                                if (d.key === "male") {
                                    offset += barWidth + 1;
                                }
                                return offset;
                            })
                            .attr("y", function (d) {
                                return skillScale(d.value[skill].max);
                            });

                        // Draw vertical line for avg.
                        d3.select(this)
                            .selectAll("path")
                            .data(d.values)
                            .enter()
                            .append("path")
                            .attr("d", function (d) {
                                return createAvgMarkerPath(d.key, d.value[skill], i);
                            })
                            .attr("stroke", "#333333");
                    });
                // Skill axis.
                var skillAxis = d3.axisLeft(skillScale)
                    .ticks(7);
                skillGroup.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + ", 0)")
                    .call(skillAxis);
                // Text label for the y axis.
                skillGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x", -55)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(skill);
            };
            drawSkillSummaryGraph("experience");
            drawSkillSummaryGraph("throwing_skill");
            drawSkillSummaryGraph("fitness");
            drawSkillSummaryGraph("height");

            // Gender
            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("class", "gender-overview")
                .selectAll("g")
                .data(nested, function (d) {
                    return d.key;
                })
                .enter()
                .append("g")
                .each(function (d, i) {
                    d3.select(this)
                        .selectAll("circle")
                        .data(d.values)
                        .enter()
                        .each(function (d, j) {
                            for (var player = 0; player < d.value.count; ++player) {
                                d3.select(this)
                                    .append("circle")
                                    .attr("class", function (d) {
                                        return d.key;
                                    })
                                    .attr("cx", function (d) {
                                        return margin.left + 25 * i + (d.key === "male" ? barWidth : 0);
                                    })
                                    .attr("cy", function () {
                                        return 20 + player * 10;
                                    })
                                    .attr("r", function () {
                                        return 5;
                                    });
                            }
                        });
                });
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
