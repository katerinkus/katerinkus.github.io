function aggregateNeighbourhoodsByYear(neighbourhoods) {
    var data = {};

    for (n in neighbourhoods) {
        data[n] = data[n] || {};
        var household_count = 0;
        for (household in neighbourhoods[n]) {
            household_count++;
            for (year in neighbourhoods[n][household]) {
                data[n][year] = data[n][year] || {};
                for (cat in neighbourhoods[n][household][year]) {
                    data[n][year][cat] = data[n][year][cat] || {};
                    for (catType in neighbourhoods[n][household][year][cat]) {
                        data[n][year][cat][catType] = (data[n][year][cat][catType] || 0) + neighbourhoods[n][household][year][cat][catType];
                    }
                }
            }
        }

        for (year in data[n]) {
            for (c in data[n][year]) {
                for (cT in data[n][year][c]) {
                    console.log(data[n][year][c][cT], household_count);
                    data[n][year][c][cT] = data[n][year][c][cT] / household_count;
                }
            }
        }
    }

    return data;
}


function aggregateHouseholdsByYear(households) {
    var data = {};
    var household_count = 0;

    for (household in households) {
        household_count++;
        for (year in households[household]) {
            data[year] = data[year] || {};
            for (cat in households[household][year]) {
                data[year][cat] = data[year][cat] || {};
                for (catType in households[household][year][cat]) {
                    data[year][cat][catType] = (data[year][cat][catType] || 0) + households[household][year][cat][catType];
                }
            }
        }
    }

    for (year in data) {
        data[year]["totals"]["Planets"] = parseFloat((data[year]["totals"]["Planets"] / household_count).toFixed(2));
        data[year]["totals"]["Per Capita"] = parseFloat((data[year]["totals"]["Per Capita"] / household_count).toFixed(2));
    }

    return data;
}

function drawPlanet(household) {
    document.getElementById("household-planet-2018").style.height = 100 * household["2018"]["totals"]["Planets"] + "px";
    document.getElementById("household-planet-2017").style.height = 100 * household["2017"]["totals"]["Planets"] + "px";
    document.getElementById("planet-count-2018").innerHTML = household["2018"]["totals"]["Planets"] + " planets";
    document.getElementById("planet-count-2017").innerHTML = household["2017"]["totals"]["Planets"] + " planets";
}

