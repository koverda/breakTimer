/*
Break Timer
by: Peter Koverda
=================
I wrote this timer to help take stretch breaks at work. 


To Do
=====
- make it pretty
- host it
- invert color scheme
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


var workLength = 0;
var breakLength = 0;
var orginalTimerLength = 0;
var originalBreakLength = 0;
var timer = setInterval(function(){});
var notifications = true;
var closeWindowConfirmation = false;
var autoContinue = false;
var workInput = 0;
var breakInput = 0;
var workTime = true;
var timerActive = false;



document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  workLength = 0;
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
  
//renderInitialState();
    
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
  
  // timer input effects
   $('.workTimerDisplay').on('click',function() {
      if (timerActive == false) {
        $('#inputWork').focus();
        $('#ws').addClass('entryBlink');
      }
  });   
  
   $('.breakTimerDisplay').on('click',function() {
     if (timerActive == false) {
       $('#inputBreak').focus();
       $('#bs').addClass('entryBlink');
     }
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
  
  $('#startButton').click( function() { 
    if($('#startButton').find('i').hasClass('buttonBlink')){
      $('#startButton').find('i').removeClass('buttonBlink');
    }
    startTimerCount();
  });
  
  $('#pauseButton').click( function() { 
    clearInterval(timer);
    timerActive = false;
    
  });
  
  $('#inputBreak').focus(function(){
    this.value = this.value;
  });
    
  $('#inputWork').focus(function(){
    this.value = this.value;
  });
  
});


function startTimerCount(){
    workLength = (parseInt(workInput.toString().slice(0,2)) * 60) + parseInt(workInput.toString().slice(2,4));
    breakLength = (parseInt(breakInput.toString().slice(0,2)) * 60) + parseInt(breakInput.toString().slice(2,4));
    
    if(!workLength) {
      workLength = 0;
    }
    if(!breakLength) {
      breakLength = 0;
    }    
    
    // store original values
    originalTimerLength = workLength;
    originalBreakLength = breakLength;
      
    
    // start countdown
    if (timerActive == false) {
      timer = setInterval(function(){
        timerActive = true;
        if(workTime) {
          if(workLength <= 0) {          
            clearInterval(timer);
            workTime = false; //work is over, break time!
            if (notifications) {
              notifyMe("breakStart");
            }
            $('#startButton').find('i').addClass('buttonBlink');
            timerActive = false;
          }
          else { 
            workLength--;
            workCountdownTime(workLength);
            document.getElementById("inputWork").value = $('#wm').text()+$('#ws').text();
            workInput  = $('#wm').text()+$('#ws').text();
          }
        }
        else { //break time
          if(breakLength <= 0) {
            console.log("breakLength <= 0");
            clearInterval(timer);
            workTime = true; //break is over, work time!
            if (notifications) {
              notifyMe("breakEnd");
            }
            $('#startButton').find('i').addClass('buttonBlink');
            timerActive = false;
          }
          else {
            breakLength--;
            breakCountdownTime(breakLength);
          }
        }
      }, 1000);
    }
};


// changing time display during countdown
function workCountdownTime(workLength){
  $("#ws").text(pad2(workLength % 60));
  $("#wm").text(pad2(Math.floor(workLength / 60)));
};

function breakCountdownTime(breakLength){
  $("#bs").text(pad2(breakLength % 60));
  $("#bm").text(pad2(Math.floor(breakLength / 60)));
};

// changing the time inputs
function updateWorkTimeDisplay(obj) {  
  if (obj.value.length > 4) {
    obj.value = obj.value.slice(1,5);
  };
  
  if (obj.value.length < 4) {
    obj.value = pad4(obj.value); 
  };
  
  workInput = obj.value;
  $('.workTimerDisplay .seconds').text(workInput.slice(2,4));
  $('.workTimerDisplay .minutes').text(workInput.slice(0,2));
};

function updateBreakTimeDisplay(obj) {
  if (obj.value.length > 4) {
    obj.value = obj.value.slice(1,5); 
  };
  
  if (obj.value.length < 4) {
    obj.value = pad4(obj.value); 
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

  $("#startButton").click( function() { 
    console.log("startButton clicked");
    //store inputs
    workLength = workInput;
    breakLength = breakInput;
    
    //store original values
    originalTimerLength = workLength;
    originalBreakLength = breakLength;
          
    //renderActiveState();
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
  
  $("#timeLeftDisplay").html(workLength);
  
  timer = setInterval(function(){
    workLength--;
    $("#timeLeftDisplay").html(workLength);
    
    if (workLength == 0)
    {
      clearInterval(timer);
      if (notifications)
      {
        notifyMe("breakStart");
      }
      
      $("#timer").append(`<input type="button" id="continueTimerButton" value="Start Break">`);
      
      if(autoContinue)
      {
        //renderBreakState();
      }
      
      $("#continueTimerButton").click( function() { 
        //renderBreakState();
      });
      
    };
  }, 1000);

  $("#pauseTimerButton").click( function() { 
    // pause timer
    clearInterval(timer);
    //renderPausedState("activeState");
  });
  
  
  $("#resetTimerButton").click( function() { 
    //renderInitialState();
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
  
  if (pauseCaller == "activeState") $("#timeLeftDisplay").html(workLength);
  if (pauseCaller == "breakState") $("#timeLeftDisplay").html(breakLength);
  
  $("#resumeTimerButton").click( function() { 
    //if (pauseCaller == "activeState") renderActiveState();
    //if (pauseCaller == "breakState") renderBreakState();
  });
  
  $("#resetTimerButton").click( function() { 
    //renderInitialState();
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
        //renderInitialState();
      }
      
      $("#timer").append(`<input type="button" id="continueTimerButton" value="Start Work">`);
      
      $("#continueTimerButton").click( function() { 
        //renderInitialState();
      });
      
    };
  }, 1000);

  $("#pauseTimerButton").click( function() { 
    // pause timer
    clearInterval(timer);
    //renderPausedState("breakState");
  });
  
  $("#resetTimerButton").click( function() { 
    //renderInitialState();
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
    workLength = parseInt($("#timerLengthInput").val());
    breakLength = parseInt($("#breakLengthInput").val());   
    //renderActiveState();
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
          body: "Click to start break",
        });
        notification.onclick = function(){
          startTimerCount();
          notification.close();
        }
        break;
      case "breakEnd":
        var notification = new Notification('Break Is Over', {
          icon: 'img/briefcase.png',
          body: "Hey there! Break Is Over, back to work!",
        });  
        notification.onclick = function(){
          notification.close();
        }
        break;    
    }
  }
}

function pad2(number) {
     return (number < 10 ? '0' : '') + number;
}

function pad4(number) {
     while(number.length < 4){
       number = '0' + number;
     } 
     return number;
}

