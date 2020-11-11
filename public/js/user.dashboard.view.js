class UserDashboardView {

  constructor() {

    this._data = {
      stat_one: [],
      stat_two: []
    }
  }


  refresh_stat_one(userData, isAccountUser) {

    var labels = [], data_map = {}, dataTotals = [], colors = [];

    if (isAccountUser) {
      // account user by company 
      userData.forEach(async u => {
        if (u.company_name in data_map)
          data_map[u.company_name]++
        else
          data_map[u.company_name] = 1
      });
    }else{
        //project users by what ...?
        //..... ????   
   }

    for (var d in data_map) {
      labels.push(d);
      dataTotals.push(data_map[d]);
      colors.push(this.random_rgba())
    }

    var chartData = {
      datasets: [{
        data: dataTotals,
        backgroundColor: colors
      }],
      labels: labels
    };

    var config = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        title: {
          display: true,
          text: 'Users By Company'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        legend: {
          display: true
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'center'
          }
        }
      }
    }

    var canvas = document.getElementById('stat_one');
    var ctx = canvas.getContext('2d');
    var stat_one = new Chart(ctx, config);
    stat_one.update();
  }

  refresh_stat_two(userData, isAccountUser) {

    var labels = [], data_map = {}, dataTotals = [], colors = [];

    if (isAccountUser) {
    // account user by country

      userData.forEach(async u => {
        if (u.country in data_map)
          data_map[u.country]++
        else
          data_map[u.country] = 1
      }); 
  }else{
    //project users by what ...?
    //..... ????
  }
    for (var d in data_map) {
      labels.push(d);
      dataTotals.push(data_map[d]);
      colors.push(this.random_rgba())
    }

    var chartData = {
      datasets: [{
        data: dataTotals,
        backgroundColor: colors
      }],
      labels: labels
    };

    var config = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        title: {
          display: true,
          text: 'Users By Country'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        legend: {
          display: true
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'center'
          }
        }
      }
    }

    var canvas = document.getElementById('stat_two');
    var ctx = canvas.getContext('2d');
    var stat_one = new Chart(ctx, config);
    stat_one.update();
  }

  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.5 + ')';
  }


}