function Era(hpd,dpw) {
  //Scoper
  var that = this;

  //Always use the most recent representation
  //of the current moment in time.
  this.now = function() {
    return new Date();
  };

  this.addHours = function(hours){
    //You added some extra hours to the Era, this is registered.
    that.addedHours.push(hours);
  }

  this.addVacationDays = function(days){
    //You added vacation days.
    that.addedVacationHours.push(days * that.hoursPerDay);
  }

  this.end = function() {
    var hoursToAdd = 0;
    
    //Get work hours.
    for (var i = 0; i < that.addedHours.length; i++) {
      hoursToAdd += that.addedHours[i];
    };

    //Get vacation hours.
    for (var v = 0; v < that.addedVacationHours.length; v++) {
      hoursToAdd += that.addedVacationHours[v];
    };

    var _days = hoursToAdd/that.hoursPerDay;
    var _fullDays = Math.floor(_days);
    var _restHours = (_days - _fullDays) * that.hoursPerDay;
    var _weeks = (_fullDays/that.daysPerWeek);
    var _fullWeeks = Math.floor(_fullDays/that.daysPerWeek);
    var _restDays = (_weeks - _fullWeeks).toFixed(2) * that.daysPerWeek;

    var weeksTime = _fullWeeks * that.weekInMiliseconds;
    var daysTime = _restDays * that.dayInMiliseconds;
    var hoursTime = _restHours * that.hourInMiliseconds;

    var now = that.now().getTime();
    var totalTime = weeksTime + daysTime + hoursTime;
    var then = now + totalTime;

    //Check for hollidays.
    var hollidays = that.hollidays;
    that.interferingHollidays = [];

    for (var h = 0; h < hollidays.length; h++) {
      var hollidayTime = (new Date(hollidays[h].time)).getTime();
      if(hollidayTime>now && hollidayTime<then) {            
        then += 24*60*60*1000;
        that.interferingHollidays.push(hollidays[h]);
      }
    };

    var thenDate = new Date(then);
    var day = thenDate.getDate();
    var month = thenDate.getMonth() + 1; //Months are zero-based.
    var year = thenDate.getFullYear();

    day = (String(day).length>1) ? String(day) : '0' + String(day);
    month = (String(month).length>1) ? String(month) : '0' + String(month);

    var sent = 'Your current Era will last untill : ' + day + '/' + month + '/' + year;

    return {
      sentence: sent,
      day: day,
      month: month,
      year: year
    }
  }

  //Some presets.
  this.hoursPerDay = (!hpd) ? 8 : hpd;
  this.daysPerWeek = (!dpw) ? 5 : dpw;
  this.currentTime = this.now;
  
  //Registrations.
  this.addedHours = [];
  this.addedVacationHours = [];

  this.hollidays = [];
  this.vacationdays = [];

  //Precalculated values. (Don't let JS do extra work).
  this.weekInMiliseconds = 604800000;
  this.dayInMiliseconds = 86400000;
  this.hourInMiliseconds = 3600000;

  this.version = function() {
    return 'You\'re using Era version 1.0';
  }
  return this.version();
}