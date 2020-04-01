$(document).ready(function() {
    //alert("suh");
    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        success: function(result) {
            console.log(result);
            var dataSet = [];
            var slugsDone = [];
            _.each(result.Countries, function(country) {
                if (!(slugsDone.includes(country.Slug)) && country.Slug != "") {
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

            // Get the US Stats by default.
            $.ajax({
                url: "https://api.covid19api.com/total/country/italy/status/deaths",
                type: "GET",
                success: function(result) {
                    countryDied = result;
                    $.ajax({
                        url: "https://api.covid19api.com/total/country/italy/status/confirmed",
                        type: "GET",
                        success: function(result1) {
                            countryConfirmed = result1;
                            $.ajax({
                                url: "https://api.covid19api.com/total/country/italy/status/recovered",
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

                                    new Chart(document.getElementById("line-chart"), {
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
                                            text: 'Italy'
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
      });
});