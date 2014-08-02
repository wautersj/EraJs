function Era(hpd,dpw) {
  //Scoper
  var that = this;

  //Some settings that are unlikely to change quickly.
  this.config = {
    //Precalculated values. (Don't let JS do extra work).
    weekInMiliseconds: 604800000,
    dayInMiliseconds: 86400000,
    hourInMiliseconds: 3600000,
    //Some presets.
    hoursPerDay: (!hpd) ? 8 : hpd,
    daysPerWeek: (!dpw) ? 5 : dpw
  }

  //Always use the most recent representation
  //of the current moment in time.
  this.now = function() {
    var n = new Date();
    var day = (new Date()).getDay();
    if(day>=6){
      var dur = (new Date()).getTime();
      dur += (7-(day-1))*1000*60*60*24; 
      n = new Date(dur);
    }
    
    n.setHours(0);
    n.setMinutes(0);
    n.setSeconds(0);
    n.setMilliseconds(0);

    return n;
  };

  this.addTask = function(_task, opt) {
      var options = (!options) ? {} : options;

      if(options.before!==undefined 
        && options.after==undefined){
        //before certain task
      } else if(options.before==undefined 
        && options.after!==undefined){
        //after certain task
      } else {
        //after end of timeline
      }
  }

  this.removeTask = function(_task) {
      var taskId = _task.id;
  }

  this.evaluate = function(_task) {
    //We are looking for the first potentially interfering day.
    var firstInterferor = null;
    //We'll save the distance in milisecs to this firstInterferor.
    //We need to save this so we can check if the firstInterferor
    //we found is the most close one in range.
    var diffTillFirst = null;
    var now = that.now().getTime();
    var resultParts = [];

    var potentials = [];
    //Concatinate all the potential interfering days into
    //one list, so we can easily look through it.
    potentials = potentials.concat(that.vacationdays);
    potentials = potentials.concat(that.holidays);
    potentials = potentials.concat(that.weekends);

    //Loop through all potential interfering days.
    for (var i = 0; i < potentials.length; i++) {
      var potentialDay = potentials[i];
      //Calculate it's duration in real daytime miliseconds.
      var dayRelative = potentialDay.hours/that.config.hoursPerDay;
      potentialDay.duration = hoursToMiliseconds(dayRelative*24);

      //Check only further if the potential day starts
      //after the time our task starts, else no further
      //checking is needed, since it's in the past.
      if(potentialDay.start>=_task.start){
        //the difference between the interfering day and
        //the start of the task at hand.
        var diff = potentialDay.start - _task.start;

        //Always save the closest interfering day.
        if(diff<diffTillFirst||diffTillFirst==null) {
          diffTillFirst = diff;
          firstInterferor = potentialDay;
        }
      }
    };

    var interfering = [];

    //This will be always the case: There will always be a closest
    //interfering day, unless not one holiday or vacationday was loaded.
    //firstInterferor = null;
    if(firstInterferor!==null){
      var tempTaskEnd = _task.start + _task.duration;

      if(tempTaskEnd>firstInterferor.start) {
        interfering.push(firstInterferor);

        //Prepare this _task piece.
        var timeUntill = Number(firstInterferor.start -  _task.start);

        var orgHours = _task.hours;
        var orgDuration = _task.duration;
        var restDuration = _task.duration;


        /* --*/
        var _taskPart = new EraTime();
        _taskPart.id = _task.id;
        _taskPart.start = _task.start;
        _taskPart.hours = (timeUntill/_task.duration)*orgHours;
        _taskPart.duration = timeUntill;
        _taskPart.end = _taskPart.start + _taskPart.duration;
        _taskPart.options = _task.options;
        _taskPart.splitted = true;
        _taskPart.interfering = [firstInterferor];
        /* --*/

        //Save the rest.
        restDuration -= _taskPart.duration;

        if(_taskPart.duration!==0) {
          resultParts.push(_taskPart);
        } else {
          //console.warn('oh no a part zero:');
          //console.log(_taskPart);
        }

        //Create interfering day
        var intDay = new EraTime();
        intDay.start = firstInterferor.start;
        intDay.options.title = firstInterferor.title;
        intDay.options.type = firstInterferor.type;
        intDay.hours = firstInterferor.hoursRelative*that.config.hoursPerDay;
        intDay.duration = hoursToMiliseconds((intDay.hours/that.config.hoursPerDay)*24);

        //intDay.duration = hoursToMiliseconds((intDay.hours/8)*24);
        intDay.end = intDay.start + intDay.duration;
        resultParts.push(intDay);

        //now Finally Create the rest of the _task
        var _taskRest = new EraTime();
        _taskRest.id = _task.id;
        _taskRest.start = intDay.end;
        _taskRest.hours = (restDuration/orgDuration)*orgHours;
        _taskRest.duration = restDuration;
        _taskRest.end = _taskRest.start + _taskRest.duration;
        _taskRest.options = _task.options;
        _taskRest.splitted = true;
        _taskRest.interfering = [firstInterferor];

        if(_taskRest.duration!==0) {
          that._timeline.unshift(_taskRest);
         } else {
          //console.warn('oh no a rest zero:');
          //console.log(_taskRest);
        }


      } else {
        //Nothing Happend.
        _task.end = _task.start + _task.duration;
        resultParts.push(_task);
      }
    } else {
      //Nothing Happend.
      _task.end = _task.start + _task.duration;
      resultParts.push(_task);
    } 

    return resultParts;
  }

  this.end = function() {
    that.timeline = [];
    that._timeline = [];

    that._timeline = that._timeline.concat(that.tasks);

    //console.log('bulk tasks to handle : ' + that._timeline.length + ' x Eratimes');

    var now = that.now().getTime();
    console.log(now);
    var timeSaver = 0;

    for (var i = 0; that._timeline.length > 0 ; i) {
      var task = that._timeline[0];
      that._timeline.splice(0,1);

      //Firstly we need to define when the task will start.
      //This will either be this very moment, if no other
      //tasks have been defined yet, or it will start, at 
      //the end of the lastly defined timeline task.
      var startTime;
      if(that.timeline.length>0) {
        var lastTask = that.timeline[that.timeline.length-1];
        startTime = lastTask.end;
      } else {
        startTime = now;
      }

      task.start = startTime;

      //We can now calculate the duraction of the task in
      //miliseconds acording to nomal daytime hours.
      var dayRelative = task.hours/that.config.hoursPerDay;
      task.duration = hoursToMiliseconds(dayRelative*24);

      //Ready for the big evaluation ?
      var evaluatedTask = that.evaluate(task);
      //console.log(evaluatedTask);
      that.timeline = that.timeline.concat(evaluatedTask);
    };

    var thenDate = new Date();
    if(that.timeline.length>0){
      var lastTime = that.timeline[that.timeline.length-1];
      thenDate = new Date(lastTime.end);
    }

    var day = thenDate.getDate();
    var month = thenDate.getMonth() + 1; //Months are zero-based.
    var year = thenDate.getFullYear();

    day = (String(day).length>1) ? String(day) : '0' + String(day);
    month = (String(month).length>1) ? String(month) : '0' + String(month);

    var sent = 'Your current Era will last untill : ' + day + '/' + month + '/' + year;

    var response = {
      sentence: sent,
      day: Number(day),
      month: Number(month),
      year: Number(year),
      timeline: that.timeline,
      date: thenDate
    }

    return (that.timeline.length>0) ? response : null;
  }

  this.holidays = [];
  this.weekends = [];
  this.vacationdays = [];
  this.tasks = [];
  this.timeline = null;
  this._timeline = null;

  //Other not-era-specific options can be stored here.
  this.options = {};

  this.version = function() {
    return 'You\'re using Era version 2.0';
  }
  return this.version();
}