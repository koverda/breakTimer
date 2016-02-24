

function myFunction() {
	var timerLength = parseInt(document.getElementsByName("timerLength")[0].value);
	var breakLength = parseInt(document.getElementsByName("breakLength")[0].value);
    //window.alert("timerLength:" + timerLength);

    document.getElementById('timerDisplay').innerHTML = timerLength;

console.log(typeof timerLength);
console.log(typeof breakLength);

    var seconds_left = timerLength;

	var interval = setInterval(function() {
	    document.getElementById('timerDisplay').innerHTML = --seconds_left;

	    if (seconds_left <= 0)
	    {
	        document.getElementById('timerDisplay').innerHTML = 'You are ready';
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