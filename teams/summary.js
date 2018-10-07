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
    d3.json("backend.php?action=fetchAll&user=readonly&pass=&obfuscate")
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

            var width = 960, height = 900,
                bar = { width: 10, offset: 2, groupPadding: 4 },
                margin = { left: 50, },
                row = { height: 120, padding: { top: 25, }, },
                circle = { radius: 5 },
                backgroundColumn = { opacity: 0.15, highlightOpacity: 0.3 };

            var verticalOffset = 0;

            d3.select("svg")
                .attr("width", width)
                .attr("height", height);

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

            function horizontalOffset(teamIndex) {
                return bar.groupPadding + teamIndex * (2 * (bar.width + bar.offset) + bar.groupPadding);
            }

            function drawTeamNames(id) {
                var svg = d3.selectAll("g#" + id);
                svg.attr("width", width)
                    .attr("height", row.height / 3);

                svg.selectAll("g").remove();  // Clear old content.

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
                    });

                svg.attr("transform", "translate(0 " + verticalOffset + ")");
                verticalOffset += row.height / 3;
            }

            // Add team labels.
            drawTeamNames("team-names-top");

            function drawSkillSummaryGraph(skill) {

                var skillScale = d3.scaleLinear()
                    .domain(extent[skill])
                    .range([row.height, 0 + row.padding.top]);

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

                var svg = d3.select("g#container-" + skill)
                    .attr("class", "skill-summary-container")
                    .attr("width", width)
                    .attr("height", row.height);

                svg.selectAll("g").remove();  // Clear existing content.
                var content = svg.append("g");

                var skillGroup = content.selectAll("g")
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
                            .attr("class", "bar bar-" + skill)
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
                content.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + ", 0)")
                    .call(skillAxis);
                // Text label for the y axis.
                content.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x", -75)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(skill);

                svg.attr("transform", "translate(0 " + verticalOffset + ")");
                verticalOffset += row.height + row.padding.top;
            };
            drawSkillSummaryGraph("experience");
            drawSkillSummaryGraph("throwing_skill");
            drawSkillSummaryGraph("fitness");
            drawSkillSummaryGraph("height");

            // Gender
            var svg = d3.select("g#gender-histogram")
                .attr("width", width)
                .attr("height", row.height);

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

            // Y axis label.
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", -75)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Players by gender");

            svg.attr("transform", "translate(0 " + verticalOffset + ")");
            verticalOffset += row.height + row.padding.top;

            function drawBackground() {
                var enterSelection = d3.select("g#background")
                    .selectAll("rect")
                    .data(nested)
                    .enter();

                var rectWidth = bar.width + bar.offset;

                function addRectangles(selection, cls, additionalXOffset) {
                    selection.append("rect")
                        .attr("x", function (d, i) {
                            return margin.left + bar.groupPadding + i * ((2 * rectWidth) + bar.groupPadding) + additionalXOffset;
                        })
                        .attr("y", row.height / 3)
                        .attr("width", rectWidth)
                        .attr("height", verticalOffset - row.height / 3)
                        .attr("class", function (d) {
                            return "background-column background-column-" + d.key + " " + cls;
                        })
                        .attr("opacity", backgroundColumn.opacity);
                }

                addRectangles(enterSelection, "female", 0);
                addRectangles(enterSelection, "male", rectWidth);

                // Add invisible boxes in the foreground for hover detection.
                var enterSelection = d3.select("g#hoverboxes")
                    .selectAll("rect")
                    .data(nested)
                    .enter();

                addRectangles(enterSelection, "hoverbox", 0);
                addRectangles(enterSelection, "hoverbox", rectWidth);
            }

            drawBackground();

            // Add bottom team labels.
            drawTeamNames("team-names-bottom");

            d3.select("svg").selectAll("rect.hoverbox").on("mouseover", function (d) {
                d3.selectAll("rect.background-column-" + d.key).attr("opacity", backgroundColumn.highlightOpacity);
            });
            d3.select("svg").selectAll("rect.hoverbox").on("mouseout", function (d) {
                d3.selectAll("rect.background-column-" + d.key).attr("opacity", backgroundColumn.opacity);
            });
        });
};

$(document).ready(function () {
    d3.interval(function () {
        updateSummaryScreen();
    }, 1000);
});
