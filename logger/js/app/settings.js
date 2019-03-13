$(document).ready(function() {

$("#deletedbbutton").click(function() {

var req = indexedDB.deleteDatabase("logger_app_logs");
req.onsuccess = function () {
    console.log("Database deleted successfully");
    sessionStorage.oldlogs = "0";

   $('#oldlogbg').text(sessionStorage.oldlogs);
    
    $('#submitdata').hide();

    $('#logbody').empty();

    $('#tempmsg').show();

    $('#tempmsg').attr("class","alert alert-danger");

    $('#tempmsg').text("Restart the APP to refresh the database!")
};
req.onerror = function () {
    console.log("Couldn't delete database");
};
req.onblocked = function () {
    console.log("Couldn't delete database: operation blocked, close and reopen the app");     
    sessionStorage.oldlogs = "0";

    $('#oldlogbg').text(sessionStorage.oldlogs);
    
    $('#submitdata').hide();

    $('#logbody').empty();

    $('#tempmsg').show();

    $('#tempmsg').attr("class","alert alert-danger");

    $('#tempmsg').text("Restart the APP to refresh the database!")

};

    });



$("#exportbbutton").click(function() {




});

});