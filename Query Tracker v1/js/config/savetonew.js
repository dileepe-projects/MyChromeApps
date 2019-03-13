/*
credits:
file browser and writer Code by
Eric Bidelman (ericbidelman@chromium.org) & Joe Marini (joemarini@google.com)

--modified as per my requirement - DILEEP.E
*/


function errorHandler(e) {
  console.error(e);
}



var savenewversionButton = document.getElementById('newversionsave');

savenewversionButton.addEventListener('click', function(){
    
    var newversion = "null";
    var author = sessionStorage.author;
    var totalqueries =  $('#hiddendiv input').length;
    var projectid = sessionStorage.projectid                  
    var projectname = sessionStorage.projectname
    var currentuser = sessionStorage.currentuser
    var oldfileversion = sessionStorage.oldfileversion
    var currentversion = sessionStorage.newfileversion;
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + d.getFullYear()

    

    var xml_1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n" + "<queryfile>" + "\n";
    var xml_2 = "<prid>" + projectid + "</prid>" + "\n" ;
    var xml_3 = "<prname>" + projectname + "</prname>" + "\n";
    var xml_4 = "<version>" + currentversion + "</version>" + "\n" ;
    var xml_5 = "<author>" + author + "</author>" + "\n" ;
    var xml_6 = "<lastupdatedby>" + currentuser + "</lastupdatedby>" + "\n" ;
    var xml_7 = "<lastupdatedate>" + output + "</lastupdatedate>" + "\n" ;
    var xml_8 = "";
    var xml_9 = "</queryfile>"

    

 
   for(i=1; i<=totalqueries; i++)
   {

   	xml_8 = xml_8 + "<Query>" + "\n"; 
   	xml_8 = xml_8 + "<sno>" + $("#q"+i).attr("sno-"+i) + "</sno>" + "\n";
   	xml_8 = xml_8 + "<question>" + $("#q"+i).attr("query-"+i) + "</question>" + "\n";
   	xml_8 = xml_8 + "<comments>" + $("#q"+i).attr("comments-"+i) + "</comments>" + "\n";
   	xml_8 = xml_8 + "<openeddate>" + $("#q"+i).attr("openeddate-"+i) + "</openeddate>" + "\n";
   	xml_8 = xml_8 + "<status>" + $("#q"+i).attr("qstatus-"+i) + "</status>" + "\n";
   	xml_8 = xml_8 + "<pendingwith>" + $("#q"+i).attr("pendingwith-"+i) + "</pendingwith>" + "\n";
   	xml_8 = xml_8 + "<closeddate>" + $("#q"+i).attr("closeddate-"+i) + "</closeddate>" + "\n";
	xml_8 = xml_8 + "</Query>" + "\n"
   	

   }

	var newversion = xml_1 + xml_2 + xml_3 + xml_4 + xml_5 + xml_6 + xml_7 + xml_8 + xml_9;
    sessionStorage.newfile = newversion;



    var config = {type: 'saveFile', suggestedName: sessionStorage.newfilename};
  	chrome.fileSystem.chooseEntry(config, function(writableEntry) {
    var blob = new Blob([newversion], {type: 'text/plain'});
    writeFileEntry(writableEntry, blob, function(e) {
      //console.log(writableEntry);
    });
  });


});




function writeFileEntry(writableEntry, opt_blob, callback) {
  if (!writableEntry) {
    console.log("error");
    return;
  }

  writableEntry.createWriter(function(writer) {

    writer.onerror = errorHandler;
    writer.onwriteend = callback;

    // If we have data, write it to the file. 
    if (opt_blob) {
      writer.truncate(opt_blob.size);
      waitForIO(writer, function() {
        writer.seek(0);
        writer.write(opt_blob);
        document.getElementById("savesuccessModal").className = "modal fade in";
        document.getElementById("savesuccessModal").setAttribute("style","display: block;");
        document.getElementById("yes").addEventListener('click', function(){
        	loadFileEntry(writableEntry); //call the loadfile function to reload the new data into the app
        	document.getElementById("savesuccessModal").className = "modal fade";
        	document.getElementById("savesuccessModal").setAttribute("style","display: none;");       	

        });	
        document.getElementById("no").addEventListener('click', function(){
        	 
        	document.getElementById("savesuccessModal").className = "modal fade";
        	document.getElementById("savesuccessModal").setAttribute("style","display: none;");       	

        });	

      });
    } 
    else {
      
       
    }
  }, errorHandler);
}

function waitForIO(writer, callback) {
  // set a watchdog to avoid eventual locking:
  var start = Date.now();
  // wait for a few seconds
  var reentrant = function() {
    if (writer.readyState===writer.WRITING && Date.now()-start<4000) {
      setTimeout(reentrant, 100);
      return;
    }
    if (writer.readyState===writer.WRITING) {
      console.error("Write operation taking too long, aborting!"+
        " (current writer readyState is "+writer.readyState+")");
      writer.abort();
    } 
    else {
      callback();
    }
  };
  setTimeout(reentrant, 100);
}


