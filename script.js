  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    renderTimerForm();
  });


function renderTimerForm() {
document.getElementById('timerForm').innerHTML = `<form onsubmit="startTimerFunction(); return false;">
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
  document.getElementById('timerDisplay').innerHTML = `workTime <br> <div id="timerDisplayClock">` + timerLength +`</div>`;

  console.log(typeof timerLength);
  console.log(typeof breakLength);

  var seconds_left = timerLength;

	var interval = setInterval(function() {
	    document.getElementById('timerDisplayClock').innerHTML = --seconds_left;

	    if (seconds_left <= 0)
	    {
	        document.getElementById('timerDisplay').innerHTML = `
            break time! <br> 
            aw yeah    
            <form onsubmit="myFunction(); return false;"> 
              <input type="submit" value="restartTimer">
            </form>
            `;
	        clearInterval(interval);
	        notifyMe();
	    }
	}, 1000);
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