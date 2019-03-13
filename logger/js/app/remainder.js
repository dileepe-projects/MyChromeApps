var notID = 0;
chrome.alarms.onAlarm.addListener(function( alarm ) {
 console.log("Request from app on: " + moment().format('MM/DD/YYYY hh:mm:ss a'));
 var request, db; 
 request = window.indexedDB.open("logger_app_logs", 1);
                    request.onerror = function(event){
                        console.log("Error opening DB", event);
                    }
 request.onsuccess  = function(event){
                        
                        db = event.target.result;
                        var store = db.transaction(['logs']).objectStore('logs');
                        store.openCursor().onsuccess = function(event) {
                              
                              var cursor = event.target.result;
                             
                              if (cursor) {
                                if(cursor.value.remainderrequired == "yes")
                                {
                                  var remainderdate = cursor.value.remainderdate;
                                  console.log("{" +"msg id: " + cursor.value.logid + ", " + "current date and time: "+ moment().format('MM/DD/YYYY hh:mm a') + ", " + "remainder date: " + remainderdate + ", " + "compared result: " + dates.compare(remainderdate,moment().format('MM/DD/YYYY hh:mm a')) + "}" );
                                  //console.log("current date and time: "+ moment().format('MM/DD/YYYY hh:mm a'));
                                  //console.log("remainder date: " + remainderdate);
                                  //console.log("compared result: " + dates.compare(remainderdate,moment().format('MM/DD/YYYY hh:mm a')) + "}");


                                  if ((dates.compare(remainderdate,moment().format('MM/DD/YYYY hh:mm a')) == 0))
                                  {
                                   
                                     
                                     
                                    console.log("time has come");
                                    var notOptions = [
                                          {
                                            type : "basic",
                                            iconUrl : "/css/external/images/logger.png",
                                            title: "LOG ALERT",
                                            message: cursor.value.message,
                                            expandedMessage: cursor.value.message,
                                            requireInteraction: true
                                          },
                                          {
                                            type : "image",
                                            title: "Image Notification",
                                            message: "Short message plus an image",
                                          }
                                          
                                        ];
                                        chrome.notifications.create('reminder'+notID++, notOptions[0] , function(notificationId) {});
                                        /*chrome.notifications.create("", notOptions[0], function(id) {
                                        timer = setTimeout(function(){chrome.notifications.clear(id);}, 2000);
                                        });*/
                                   }

                                   if ((dates.compare(remainderdate,moment().format('MM/DD/YYYY hh:mm a')) == -1))

                                   {

                                      setremainder(cursor.value.logid,"no","NA");                                       

                                   }


                                }

                                
                                
                                cursor.continue();
                              }
                              else {
                                
                              }
                            };

                    }
  
});


  function setremainder(logid, flag, rdate)

    {
       
        var logdb, newlogrequest, newrequest;
        var mydb = "logger_app_logs";
        var currentmessage = logid;
        newlogrequest = window.indexedDB.open(mydb, 1);
        newlogrequest.onsuccess = function(event) {
            logdb = event.target.result;
            newrequest = logdb.transaction(["logs"], "readwrite").objectStore("logs").get(currentmessage);
            newrequest.onerror = function(event) {
                console.log("couldn't find currentmessage");
            };
            newrequest.onsuccess = function(event) {
                var newobjectStore = logdb.transaction(["logs"], "readwrite").objectStore("logs");
                newrequest.result.remainderrequired = flag;
                newrequest.result.remainderdate = rdate;
                newobjectStore.put(newrequest.result);
                console.log("flag updated in db : {" + logid + ", " + flag +", " + rdate + "}");              

            }

        }

    }


// Source: http://stackoverflow.com/questions/497790
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}  