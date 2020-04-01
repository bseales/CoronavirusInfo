$(document).ready(function() {
    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        success: function(result) {
            console.log(result);
            var dataSet = [];
            var slugsDone = [];
            var countrySlugToName = {};
            var lineChart;
            _.each(result.Countries, function(country) {
                if (!(slugsDone.includes(country.Slug)) && country.Slug != "") {
                    countrySlugToName[country.Slug] = country.Country;
                    $("#chartCountrySelect").append("<option value='" + country.Slug + "'>" + (country.Country == "US" ? "United States" : country.Country) + "</option>")

                    dataSet.push({
                        "Country": country.Country == "US" ? "United States" : country.Country,
                        "NewConfirmed": Number(country.NewConfirmed).toLocaleString(),
                        "TotalConfirmed": Number(country.TotalConfirmed).toLocaleString(),
                        "NewDeaths": Number(country.NewDeaths).toLocaleString(),
                        "TotalDeaths": Number(country.TotalDeaths).toLocaleString(),
                        "NewRecovered": Number(country.NewRecovered).toLocaleString(),
                        "TotalRecovered": Number(country.TotalRecovered).toLocaleString()
                    });
                    slugsDone.push(country.Slug);
                }
                
            })
            $('#countries').DataTable( {
                data: dataSet,
                "order": [[ 2, "desc" ]],
                columns: [
                    { "title": 'Country', data: 'Country' },
                    { "title":'New Cases', data: 'NewConfirmed', "orderSequence": [ "desc", "asc"]  },
                    { "title": 'Total Cases', data: 'TotalConfirmed', "orderSequence": [ "desc", "asc"]  },
                    { "title": 'New Deaths', data: 'NewDeaths', "orderSequence": [ "desc", "asc"]  },
                    { "title": 'Total Deaths', data: 'TotalDeaths', "orderSequence": [ "desc", "asc"]  },
                    { "title": 'New Recovered', data: 'NewRecovered', "orderSequence": [ "desc", "asc"]  },
                    { "title": 'Total Recovered', data: 'TotalRecovered', "orderSequence": [ "desc", "asc"]  }
                ]
            });

            var countryConfirmed = [];
            var countryRecovered = [];
            var countryDied = [];

            function graphByCountry(countryCode, countryName) {
                $.ajax({
                    url: "https://api.covid19api.com/total/country/" + countryCode + "/status/deaths",
                    type: "GET",
                    success: function(result) {
                        countryDied = result;
                        $.ajax({
                            url: "https://api.covid19api.com/total/country/" + countryCode + "/status/confirmed",
                            type: "GET",
                            success: function(result1) {
                                countryConfirmed = result1;
                                $.ajax({
                                    url: "https://api.covid19api.com/total/country/" + countryCode + "/status/recovered",
                                    type: "GET",
                                    success: function(result2) {
                                        countryRecovered = result2;
    
                                        var labels = [];
                                        _.each(countryConfirmed, function(confirmed) {
                                            labels.push(confirmed.Date.substring(0,10))
                                        });
    
                                        var confirmedNums = [];
                                        _.each(countryConfirmed, function(confirm) {
                                            confirmedNums.push(confirm.Cases);
                                        });
    
                                        var recoveredNums = [];
                                        _.each(countryRecovered, function(recover) {
                                            recoveredNums.push(recover.Cases);
                                        });
    
                                        var diedNums = [];
                                        _.each(countryDied, function(died) {
                                            diedNums.push(died.Cases);
                                        });
    
                                        lineChart = new Chart(document.getElementById("line-chart"), {
                                            type: 'line',
                                            data: {
                                              labels: labels,
                                              datasets: [
                                                {
                                                    data: confirmedNums,
                                                    label: "Cases",
                                                    borderColor: "#3e95cd",
                                                    fill: false
                                                },
                                                { 
                                                  data: diedNums,
                                                  label: "Died",
                                                  borderColor: "#FF0000",
                                                  fill: false
                                                }, { 
                                                  data: recoveredNums,
                                                  label: "Recovered",
                                                  borderColor: "#3cba9f",
                                                  fill: false
                                                }, 
                                              ]
                                            },
                                            options: {
                                              title: {
                                                display: true,
                                                text: countryName
                                              }
                                            }
                                          });
                                    }
                                })
                            }
                        })
                    }
                })
            }

            // Could update this to get all states on page load later to make it faster.
            function graphByState(state, stateName) {
                var statesNames = {
                    "AL": "Alabama",
                    "AK": "Alaska",
                    "AS": "American Samoa",
                    "AZ": "Arizona",
                    "AR": "Arkansas",
                    "CA": "California",
                    "CO": "Colorado",
                    "CT": "Connecticut",
                    "DE": "Delaware",
                    "DC": "District Of Columbia",
                    "FM": "Federated States Of Micronesia",
                    "FL": "Florida",
                    "GA": "Georgia",
                    "GU": "Guam",
                    "HI": "Hawaii",
                    "ID": "Idaho",
                    "IL": "Illinois",
                    "IN": "Indiana",
                    "IA": "Iowa",
                    "KS": "Kansas",
                    "KY": "Kentucky",
                    "LA": "Louisiana",
                    "ME": "Maine",
                    "MH": "Marshall Islands",
                    "MD": "Maryland",
                    "MA": "Massachusetts",
                    "MI": "Michigan",
                    "MN": "Minnesota",
                    "MS": "Mississippi",
                    "MO": "Missouri",
                    "MT": "Montana",
                    "NE": "Nebraska",
                    "NV": "Nevada",
                    "NH": "New Hampshire",
                    "NJ": "New Jersey",
                    "NM": "New Mexico",
                    "NY": "New York",
                    "NC": "North Carolina",
                    "ND": "North Dakota",
                    "MP": "Northern Mariana Islands",
                    "OH": "Ohio",
                    "OK": "Oklahoma",
                    "OR": "Oregon",
                    "PW": "Palau",
                    "PA": "Pennsylvania",
                    "PR": "Puerto Rico",
                    "RI": "Rhode Island",
                    "SC": "South Carolina",
                    "SD": "South Dakota",
                    "TN": "Tennessee",
                    "TX": "Texas",
                    "UT": "Utah",
                    "VT": "Vermont",
                    "VI": "Virgin Islands",
                    "VA": "Virginia",
                    "WA": "Washington",
                    "WV": "West Virginia",
                    "WI": "Wisconsin",
                    "WY": "Wyoming"
                }
                $.ajax({
                    url: "https://covidtracking.com/api/states/daily?state=" + state,
                    type: "GET",
                    success: function(result) {
                        var labels = [];
                        var cases = [];
                        var deaths = [];
                        _.each(result, function(data) {
                            console.log(data);
                            labels.push(data["date"].toString().substring(0, 4) + "-" + data["date"].toString().substring(4,6) + "-" + data["date"].toString().substring(6))
                            cases.push(data["positive"]);
                            deaths.push(data["death"]);
                        });

                        labels.reverse();
                        cases.reverse();
                        deaths.reverse();

                        lineChart = new Chart(document.getElementById("line-chart"), {
                            type: 'line',
                            data: {
                              labels: labels,
                              datasets: [
                                {
                                    data: cases,
                                    label: "Cases",
                                    borderColor: "#3e95cd",
                                    fill: false
                                },
                                { 
                                  data: deaths,
                                  label: "Died",
                                  borderColor: "#FF0000",
                                  fill: false
                                },
                              ]
                            },
                            options: {
                              title: {
                                display: true,
                                text: statesNames[state]
                              }
                            }
                          });
                    }});
            }

            // Get the US Stats by default.
            graphByCountry("us", "United States");   
            $("#chartCountrySelect").val("us");
            
            // Set the onChange event for the country select dropdown.
            $("#chartCountrySelect").on('change', function() {
                lineChart.destroy();
                graphByCountry(this.value, countrySlugToName[this.value]);
            });

            $("#chartStateSelect").on("change", function() {
                if(this.value != "") {
                    lineChart.destroy();
                    console.log(this);
                    graphByState(this.value);
                }
            });
        }
      });
});