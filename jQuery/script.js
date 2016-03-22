document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  renderInitialState();
  
  // request notification permissions
  if (Notification.permission == "granted"){
    console.log("notification permissions granted")
  };
  
  if (Notification.permission !== "granted"){
    Notification.requestPermission();
    console.log("requested permission for notifications");
  };
  
});


function renderInitialState() {
  $("#timer").html(`
    timerLength: <input type="text" name="timerLength" value="10">
    <br>
    breakLength: <input type="text" name="breakLength" value="1">
    <br>
    <input type="button" id="startTimerButton" value="startTimer">
  </form>`);

  $("#startTimerButton").click( function() { 
    clickAlert();
  });
}

function clickAlert(){
  alert("oh Hey there");
}

function renderActiveState() {
$("#timer").html(`
        timerLength: <input type="text" name="timerLength" value="10">
        <br>
        breakLength: <input type="text" name="breakLength" value="1">
        <br>
        <input type="button" value="pauseTimer">
        <input type="button" value="resetTimer">
</form>`);
}

function renderBreakState() {
$("#timer").html(`
        timerLength: <input type="text" name="timerLength" value="10">
        <br>
        breakLength: <input type="text" name="breakLength" value="1">
        <br>
        <input type="button" value="resumeTimer">
        <input type="button" value="resetTimer">
</form>`);
}

function renderFinalState() {
$("#timer").html(`
        timerLength: <input type="text" name="timerLength" value="10">
        <br>
        breakLength: <input type="text" name="breakLength" value="1">
        <br>
        <input type="button" value="startTimer">
</form>`);
}