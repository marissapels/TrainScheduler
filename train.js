  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCtqUtxLTJRBySTMS04wcmZ7KCMTn3APec",
    authDomain: "trainscheduler-1a342.firebaseapp.com",
    databaseURL: "https://trainscheduler-1a342.firebaseio.com",
    projectId: "trainscheduler-1a342",
    storageBucket: "trainscheduler-1a342.appspot.com",
    messagingSenderId: "760946665784"
  };
  firebase.initializeApp(config);

  var database=firebase.database();

  var name="";
  var destination="";
  var firstTime="";
  var frequency="";
  var nextArrival="";
  var minutesAway="";

  $("#submit").on("click", function(){
  	event.preventDefault();

  	name=$("#name-input").val().trim();
  	destination=$("#destination-input").val().trim();
  	var firstTimeInput=$("#time-input").val().trim();
    firstTime=moment(firstTimeInput, "HH:mm").format("HH:mm");
    console.log(firstTime);
  	frequency=$("#frequency-input").val().trim();

  	database.ref().push({
  		name: name,
  		destination: destination,
  		firstTime: firstTime,
  		frequency: frequency,
  	});

  	$("#name-input").val("");
  	$("#destination-input").val("");
  	$("#time-input").val("");
  	$("#frequency-input").val("");

  });

database.ref().on("child_added", function(snapshot){
  var name= (snapshot.val().name);
  var destination=(snapshot.val().destination);
  var frequency=(snapshot.val().frequency);
  var firstTime=(snapshot.val().firstTime);
  minutesAway=frequency-((moment().diff(moment(firstTime, "HH:mm"),"minutes"))%frequency);
  nextArrival=moment(moment().add(minutesAway, "minutes")).format("hh:mm a");


	var newTrain=
		"<tr>" +
      // "<td><button class='remove'>" + "X" + "</button></td>"+
			"<td>" + name + "</td>" +
			"<td>" + destination + "</td>" +
			"<td>" + frequency + "</td>" +
			"<td>" + nextArrival +
			"<td>" + minutesAway + "</td>" +
		"</tr>";


	$(".table").append(newTrain);

  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});