function drawComparisonNeighbourhood(name, neighbourhood, allHhs) {
    var series = [];
    var data = {};

    for (year in neighbourhood) {
        var globaltotal = 0;
        var globalcount = 0;

        for (hh in allHhs) {
            for (person in allHhs[hh]) {
                globaltotal =
                    globaltotal +
                    allHhs[hh][person][year]["totals"]["Per Capita"];
                globalcount = globalcount + 1;
            }
        }

        data[year] = [
            parseFloat(neighbourhood[year]["totals"]["Per Capita"].toFixed(2)),
            parseFloat((globaltotal / globalcount).toFixed(2))
        ];
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("comparison", {
        chart: {
            type: "bar"
        },

        colors: ["#4bbd98", "#a1dbc6"],

        title: {
            text: "How does " + name + " footprint compare to others?",
            style: {
                color: "#4bbd98",
            }
        },

        xAxis: {
            categories: [
                name + " average",
                "Green Bloc neighbourhoods average"
            ],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: "Global hectares (gha)",
                align: "high"
            },
            labels: {
                overflow: "justify"
            }
        },
        tooltip: {
            valueSuffix: "gha"
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "top",
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
                "#FFFFFF",
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: series
    });
}

function drawComparisonHousehold(household, hhs, allHhs) {
    var series = [];
    var data = {};

    for (year in household) {
        var total = 0;
        var count = 0;
        for (person in hhs) {
            total = total + hhs[person][year]["totals"]["Per Capita"];
            count = count + 1;
        }

        var globaltotal = 0;
        var globalcount = 0;

        for (hh in allHhs) {
            for (person in allHhs[hh]) {
                globaltotal =
                    globaltotal +
                    allHhs[hh][person][year]["totals"]["Per Capita"];
                globalcount = globalcount + 1;
            }
        }

        data[year] = [
            parseFloat(household[year]["totals"]["Per Capita"].toFixed(2)),
            parseFloat((total / count).toFixed(2)),
            parseFloat((globaltotal / globalcount).toFixed(2))
        ];
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("comparison", {
        chart: {
            type: "bar"
        },

        colors: ["#4bbd98", "#a1dbc6"],

        title: {
            text: "How does your footprint compare to others?",
            style: {
                color: "#4bbd98",
            }
        },

        xAxis: {
            categories: [
                "You",
                "Your neighbourhood average",
                "Green Bloc neighbourhoods average"
            ],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: "Global hectares (gha)",
                align: "high"
            },
            labels: {
                overflow: "justify"
            }
        },
        tooltip: {
            valueSuffix: "gha"
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "top",
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
                "#FFFFFF",
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: series
    });
}

function drawTransportation(household) {
    var cats = [];
    var series = [];

    var data = {};

    for (year in household) {
        cats.push(year);

        for (param in household[year]["transportation"]) {
            var value = household[year]["transportation"][param];

            if (param in data) {
                data[param].push(value);
            } else {
                data[param] = [value];
            }
        }
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("transportation", {
        chart: {
            type: "bar"
        },

        colors: ["#cde6ee", "#acd6e2", "#6ebace"],

        title: {
            text: "Transportation footprint (gha)",
            style: {
                color: "#6ebace",
            }
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            min: 0,
            title: {
                text: "Total energy consumption"
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: "normal"
            }
        },
        series: series
    });
}

function drawBuilding(household) {
    var cats = [];
    var series = [];

    var data = {};

    for (year in household) {
        cats.push(year);

        for (param in household[year]["building"]) {
            var value = household[year]["building"][param];

            if (param in data) {
                data[param].push(value);
            } else {
                data[param] = [value];
            }
        }
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("building", {
        chart: {
            type: "bar"
        },

        colors: ["#d1d88f", "#b6c466", "#95b124"],

        title: {
            text: "Building footprint (gha)",
            style: {
                color: "#95b124",
            }
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            min: 0,
            title: {
                text: "Total energy consumption"
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: "normal"
            }
        },
        series: series
    });
}

function drawFood(household) {
    var cats = [];
    var series = [];

    var data = {};

    for (year in household) {
        data[year] = [];
        for (param in household[year]["food"]) {
            var value = household[year]["food"][param];

            cats.push(param);
            data[year].push(value);
        }
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("food", {
        chart: {
            type: "column"
        },

        colors: ["#bc5c83", "#ea98bd"],

        title: {
            text: "Food footprint (gha)",
            style: {
                color: "#bc5c83",
            }
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            min: 0,
            title: {
                text: "Total energy consumption"
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series
    });
}

function drawConsumables(household) {
    var cats = [];
    var series = [];

    var data = {};

    for (year in household) {
        cats.push(year);

        for (param in household[year]["consumables"]) {
            var value = household[year]["consumables"][param];

            if (param in data) {
                data[param].push(value);
            } else {
                data[param] = [value];
            }
        }
    }

    for (param in data) {
        series.push({
            name: param,
            data: data[param]
        });
    }

    Highcharts.chart("consumables", {
        chart: {
            type: "bar"
        },

        colors: ["gray", "#a0774d", "#c7b299", "#e6e6e6", "#f89c06", "#f4c484", "#f7e057"],

        title: {
            text: "Consumables footprint (gha)",
            style: {
                color: "#f89c06"
            }
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            min: 0,
            title: {
                text: "Total energy consumption"
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: "normal"
            }
        },
        series: series
    });
}

function drawSunburst(household) {
    var data = [{
        id: "0.0",
        parent: "",
        name: "Total Footprint"
    }];

    // TODO!!!
    var year = "2018";

    var catCount = 1;
    for (cat in household[year]) {
        if (cat == "totals") {
            continue;
        }

        data.push({
            id: "1." + catCount,
            parent: "0.0",
            name: cat
        });

        var catTypeCount = 1;
        for (catType in household[year][cat]) {
            data.push({
                id: catCount + 1 + "." + catTypeCount,
                parent: "1." + catCount,
                name: catType,
                value: household[year][cat][catType]
            });
            catTypeCount++;
        }
        catCount++;
    }

    Highcharts.chart("sunburst", {
        chart: {
            height: "100%"
        },

        colors: ["red", "#bc5c83", "#f89c06", "#6ebace", "#95b124", "yellow"],

        title: {
            text: "Total footprint at a glance",
            style: {
                color: "#4bbd98",
            }
        },
        series: [
            {
                type: "sunburst",
                data: data,
                allowDrillToNode: true,
                cursor: "pointer",
                dataLabels: {
                    format: "{point.name}",
                    filter: {
                        property: "innerArcLength",
                        operator: ">",
                        value: 16
                    }
                },
                levels: [
                    {
                        level: 1,
                        levelIsConstant: true,
                        color: "transparent"
                    },
                    {
                        level: 2,
                        colorByPoint: true,
                        dataLabels: {
                            rotationMode: "parallel"
                        }
                    },
                    {
                        level: 3,
                        colorVariation: {
                            key: "brightness",
                            to: -0.5
                        }
                    },
                    {
                        level: 4,
                        colorVariation: {
                            key: "brightness",
                            to: 0.5
                        }
                    }
                ]
            }
        ],
        tooltip: {
            headerFormat: "",
            pointFormat:
                "Footprint (gha) of <b>{point.name}</b> is <b>{point.value}</b>"
        }
    });
}

function drawOverview(household) {
    for (year in household) {
        var totals = {};
        for (cat in household[year]) {
            if (cat == "totals") {
                continue;
            }
            totals[cat] = 0;
            for (catType in household[year][cat]) {
                totals[cat] = totals[cat] + household[year][cat][catType];
            }
        }

        var seriesData = [];
        for (cat in totals) {
            seriesData.push({
                name: cat,
                y: totals[cat]
            });
        }

        Highcharts.chart("overview" + year, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie"
            },

            colors: ["#bc5c83", "#95b124", "#f89c06", "#6ebace"],

            title: {
                text: "Overview " + year,
                style: {
                    color: "#4bbd98",
                }
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "{point.percentage:.1f} %",
                        style: {
                            color:
                                (Highcharts.theme &&
                                    Highcharts.theme.contrastTextColor) ||
                                "black"
                        }
                    },
                    showInLegend: true
                }
            },
            series: [
                {
                    name: "Energy",
                    colorByPoint: true,
                    data: seriesData,
                    innerSize: '40%',
                }
            ]
        });
    }
}

function drawPlanets(data) {
    var cats = [];
    var totals = {};

    console.log(data);

    for (n in data) {
        totals[n] = [];
        for (year in data[n]) {
            cats.push(year);
            totals[n].push(data[n][year]["totals"]["Planets"]);
        }
    }

    var series = [];
    for (n in totals) {
        series.push({
            name: n,
            data: totals[n]
        });
    }

    Highcharts.chart("planets", {
        chart: {
            type: "column"
        },

        colors: ["#bc5c83", "#ea98bd"],

        title: {
            text: "Planet comparison",
            style: {
                color: "#bc5c83",
            }
        },
        xAxis: {
            categories: cats
        },
        yAxis: {
            min: 0,
            title: {
                text: "Avg planets required"
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series
    });
}

function drawGenericBarChart(divId, title, categories, yTitle, data) {
    Highcharts.chart(divId, {
        chart: {
            type: "column"
        },

        colors: ["#bc5c83", "#ea98bd"],

        title: {
            text: title,
            style: {
                color: "#bc5c83",
            }
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: yTitle
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data
    });
}

function drawCategoryComparisons(data) {
    var cats = {};
    for (n in data) {
        for (y in data[n]) {
            for (c in data[n][y]) {
                if (c === "totals") {
                    continue;
                }

                cats[c] = cats[c] || [];
                for (cT in data[n][y][c]) {
                    cats[c].push(cT);
                }
            }
        }
    }

    for (c in cats) {
        if (c === "totals") {
            continue;
        }
        for (cT in cats[c]) {
            var chartWrap = document.createElement("div");
            chartWrap.class = "chart";
            var chart = document.createElement("div");
            chart.id = "comparison-" + c + "-" + cats[c][cT];
            chartWrap.appendChild(chart);

            document.getElementById("compareAll").appendChild(chartWrap);

            var years = [];
            var totals = {};
            var series = [];

            for (n in data) {
                for (y in data[n]) {
                    years.push(y);
                    totals[n] = totals[n] || [];
                    totals[n].push(data[n][y][c][cats[c][cT]]);
                }
            }

            for (n in totals) {
                series.push({
                    name: n,
                    data: totals[n]
                });
            }

            drawGenericBarChart(
                "comparison-" + c + "-" + cats[c][cT],
                c + ": " + cats[c][cT],
                years,
                cT + " (gha)",
                series
            );
        }
    }
}

function drawCompareAll(data) {
    var aggregated = aggregateNeighbourhoodsByYear(data);
    drawPlanets(aggregated);
    drawCategoryComparisons(aggregated);
}

function drawRegularGraphs(data) {
    drawOverview(data);
    drawTransportation(data);
    drawBuilding(data);
    drawFood(data);
    drawConsumables(data);
    drawSunburst(data);
}

function drawAllGraphsNeighbourhood(name, neighbourhood, allHhs) {
    console.log(neighbourhood);
    drawRegularGraphs(neighbourhood);
    drawComparisonNeighbourhood(name, neighbourhood, allHhs);
}

function drawAllGraphsHousehold(household, hhs, allHhs) {
    drawRegularGraphs(household);
    drawComparisonHousehold(household, hhs, allHhs);
}
