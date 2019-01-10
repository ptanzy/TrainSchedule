// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyBww7IeY4dtJvtrBRUBGNZpS7o-A-BiKPc",
  authDomain: "trainschedule-11f93.firebaseapp.com",
  databaseURL: "https://trainschedule-11f93.firebaseio.com",
  projectId: "trainschedule-11f93",
  storageBucket: "trainschedule-11f93.appspot.com",
  messagingSenderId: "563729144508"
};
firebase.initializeApp(config);

var database = firebase.database(); // Database reference

// 2. When form is submitted, store form data to database
$("#submit-input").on("click", function(event) {
  // Prevent form from submitting null
  event.preventDefault();

  var train = {
    name: $("#name-input").val().trim(),
    dest: $("#dest-input").val().trim(),
    freq: parseInt($("#freq-input").val().trim()),
    time: $("#time-input").val().trim()
  }

  // First Train Time
  var firstTime = moment(train.time, "HH:mm").subtract(1, "years");
  console.log(firstTime);

  // cur time
  var currentTime = moment();
  console.log("cur time: " + moment(currentTime).format("hh:mm"));

  // difference
  var diff = moment().diff(moment(firstTime), "minutes");
  console.log("difference: " + diff);

  // time till next train
  var timeTilNext = diff % train.freq;
  console.log(timeTilNext);

  // Minute Until Train
  var minTilTrain = train.freq - timeTilNext;
  console.log("min til train: " + minTilTrain);
  train.away = minTilTrain;
  // Next Train
  var nextTrain = moment().add(minTilTrain, "minutes");
  console.log("arives: " + moment(nextTrain).format("hh:mm"));

  var arrival = moment(nextTrain).format("hh:mm");
  train.arvl = arrival;

  database.ref().push({
    name: train.name,
    dest: train.dest,
    freq: train.freq,
    time: train.time,
    arvl: train.arvl,
    away: train.away,
  });  
});


// 3. functions


function html(data) { // Receives data & displays to html

  var next = 0;
  var minAway = 0;

  var dataArray = [data.name, data.dest, data.freq, data.arvl, data.away];

  var $row = $("<tr>");
  
  for (var i = 0; i < dataArray.length; i++) {
      var $tableData = $("<td>").text(dataArray[i]);
      $row.append($tableData);
  }
    
    $("#table").append($row);
}

// 4. Database data-request
database.ref().on("child_added", function(snapshot) { //Pulls snapshot when a child added
  console.log(snapshot.val());
  html(snapshot.val());
  }, function(errorObject) { // log errors to console
  console.log("The read failed: " + errorObject.code);
});