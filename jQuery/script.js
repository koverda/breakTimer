/*
Break Timer
by: Peter Koverda
=================
I wrote this timer to help take stretch breaks at work. 


To Do
=====
- make it pretty
- host it
- cookie 
  - save timer settings
  - save time left
- more notification types 
  - sound
  - blink tab
  - email notification
- refactor for less repetition / Object oriented
- notifications in on mobile (serviceWorker)
- javascript only
- typescript
*/


var timerLength = 0;
var breakLength = 0;
var orginalTimerLength = 0;
var originalBreakLength = 0;
var timer = setInterval(function(){});
var notifications = true;
var closeWindowConfirmation = false;
var autoContinue = false;
var workInput;
var breakInput;



document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  timerLength = 0;
  breakLength = 0;
  
  if (notifications)
  {
    // request notification permissions
    if (Notification.permission == "granted"){
      console.log("notification permissions granted")
    };
    
    if (Notification.permission !== "granted"){
      Notification.requestPermission();
      console.log("requested permission for notifications");
    };
  }
  
renderInitialState();
    
});


 $( document ).ready(function (){
  
  $('.option').on('click',function () {
      console.log("clicked");
    if ($(this).hasClass('on'))
    {
      $(this).removeClass('on');
      console.log("removed");
    }
    else {
      $(this).addClass('on');
      console.log("added");
    }
    notifications = $("#o1").hasClass('on');
    autoContinue = $("#o2").hasClass('on'); 
    closeWindowConfirmation = $("#o3").hasClass('on');
  });
  
   $('.workTimerDisplay').on('click',function() {
      $('#inputWork').focus();
      $('#ws').addClass('entryBlink');
      
  });   
  
   $('.breakTimerDisplay').on('click',function() {
      $('#inputBreak').focus();
      $('#bs').addClass('entryBlink');
  });   

  document.getElementById("inputWork").oninput =  function () {
    updateWorkTimeDisplay(this);
  };
   
  document.getElementById("inputBreak").oninput =  function () {
    updateBreakTimeDisplay(this);
  };
  
  $('#inputWork').blur( function (){
    $('#ws').removeClass('entryBlink');
  });
  
  $('#inputBreak').blur( function (){
    $('#bs').removeClass('entryBlink');
  });
  
});



function updateWorkTimeDisplay(obj) {
  if (obj.value.length > 4) {
    obj.value = obj.value.slice(1,5); 
  };
  
  workInput = obj.value;
  $('.workTimerDisplay .seconds').text(workInput.slice(2,4));
  $('.workTimerDisplay .minutes').text(workInput.slice(0,2));
};

function updateBreakTimeDisplay(obj) {
  if (obj.value.length > 4) {
    obj.value = obj.value.slice(1,5); 
  };
  
  breakInput = obj.value;
  $('.breakTimerDisplay .seconds').text(breakInput.slice(2,4));
  $('.breakTimerDisplay .minutes').text(breakInput.slice(0,2));
};


// this is to prevent closing the window on accident
window.onbeforeunload = function(e) {
  console.log("before unload");
  if (closeWindowConfirmation)
  {
    console.log("notification is on");
    return 'You will lose your break timer! ';
  }
};

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
      if (notifications)
      {
        notifyMe("breakStart");
      }
      
      $("#timer").append(`<input type="button" id="continueTimerButton" value="Start Break">`);
      
      if(autoContinue)
      {
        renderBreakState();
      }
      
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
      if (notifications)
      {
        notifyMe("breakEnd");
      }
      
      if(autoContinue)
      {
        renderInitialState();
      }
      
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
        // notification.onclick = function(){
        //   alert("clicked");
        // }
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

