/*
Break Timer
by: Peter Koverda
=================
I wrote this timer to help take stretch breaks at work. 


To Do
=====
- options 
  - notifications toggle
  - auto continue toggle
- make it pretty
- more notification types
- host it
- refactor for less repetition
- cookie 
  - save timer settings
  - save time left
- suggestion box
- donation box
*/


var timerLength = 0;
var breakLength = 0;
var orginalTimerLength = 0;
var originalBreakLength = 0;
var timer = setInterval(function(){});

// this is to prevent closing the window on accident
window.onbeforeunload = function(e) {
    return 'You will lose your break timer! ';
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  timerLength = 0;
  breakLength = 0;

  // request notification permissions
  if (Notification.permission == "granted"){
    console.log("notification permissions granted")
  };
  
  if (Notification.permission !== "granted"){
    Notification.requestPermission();
    console.log("requested permission for notifications");
  };
  
    renderInitialState();
    
});


function renderInitialState() {
  clearInterval(timer);
  
  $("#timer").html(`
  initial <br>
    Timer Duration (seconds): <input type="text" id="timerLengthInput" size="5" value="5">
    <br>
    Break Duration (seconds): <input type="text" id="breakLengthInput" size="5" value="2">
    <br>
    <input type="button" id="startTimerButton" value="Start">
  `);

  $("#startTimerButton").click( function() { 
    //store inputs
    timerLength = parseInt($("#timerLengthInput").val());
    breakLength = parseInt($("#breakLengthInput").val());
    
    //store original values
    originalTimerLength = timerLength;
    originalBreakLength = breakLength;
          
    renderActiveState();
  });
}


function renderActiveState() {
  $("#timer").html(`
  active <br>
          Time Left: <span id="timeLeftDisplay"></span>
          <br>
          <input type="button" id="pauseTimerButton" value="Pause">
          <input type="button" id="resetTimerButton" value="Reset">
  `);
  
  $("#timeLeftDisplay").html(timerLength);
  
  timer = setInterval(function(){
    timerLength--;
    $("#timeLeftDisplay").html(timerLength);
    
    if (timerLength == 0)
    {
      clearInterval(timer);
      notifyMe("breakStart");
      
      $("#timer").append(`<input type="button" id="continueTimerButton" value="Start Break">`);
      
      $("#continueTimerButton").click( function() { 
        renderBreakState();
      });
      
    };
  }, 1000);

  $("#pauseTimerButton").click( function() { 
    // pause timer
    clearInterval(timer);
    renderPausedState("activeState");
  });
  
  
  $("#resetTimerButton").click( function() { 
    renderInitialState();
  });
}


function renderPausedState(pauseCaller) {
$("#timer").html(`
  paused <br>
          timeLeft: <span id="timeLeftDisplay"></span>
          <br>
          <input type="button" id="resumeTimerButton" value="Resume">
          <input type="button" id="resetTimerButton" value="Reset">
  `);
  
  if (pauseCaller == "activeState") $("#timeLeftDisplay").html(timerLength);
  if (pauseCaller == "breakState") $("#timeLeftDisplay").html(breakLength);
  
  $("#resumeTimerButton").click( function() { 
    if (pauseCaller == "activeState") renderActiveState();
    if (pauseCaller == "breakState") renderBreakState();
  });
  
  $("#resetTimerButton").click( function() { 
    renderInitialState();
  });
}


function renderBreakState() {
$("#timer").html(`
  break <br>
          Time Left: <span id="timeLeftDisplay"></span>
          <br>
          <input type="button" id="pauseTimerButton" value="Pause">
          <input type="button" id="resetTimerButton" value="Reset">
  `);
  
  $("#timeLeftDisplay").html(breakLength);
  
  timer = setInterval(function(){
    
    breakLength--;
    
    $("#timeLeftDisplay").html(breakLength);
    
    if (breakLength == 0)
    {
      clearInterval(timer);
      
      notifyMe("breakEnd");
      
      $("#timer").append(`<input type="button" id="continueTimerButton" value="Start Work">`);
      
      $("#continueTimerButton").click( function() { 
        renderInitialState();
      });
      
    };
  }, 1000);

  $("#pauseTimerButton").click( function() { 
    // pause timer
    clearInterval(timer);
    renderPausedState("breakState");
  });
  
  $("#resetTimerButton").click( function() { 
    renderInitialState();
  });
}


function renderFinalState() {
  $("#timer").html(`
    final <br>
    timerLength: <input type="text" id="timerLengthInput" name="timerLength" value="5">    <br>
    breakLength: <input type="text" id="breakLengthInput"  name="breakLength" value="2">    <br>
    <input type="button" id="startTimerButton" value="startTimer">
  `);

  $("#startTimerButton").click( function() { 
    timerLength = parseInt($("#timerLengthInput").val());
    breakLength = parseInt($("#breakLengthInput").val());   
    renderActiveState();
  });
}


function notifyMe(notificationType) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    switch(notificationType) {
      case "breakStart":
        var notification = new Notification('Break Time', {
          icon: 'img/bell.png',
          body: "Hey there! Take a break!",
        });
        break;
      case "breakEnd":
        var notification = new Notification('Break Is Over', {
          icon: 'img/briefcase.png',
          body: "Hey there! Break Is Over, back to work!",
        });  
        break;    
    }
  }
}

