function hoursToMiliseconds(e){return e*60*60*1e3}function milisecondsToHours(e){return e/1e3/60/60}function EraTime(){this.id=-1;this.options={};this.start=-1;this.end=-1;this.hours=-1;this.duration=0;this.splitted=false}function Era(e,t){var n=this;this.config={weekInMiliseconds:6048e5,dayInMiliseconds:864e5,hourInMiliseconds:36e5,hoursPerDay:!e?8:e,daysPerWeek:!t?5:t};this.now=function(){var e=new Date;var t=(new Date).getDay();if(t>=6){var n=(new Date).getTime();n+=(7-(t-1))*1e3*60*60*24;e=new Date(n)}e.setHours(0);e.setMinutes(0);e.setSeconds(0);e.setMilliseconds(0);return e};this.addTask=function(e,t){var n=!n?{}:n;if(n.before!==undefined&&n.after==undefined){}else if(n.before==undefined&&n.after!==undefined){}else{}};this.removeTask=function(e){var t=e.id};this.evaluate=function(e){var t=null;var r=null;var i=n.now().getTime();var s=[];var o=[];o=o.concat(n.vacationdays);o=o.concat(n.holidays);o=o.concat(n.weekends);for(var u=0;u<o.length;u++){var a=o[u];var f=a.hours/n.config.hoursPerDay;a.duration=hoursToMiliseconds(f*24);if(a.start>=e.start){var l=a.start-e.start;if(l<r||r==null){r=l;t=a}}}var c=[];if(t!==null){var h=e.start+e.duration;if(h>t.start){c.push(t);var p=Number(t.start-e.start);var d=e.hours;var v=e.duration;var m=e.duration;var g=new EraTime;g.id=e.id;g.start=e.start;g.hours=p/e.duration*d;g.duration=p;g.end=g.start+g.duration;g.options=e.options;g.splitted=true;g.interfering=[t];m-=g.duration;if(g.duration!==0){s.push(g)}else{}var y=new EraTime;y.start=t.start;y.options.title=t.title;y.options.type=t.type;y.hours=t.hoursRelative*n.config.hoursPerDay;y.duration=hoursToMiliseconds(y.hours/n.config.hoursPerDay*24);y.end=y.start+y.duration;s.push(y);var b=new EraTime;b.id=e.id;b.start=y.end;b.hours=m/v*d;b.duration=m;b.end=b.start+b.duration;b.options=e.options;b.splitted=true;b.interfering=[t];if(b.duration!==0){n._timeline.unshift(b)}else{}}else{e.end=e.start+e.duration;s.push(e)}}else{e.end=e.start+e.duration;s.push(e)}return s};this.end=function(){n.timeline=[];n._timeline=[];n._timeline=n._timeline.concat(n.tasks);var e=n.now().getTime();var t=0;for(var r=0;n._timeline.length>0;r){var i=n._timeline[0];n._timeline.splice(0,1);var s;if(n.timeline.length>0){var o=n.timeline[n.timeline.length-1];s=o.end}else{s=e}i.start=s;var u=i.hours/n.config.hoursPerDay;i.duration=hoursToMiliseconds(u*24);var a=n.evaluate(i);n.timeline=n.timeline.concat(a)}var f=new Date;if(n.timeline.length>0){var l=n.timeline[n.timeline.length-1];f=new Date(l.end)}var c=f.getDate();var h=f.getMonth()+1;var p=f.getFullYear();c=String(c).length>1?String(c):"0"+String(c);h=String(h).length>1?String(h):"0"+String(h);var d="Your current Era will last untill : "+c+"/"+h+"/"+p;var v={sentence:d,day:Number(c),month:Number(h),year:Number(p),timeline:n.timeline,date:f};return n.timeline.length>0?v:null};this.holidays=[];this.weekends=[];this.vacationdays=[];this.tasks=[];this.timeline=null;this._timeline=null;this.options={};this.version=function(){return"You're using Era version 2.0"};return this.version()}