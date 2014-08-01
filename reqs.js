//REQUIREMENTS ERA.JS

//Extention will be provided: Era/lib/Era-min.js
var myEra = new Era();

// One 'Era' Per Person.
// Era will return an array with all data needed to visualize
// the person's bulk timeline: Tasks, Holidays & Vacationdays.

//NEW: Task Class.
//Extention will be provided: Era/lib/EraTask-min.js
var newTask = new EraTask();
newTask.name;
newTask.id;
newTask.start;
newTask.duration; //LookItUp
newTask.end;
newTask.url;
newTask.order; //DontNeedIt?
newTask.type;
newTask.interfering;

//NEW: Adding a new task.
//Item can be added before or after an existing
existingEra.addTask(newTask, {after:x, before:y});

//NEW: Removing a task.
existingEra.removeTask(oldTask);

//HOWTO move a task from one person's timeline to another:
//Ignore variable names:
eraJonas.removeTask(taskToMove);
eraSteve.addTask(taskToMove, {addAfter:x});