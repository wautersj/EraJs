var myEra;

$(document).ready(function() {
  init();
});

var eraConfig = {
  sources: {
    tasks: 'dump/tasks.json',
    holidays: 'dump/holidays.json',
    vacationdays: 'dump/vacation_days.json'
  }
}

function init() {
  myEra = new Era();

  //load
  $.getJSON(eraConfig.sources.tasks, function( data ) {
    console.log('Tasks: ' +data.length);
    nextSource();
  });

  //load
  $.getJSON(eraConfig.sources.holidays, function( data ) {
    console.log('Hollidays: ' +data.length);
    myEra.hollidays = data;
    nextSource();
  });

  //load
  $.getJSON(eraConfig.sources.vacationdays, function( data ) {
    console.log('Vacationdays: ' +data.length);
    nextSource();
  });
}

var sourcesLoaded=0;
function nextSource() {
  sourcesLoaded++;
  //if load is complete, then start
  if(sourcesLoaded==3) {
    startDocs();
  }
}

function startDocs() {
  var now = myEra.now();
  var day = now.getDate();
  var month = now.getMonth() + 1; //Months are zero-based.
  var year = now.getFullYear();

  day = (String(day).length>1) ? String(day) : '0' + String(day);
  month = (String(month).length>1) ? String(month) : '0' + String(month);

  //As in the preview
  $('#container .now').append(day + '/' + month + '/' + year);

  //As in the preview
  myEra.addHours(320);

  //As in the preview
  myEra.addVacationDays(2);

  //As in the preview
  $('.end.code.return').append(myEra.end().sentence);

  var intStr = '';
  for (var i = 0; i < myEra.interferingHollidays.length; i++) {
    var holliday = myEra.interferingHollidays[i];
    var hollodayDate = new Date(holliday.time);
    var hollidayDay = now.getDate();
    var hollidayMonth = now.getMonth() + 1; //Months are zero-based.
    var hollidayYear = now.getFullYear();
    hollidayDay = (String(hollidayDay).length>1) ? String(hollidayDay) : '0' + String(hollidayDay);
    hollidayMonth = (String(hollidayMonth).length>1) ? String(hollidayMonth) : '0' + String(hollidayMonth);

    intStr += (hollidayDay + '/' + hollidayMonth + '/' + hollidayYear) + ' (' + holliday.title + ') <br/>';
  };

  //As in the preview
  $('.end.code.interfering').append(intStr);
}