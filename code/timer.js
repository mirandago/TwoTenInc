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
        document.getElementById("pause_img").style.display = "none"

        //this.hideButtons(active);
    }

    hideButtons(active) {
        if (active) {
            document.getElementById("play_img").style.display = "none"
            document.getElementById("pause_img").style.display = "block"
        } else {
            document.getElementById("play_img").style.display = "block"
            document.getElementById("pause_img").style.display = "none"
        }
    }
    
    switchState() {
        this.audioNotification();
        if (this.focus) {
            this.focus = false;
            document.getElementById(this.stateId).innerText = DefaultBreakText;
            document.getElementById(this.timerId).innerText = DefaultBreakTime;
            document.getElementById("rcorners").style.backgroundColor = "green";
            this.time_left = DefaultBreakTime;
        } else {
            this.focus = true;
            document.getElementById(this.stateId).innerText = DefaultFocusText;
            document.getElementById(this.timerId).innerText = DefaultFocusTime;
            document.getElementById("rcorners").style.backgroundColor = "blue";
            this.time_left = DefaultFocusTime;
        }
        this.startTimer();
    }

    audioNotification() {
        if(this.focus) {
            var myAudio = new Audio(chrome.runtime.getURL("audio/break.mp3"));
            myAudio.play();
        } else {
            var myAudio = new Audio(chrome.runtime.getURL("audio/focus.mp3"));
            myAudio.play();
        }
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
        this.hideButtons(true);
        this.runningCall = setInterval(
            this.updateTimerDisplay.bind(this)
        ,1000);
    }

    pauseTimer() {
        this.active = false;
        clearInterval(this.runningCall);
        this.hideButtons(false);
    }

    resetTimer() {
        this.time_left = DefaultTime;
        this.focus = true;
        this.active = false;
        document.getElementById(this.timerId).innerText = DefaultTime;
        document.getElementById(this.stateId).innerText = DefaultFocusText;
        document.getElementById("rcorners").style.backgroundColor = "blue";
        this.hideButtons(false);
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


document.getElementById("play_img").addEventListener("click", function() {
    timer.startTimer();
});

document.getElementById("pause_img").addEventListener("click", function(){
    timer.pauseTimer();
});

document.getElementById("reset_img").addEventListener("click", function(){
    timer.resetTimer();
});


