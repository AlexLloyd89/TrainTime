$(document).ready(function() {
  var trainData = firebase.database();
  // 2. Button for adding Trains
  $("#addTrainBtn").on("click", function(e) {
    e.preventDefault();
    // Grabs user input and assign to variables
    var trainName = $("#trainNameInput")
      .val()
      .trim();
    var lineName = $("#lineInput")
      .val()
      .trim();
    var destination = $("#destinationInput")
      .val()
      .trim();
    var trainTimeInput = moment(
      $("#trainTimeInput")
        .val()
        .trim(),
      "HH:mm"
    )
      .subtract(10, "years")
      .format("X");
    var frequencyInput = $("#frequencyInput")
      .val()
      .trim();

    // Test for variables entered
    console.log(trainName);
    console.log(lineName);
    console.log(destination);
    console.log(trainTimeInput);
    console.log(frequencyInput);

    // Creates local "temporary" object for holding train data
    // Will push this to firebase

    trainData.ref().push({
      name: trainName,
      line: lineName,
      destination: destination,
      trainTime: trainTimeInput,
      frequency: frequencyInput
    });
  });

  // clear text-boxes
  $("#trainNameInput").val("");
  $("#lineInput").val("");
  $("#destinationInput").val("");
  $("#trainInput").val("");
  $("#frequencyInput").val("");

  trainData.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // assign firebase variables to snapshots.
    var firebaseName = snapshot.val().name;
    var firebaseLine = snapshot.val().line;
    var firebaseDestination = snapshot.val().destination;
    var firebaseTrainTimeInput = snapshot.val().trainTime;
    var firebaseFrequency = snapshot.val().frequency;

    var timeRemainder =
      moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") %
      firebaseFrequency;
    var minutes = firebaseFrequency - timeRemainder;

    var nextTrainArrival = moment()
      .add(minutes, "m")
      .format("hh:mm A");

    // Test for correct times and info
    console.log(minutes);
    console.log(nextTrainArrival);
    console.log(moment().format("hh:mm A"));
    console.log(nextTrainArrival);
    console.log(moment().format("X"));

    // Append train info to table on page
    $("#trainTable > tbody").append(
      "<tr><td>" +
        firebaseName +
        "</td><td>" +
        firebaseLine +
        "</td><td>" +
        firebaseDestination +
        "</td><td>" +
        firebaseFrequency +
        " mins" +
        "</td><td>" +
        nextTrainArrival +
        "</td><td>" +
        minutes +
        "</td></tr>"
    );
  });
});
