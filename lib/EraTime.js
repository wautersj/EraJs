function EraTime() {
	this.id = -1;
	this.options = {};

	this.start = -1;
	this.end = -1;
	this.hours = -1;
	this.duration = 0; //is always in miliseconds!!!
	this.splitted = false; //is true when the task it devided by interference.
}