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
            var width = 960, height = 120, rowHeight = 100,
                bar = { width: 10, offset: 2, groupPadding: 4 },
                margin = { left: 50, },
                rowPadding = { top: 5, },
                circle = { radius: 5 };

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

            function horizontalOffset(teamIndex) {
                return teamIndex * (2 * (bar.width + bar.offset) + bar.groupPadding);
            }

            // TODO(Jonas): Some hover background highlight, and color background lightly according to gender.
            function drawTeamNames() {
                var svg = d3.selectAll("svg.team-names");
                svg.selectAll("g").remove();  // Clear old content.
                svg.attr("width", width)
                    .attr("height", height / 3);

                svg.selectAll("g")
                    .data(nested)
                    .enter()
                    .append("text")
                    .attr("x", function (d) {
                        return margin.left + horizontalOffset(d.key - 1) + 3;
                    })
                    .attr("dy", "1em")
                    .text(function (d) {
                        return d.key;
                    })
            }

            // Add team labels.
            drawTeamNames();

            function drawSkillSummaryGraph(skill) {

                var skillScale = d3.scaleLinear()
                    .domain(extent[skill])
                    .range([rowHeight, 0 + rowPadding.top]);

                barHeight = function (skill) {
                    return skillScale(skill.min) - skillScale(skill.max);
                };

                createAvgMarkerPath = function (gender, skill, i) {
                    var x1 = margin.left + horizontalOffset(i);
                    if (gender === "male") {
                        x1 += bar.width + bar.offset;
                    }
                    var x2 = x1 + bar.width;
                    var y = skillScale(skill.avg);
                    return "M " + x1 + " " + y + " L " + x2 + " " + y;
                };

                var svg = d3.select("svg#container-" + skill)
                    .attr("class", "skill-summary-container")
                    .attr("width", width)
                    .attr("height", height);
                svg.selectAll("g").remove();  // Clear existing content.
                svg = svg.append("g");

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
                            .attr("width", bar.width)
                            .attr("x", function (d) {
                                var offset = margin.left + horizontalOffset(i);
                                if (d.key === "male") {
                                    offset += bar.width + bar.offset;
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
            var svg = d3.select("svg#gender-histogram")
                .attr("width", width)
                .attr("height", height);
            svg.selectAll("g").remove();  // Clear existing content.
            svg.append("g")
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
                                        return margin.left + horizontalOffset(i) + (d.key === "male" ? (bar.width + bar.offset) : 0) + circle.radius;
                                    })
                                    .attr("cy", function () {
                                        return 20 + player * (circle.radius * 2 + bar.offset);
                                    })
                                    .attr("r", function () {
                                        return circle.radius;
                                    });
                            }
                        });
                });
        });
};

$(document).ready(function () {
    // registerEventHandlers();

    d3.interval(function () {
        updateSummaryScreen();
    }, 1000);
});
