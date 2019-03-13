$(document).ready(function() {

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            var logrequest, logdb; 
            var counter = 0;
            var logbody = document.getElementById("newmsgs");
            if(!window.indexedDB)
                {
                    console.log("Your Browser does not support IndexedDB");
                }
                else
                {
                    request = window.indexedDB.open("logger_app_logs", 1);
                    request.onerror = function(event){
                        console.log("Error opening DB", event);
                    }
                    request.onupgradeneeded   = function(event){
                        console.log("Logs db Upgrading");
                        db = event.target.result;
                        var objectStore = db.createObjectStore("logs", { keyPath : "logid", autoIncrement:true });
                    };
                    request.onsuccess  = function(event){
                        //console.log("Success opening user DB");
                        db = event.target.result;

                        var store = db.transaction(['logs']).objectStore('logs');
                        var count = store.count();
                        count.onsuccess = function() {
                        console.log("logs present: " + count.result);
                        sessionStorage.logcount = count.result; 
                        sessionStorage.oldlogs = count.result;    
                         $('#oldlogbg').text(sessionStorage.oldlogs);
                        if(count.result>0)
                        {
                            $('#existinglogs').prop('disabled', false);
                            
                            readmsg();
                            
                        }
                        

                                       
                        }                       
                        
                    }
                }


    


    $('#textArea').keypress(function(event) {
        // Check the keyCode and if the user pressed Enter without shift then prevent default event                      
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();


        }
    });

    $('#textArea').keyup(function(e) {
        // Check the keyCode and if the user pressed Enter without shift then add message
        if (e.keyCode == 13 && !e.shiftKey) {
            addmsg();

        }
    });


    $("#submitbttn").click(function() {

        addmsg();

    });

     
    


    function addmsg() {

        

        var elem = document.getElementById('logbody');
        elem.scrollTop = elem.scrollHeight;  
        //console.log(elem.scrollHeight - elem.scrollTop === elem.clientHeight);
        
        var newline = document.createElement('br');
        var logs = parseInt(sessionStorage.logcount) + 1;
        var currentdate = new Date().toLocaleString();
        //console.log(moment().format('MM/DD/YYYY hh:mm a')); 
       
        //04/30/2016 02:04:27 pm
        
        counter = parseInt(sessionStorage.logcount) + 1;
        if ($('#textArea').val() == "") {
            return;
        }
        var spandiv = document.createElement('span');
        spandiv.className = "timespan";
        spandiv.textContent = currentdate + "   ";        
        var logdiv = document.createElement('div');
        logdiv.id = "msg" + counter;
        logdiv.className = "bubble-border left";
        logdiv.textContent = $('#textArea').val();
        logdiv.setAttribute("flagged", "no");
        var flagspan = document.createElement('span');
        flagspan.id = "divflag-" + counter;
        flagspan.className = "glyphicon glyphicon-bell";
        logdiv.appendChild(flagspan);               
        logbody.appendChild(logdiv);
        logbody.appendChild(spandiv)
        logbody.appendChild(newline);

        sessionStorage.counter = counter;
        $('#textArea').val("");
        var c = counter;
        //var logid = "#msg" + logs;
        var logid = logs;
        var logmessage = $('#msg' + c).text();
        var remainder = $('#msg' + c).attr("flagged");
        var loggeddate = currentdate;

        var logtransaction = db.transaction(["logs"],"readwrite");     
                    logtransaction.oncomplete = function(event) {
                    console.log(logid + " added to database");
                    sessionStorage.logcount = logs;
                     
                    };
                    logtransaction.onerror = function(event) {
                    console.log("unable to add msg to database");
                    };
                    var newobjectStore = logtransaction.objectStore("logs");
                    newobjectStore.add({
                        logid: logid,
                        message: logmessage,
                        remainderrequired: remainder,
                        remainderdate: "NA",
                        msgdate: loggeddate
                    });
          $('#divflag-' + c).click(function() {

            

            var flag = $('#msg' + c).attr("flagged");

            if (flag == "yes") {

                $('#msg' + c).attr("class", "bubble-border left");
                $('#msg' + c).attr("flagged", "no");
                $('#divflag-' + c).removeAttr("data-toggle");
                $('#divflag-' + c).removeAttr("title");
                $('#divflag-' + c).removeAttr("style");
                setremainder(logid, "no", "NA");

            } else {

                  $('#pickdate').datetimepicker({
                                                
                                                controlType: 'select',
                                                
                                                oneLine: true,
                                                
                                                timeFormat: "hh:mm tt",                                                                                                
                                                
                                                numberOfMonths: 1,

                                                minDate: 0
                                                
                                                
                                              });
                 var dmodal = document.getElementById("dmodal");
                 var button1 = document.createElement("button");
                 button1.id = "setremainder-" + c;
                 button1.className="btn btn-warning btn-sm";
                 button1.innerText = "Set Reminder ";
                 var remaindersym = document.createElement("span");
                 remaindersym.className = "glyphicon glyphicon-time";
                 remaindersym.setAttribute("aria-hidden","true");
                 button1.appendChild(remaindersym);
                 dmodal.appendChild(button1);
                 var button2 = document.createElement("button");
                 button2.id = "cancelremainder-" + c;
                 button2.className="btn btn-danger btn-sm";
                 button2.innerText = "Cancel ";
                 var cancelsym = document.createElement("span");
                 cancelsym.className = "glyphicon glyphicon-remove-sign";
                 cancelsym.setAttribute("aria-hidden","true");
                 button2.appendChild(cancelsym);
                 dmodal.appendChild(button2);
                 $('#dtpicker').modal('show'); 
                 $('#setremainder-'+c).click(function() {

                    var remainderdate = $('#pickdate').val();   

                     if ((dates.compare(remainderdate,new Date().toLocaleString()) == -1)||(dates.compare(remainderdate,new Date().toLocaleString()) == 0))
                    {
                      $('#errmsg2').text(" Not right time");
                      $('#errmsgdiv2').show();
                      return;
                    }

                     if(remainderdate == "") {        $('#errmsg2').text(" select date and time");
                                    $('#errmsgdiv2').show();   return;}

                    $('#msg' + c).attr("class", "flagged left");
                    $('#msg' + c).attr("flagged", "yes");
                    $('#divflag-' + c).attr("style", "color:red");
                    $('#divflag-' + c).attr("data-toggle","tooltip");
                    $('#divflag-' + c).attr("title","will be remainded on: " + remainderdate);
                    console.log("flag clicked:" + logid);
                    setremainder(logid, "yes", remainderdate);

                     
                    //console.log(dates.compare(testdate,remainderdate)); --needthis later
                    
                });


                $('#cancelremainder-'+c).click(function() {

                  $('#pickdate').val("");
                   $('#errmsgdiv2').hide();
                    $("#dmodal").empty();
                    $('#dtpicker').modal('hide');
                });            
                
             }
            



        });


  }





       


    function setremainder(logid, flag, rdate)

    {
       
        var logdb, newlogrequest, request;
        var mydb = "logger_app_logs";
        var currentmessage = logid;
        newlogrequest = window.indexedDB.open(mydb, 1);
        newlogrequest.onsuccess = function(event) {
            logdb = event.target.result;
            request = logdb.transaction(["logs"], "readwrite").objectStore("logs").get(currentmessage);
            request.onerror = function(event) {
                console.log("couldn't find currentmessage");
            };
            request.onsuccess = function(event) {
                var newobjectStore = logdb.transaction(["logs"], "readwrite").objectStore("logs");
                request.result.remainderrequired = flag;
                request.result.remainderdate = rdate;
                newobjectStore.put(request.result);
                console.log("flag added in db : {" + logid + ", " + flag +", " + rdate + "}");
                $('#dtpicker').modal('hide');
                     $('#pickdate').val("");
                     $("#dmodal").empty();
                     $('#errmsgdiv2').hide();

            }

        }

    }


    function readmsg() {



        var readrequest, database;
        readrequest = window.indexedDB.open("logger_app_logs", 1);
                    readrequest.onerror = function(event){
                        console.log("Error opening DB", event);
                    }

        readrequest.onsuccess  = function(event){

            database = event.target.result;
            var cstore = database.transaction(['logs']).objectStore('logs');  
                        cstore.openCursor().onsuccess = function(event) {
                              
                              var cursor = event.target.result;
                              if (cursor) {
                                 
                                var oldmsgs = document.getElementById('oldmsgs');
                                var newline = document.createElement('br');
                                var spandiv = document.createElement('span');
                                spandiv.className = "timespanold";
                                spandiv.textContent = cursor.value.msgdate + "   ";        
                                var logdiv = document.createElement('div');
                                logdiv.id = "msg"+cursor.value.logid;
                                //logdiv.className = "bubble-border left"; 
                               // logdiv.textContent = cursor.value.message;
                                //logdiv.setAttribute("flagged", cursor.value.remainderrequired);
                                                                                         
                                var flagspan = document.createElement('span');
                                flagspan.id = "divflag-" + cursor.value.logid;                              

                               
                                if(cursor.value.remainderrequired == "yes")
                                {
                                    logdiv.className = "flagged left";
                                    flagspan.className = "glyphicon glyphicon-bell";
                                    flagspan.setAttribute("style", "color:red");
                                    flagspan.setAttribute("data-toggle","tooltip");
                                    flagspan.setAttribute("title","will be remainded on: " + cursor.value.remainderdate);

                                }

                                else
                                {
                                    logdiv.className = "bubble-borderold left";    
                                }

                               logdiv.textContent = cursor.value.message;
                               logdiv.setAttribute("flagged", cursor.value.remainderrequired);
                               

                                logdiv.appendChild(flagspan);               
                                oldmsgs.appendChild(logdiv);
                                oldmsgs.appendChild(spandiv)
                                oldmsgs.appendChild(newline);
                                cursor.continue();

                              }
                              else {
                               
                              }


                          }                       

        }


    }




});


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
