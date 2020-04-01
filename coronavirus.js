$(document).ready(function() {
    //alert("suh");
    $.ajax({
        url: "https://api.covid19api.com/summary",
        type: "GET",
        success: function(result) {
            //alert();
            console.log(result);
            // _.each(result.Countries, function(country) {
            //     $("#countries").append("<div>" + country.Country + "</div>");
            // })
            var dataSet = [];
            var slugsDone = [];
            _.each(result.Countries, function(country) {
                if (!(slugsDone.includes(country.Slug))) {
                    dataSet.push({
                        "Country": country.Country,
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
                columns: [
                    { "title": 'Country', data: 'Country'},
                    { "title":'New Cases', data: 'NewConfirmed' },
                    { "title": 'Total Cases', data: 'TotalConfirmed' },
                    { "title": 'New Deaths', data: 'NewDeaths' },
                    { "title": 'Total Deaths', data: 'TotalDeaths' },
                    { "title": 'New Recovered', data: 'NewRecovered' },
                    { "title": 'Total Recovered', data: 'TotalRecovered' }
                ]
            });
        }
      });
});