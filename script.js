  document.addEventListener("DOMContentLoaded", function(event) {
    // console.log("DOM fully loaded and parsed");
    renderTimerForm();
  });


function renderTimerForm() {
document.getElementById('timerForm').innerHTML = `<form onsubmit="startTimerFunction();">
        timerLength: <input type="text" name="timerLength" value="10">
        <br>
        breakLength: <input type="text" name="breakLength" value="1">
        <br>
        <input type="submit" value="startTimer">
    </form>`;
}

function clearTimerForm() {
document.getElementById('timerForm').innerHTML = ``;
}


function startTimerFunction() {
	var timerLength = parseInt(document.getElementsByName("timerLength")[0].value);
	var breakLength = parseInt(document.getElementsByName("breakLength")[0].value);

  clearTimerForm();

  var intervalId;

  document.getElementById('timerDisplay').innerHTML = 
    `workTime <br> <div id="timerDisplayClock">` + timerLength +`</div>
    <div id="actionButtons"><button id="pauseButton">Pause</button></div>`;

  var seconds_left = timerLength;

	var intervalId = window.setInterval(function() {
	    document.getElementById('timerDisplayClock').innerHTML = --seconds_left;

      document.getElementById("pauseButton").addEventListener("click", function(){
          console.log("pause click");
          clearInterval(intervalId);
      });

	    if (seconds_left <= 0)
	    {
	        document.getElementById('timerDisplay').innerHTML = `
            break time! <br> 
            aw yeah    
            <form onsubmit="myFunction(); return false;"> 
              <input type="submit" value="restartTimer">
            </form>
            `;
	        clearInterval(intervalId);
	        notifyMe();
	    }
	}, 1000);
}

function pauseCount(intervalId) {
  window.clearInterval(intervalId);
  console.log(intervalId);

}

function notifyMe() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification title', {
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: "Hey there! You've been notified!",
    });

    notification.onclick = function () {
      window.open("http://stackoverflow.com/a/13328397/1269037");      
    };

  }
}


// jquery timer functions
var CCOUNT;
$(document).ready(function () {
    $('#btnct').click(function () {
        CCOUNT = $('#seconds').val();
        cdreset();
    });
});
var t, count;

function cddisplay() {
    document.getElementById('timespan').innerHTML = count;
}

function countdown() {
    // starts countdown
    cddisplay();
    if (count === 0) {
        // time is up
    } else {
        count--;
        t = setTimeout(countdown, 1000);
    }
}

function cdpause() {
    // pauses countdown
    clearTimeout(t);
}

function cdreset() {
    // resets countdown
    cdpause();
    count = CCOUNT;
    cddisplay();
}