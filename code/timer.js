var DefaultTime = 1500;
var DefaultActive = false;
var DefaultFocus = true;

class Timer {
    
    constructor(time_left, active, focus, id) {
        this.time_left = time_left;
        this.active = active;
        this.focus = focus;
        this.timerId = id;
        document.getElementById(id).innerText = time_left;
        console.log("hello");
    }
    
    updateTimerDisplay() {
        this.time_left--;
        document.getElementById(this.timerId).innerText = this.time_left;
    }

    startTimer() {
        this.active = true;
        var self = this;
        var time_left = this.time_left;
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
}

var timer = new Timer(DefaultTime, DefaultActive, DefaultFocus, "timer");

document.getElementById("play_button").addEventListener("click", function(){
    timer.startTimer();
});

document.getElementById("pause_button").addEventListener("click", function(){
    timer.pauseTimer();
});

document.getElementById("reset_button").addEventListener("click", function(){
    timer.resetTimer();
});

