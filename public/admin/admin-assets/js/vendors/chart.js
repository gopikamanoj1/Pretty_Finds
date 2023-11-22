(function ($) {
    "use strict";

    // Initialize the chart data with empty arrays
    var initialData = {
        labels: [],
        datasets: [
            {
                label: 'Sales',
                tension: 0.2,
                fill: true,
                backgroundColor: 'rgba(44, 120, 220, 0.2)',
                borderColor: 'rgba(44, 120, 220)',
                data: []
            }
        ]
    };

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: initialData,
        options: {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            },
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    beginAtZero: true,
                }
            }
        }
    });

    function updateChart(newData) {
        chart.data.labels = Object.keys(newData);
        chart.data.datasets[0].data = Object.values(newData);
        chart.update();
    }

    function fetchData(url, successCallback) {
        $.ajax({
            type: 'POST',
            url: url,
            success: successCallback,
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }

    // Make an initial AJAX request to get the default data (monthly data)
    fetchData('/admin/fetchData/month', function (monthlyData) {
        updateChart(monthlyData);
    });

    $('#dailyButton').on('click', function () {
        fetchData('/admin/fetchData/week', function (dailyData) {
            updateChart(dailyData);
        });
    });

    $('#MonthlyButton').on('click', function () {
        fetchData('/admin/fetchData/month', function (monthlyData) {
            updateChart(monthlyData);
        });
    });

    $('#YearlyButton').on('click', function () {
        fetchData('/admin/fetchData/year', function (yearlyData) {
            updateChart(yearlyData);
        });
    });
})(jQuery);


