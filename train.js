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
    firstTime=moment(firstTimeInput, "HH:mm").format();
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
  if (moment(firstTime).unix()<moment().unix()){
    minutesAway=frequency-((moment().diff(moment(firstTime),"minutes"))%frequency);
    nextArrival=moment(moment().add(minutesAway, "minutes")).format("hh:mm a");
  }
  else {
    nextArrival=moment(firstTime).format("hh:mm a");
    minutesAway=moment(firstTime).diff(moment(),"minutes");
  }

  console.log(database.ref().push().key);

  var newTrain=
    "<tr class='"+ snapshot.key + "'>" +
      "<td><button class='remove' id='"+ snapshot.key + "'>" + "X" + "</button></td>"+
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

$(document).on("click", ".remove",function(){
  event.preventDefault();
  var dataKey=$(this).attr("id");
  database.ref().child(dataKey).remove();

});

database.ref().on("child_removed", function(snapshot){
  $("."+snapshot.key).remove();
});