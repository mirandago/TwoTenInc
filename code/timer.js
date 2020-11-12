var DefaultTime = 5;
var DefaultFocusTime = 5;
var DefaultBreakTime = 3;
var DefaultActive = false;
var DefaultFocus = true;
var DefaultFocusText = "Focus";
var DefaultBreakText = "Break";

class Timer {
    
    constructor(time_left, active, focus, id, stateId) {
        this.time_left = time_left;
        this.active = active;
        this.focus = focus;
        this.timerId = id;
        this.stateId = stateId;
        document.getElementById(id).innerText = time_left;
        document.getElementById(stateId).innerText = DefaultFocusText;
    }
    
    switchState() {
        if (this.focus) {
            this.focus = false;
            document.getElementById(this.stateId).innerText = DefaultBreakText;
            document.getElementById(this.timerId).innerText = DefaultBreakTime;
            this.time_left = DefaultBreakTime;
        } else {
            this.focus = true;
            document.getElementById(this.stateId).innerText = DefaultFocusText;
            document.getElementById(this.timerId).innerText = DefaultFocusTime;
            this.time_left = DefaultFocusTime;
        }
        this.startTimer();
    }

    updateTimerDisplay() {
        this.time_left--;
        document.getElementById(this.timerId).innerText = this.time_left;
        if (this.time_left == 0) {
            this.pauseTimer();
            setTimeout(this.switchState.bind(this), 1000);
        }
    }

    startTimer() {
        this.active = true;
        var id = this.timerId;
        console.log("what is id" + id);
        this.runningCall = setInterval(
            this.updateTimerDisplay.bind(this)
        ,1000);
    }

    pauseTimer() {
        this.active = false;
        clearInterval(this.runningCall);
    }

    resetTimer() {
        this.time_left = DefaultTime;
        this.focus = true;
        this.active = false;
        document.getElementById(this.timerId).innerText = DefaultTime;
        clearInterval(this.runningCall);
    }

    getTime() {
        return this.time_left;
    }

    isFocus() {
        return this.focus;
    }

    isActive() {
        return this.active;
    }
}

var timer = new Timer(DefaultFocusTime, DefaultActive, DefaultFocus, "timer", "timer_state");

document.getElementById("play_button").addEventListener("click", function(){
    timer.startTimer();
});

document.getElementById("pause_button").addEventListener("click", function(){
    timer.pauseTimer();
});

document.getElementById("reset_button").addEventListener("click", function(){
    timer.resetTimer();
});

