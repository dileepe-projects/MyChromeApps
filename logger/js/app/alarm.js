(function () {
  'use strict';
   var alarmName = 'remindme';

   function checkAlarm(callback) {
     chrome.alarms.getAll(function(alarms) {

       var hasAlarm = alarms.some(function(a) {
         return a.name == alarmName;
       });

       if (hasAlarm) {
        console.log("Reminders are ON");
        $('#off').attr('class','btn btn-sm locked_inactive btn-default');
         $('#on').attr('class','btn btn-sm unlocked_active btn-warning');
         $('#remtext').text("ON");
         $('#remtext').attr("class","bg-danger");
       }

       else {
        console.log("Reminders are OFF");
        $('#off').attr('class','btn btn-sm locked_active btn-warning');
        $('#on').attr('class','btn btn-sm unlocked_inactive btn-default');
        $('#remtext').text("OFF");
        $('#remtext').attr("class","bg-primary");

       }

      /* var newLabel;
       var newclass;
       if (hasAlarm) {
         newLabel = 'Turn Off Reminders';
         newclass = 'toggleAlarmOff';

       } else {
         newLabel = 'Turn On Reminders';
         newclass = 'toggleAlarmOn';
       }
       document.getElementById('toggleAlarm').innerText = newLabel;
       document.getElementById('toggleAlarm').className = newclass;*/
       if (callback) callback(hasAlarm);
     });
   }

   function createAlarm() {
      chrome.storage.local.set({'localdb': sessionStorage.userdatabase}, function (result) {
             
      });
     chrome.alarms.create(alarmName, {
       delayInMinutes: 0.1, periodInMinutes: 0.1});
   }

   function cancelAlarm() {
     chrome.alarms.clear(alarmName);
   }

   function doToggleAlarm() {
     checkAlarm( function(hasAlarm) {
       if (hasAlarm) {
         cancelAlarm();
       } else {
         createAlarm();
       }
       checkAlarm();
     });
   }

  //document.getElementById('toggleAlarm').addEventListener('click', doToggleAlarm);

  $('#toggle_event_editing button').click(function(){

          $('#toggle_event_editing button').eq(0).toggleClass('locked_inactive locked_active btn-default btn-warning');
          $('#toggle_event_editing button').eq(1).toggleClass('unlocked_inactive unlocked_active btn-warning btn-default');
          doToggleAlarm();
    });


  checkAlarm();

})();



