/*
credits:
file browser and reader Code by
Eric Bidelman (ericbidelman@chromium.org) & Joe Marini (joemarini@google.com)

--modified as per my requirement - DILEEP.E
*/

var chosenEntry = null;
var chooseFileButton = document.querySelector('#choose_file');
var output = document.querySelector('output');
var xmlDoc = null;



function errorHandler(e) {
  console.error(e);
}

function displayEntryData(theEntry) {
  if (theEntry.isFile) {
    chrome.fileSystem.getDisplayPath(theEntry, function(path) {
     
      $("#file_path").text(path);
     
    });
    theEntry.getMetadata(function(data) {
     
      $("#file_size").text(data.size);
           
    });    
  }
  else {

     $("#file_path").text() = theEntry.fullPath;
   
     $("#file_size").text() = "N/A";
   
  }
}



function readAsText(fileEntry, callback) {
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onerror = errorHandler;
    reader.onload = function(e) {
      callback(e.target.result);
    };

    reader.readAsText(file);
  });
}//end of function readAsText



function loadFileEntry(_chosenEntry) {
  chosenEntry = _chosenEntry;
  
  chosenEntry.file(function(file) {
  readAsText(chosenEntry, function(result) {
  openqs = 0;
  closedqs = 0;
  sessionStorage.oldfile = result; //session storage
  sessionStorage.oldfilename = chosenEntry.name;

  show(document.getElementById('oldfiledetails'));
  output.textContent = '';  
  
  document.getElementById("newversionsave").setAttribute("disabled","true");
     
  writedata(result);    

    });   
    displayEntryData(chosenEntry);
  });
} //end of function loadFileEntry



chooseFileButton.addEventListener('click', function(e) {
  var accepts = [{
   
    description : 'Query Files (*.query)',
    extensions: ['query'] //queryfile extension check to load only applicable documents for this app
    
  }];

  var acceptsAllTypes = false;
  chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts, acceptsAllTypes }, function(theEntry) {
    if (!theEntry) {
      output.textContent = 'No file selected.';
      hide(document.getElementById('oldfiledetails'));

      return;
    } 
    
    loadFileEntry(theEntry);
  });
}); //end of function for chooseFileButton event





function writedata(result)
{

     
    $("#hiddendiv").empty();
    $("#qmodals").empty();
      
     show(document.getElementById('close_file'));
     document.getElementById('close_file').setAttribute("style","pointer");
     
     var filename = null;
     var fileversion = null;
     var prid = null;
     var prname = null;
     var author = null;
     var lastupdatedby = null;
     var lastupdatedate = null;
    
     var serialno = new Array();
     var queries = new Array();
     var remarks = new Array();
     var queryopendate = new Array();
     var querystatus = new Array();
     var querypendingwith = new Array();
     var querycloseddate = new Array();
     var arraylen = 1;
     
     xmlDoc = $.parseXML(result);
     $xml = $(xmlDoc);     


     fileversion = $xml.find("version").text();
     prid = $xml.find("prid").text();
     prname = $xml.find("prname").text();
     author = $xml.find("author").text();
     lastupdatedby = $xml.find("lastupdatedby").text();
     lastupdatedate = $xml.find("lastupdatedate").text();
     newfileversion = (parseFloat(fileversion) + parseFloat(0.1)).toFixed(1); //tofixed keeps the decimals as you wish
     var str = sessionStorage.oldfilename;  
     var newfilename = str.split('v')[0] + "v" + newfileversion + ".query";
     sessionStorage.newfilename = newfilename;

     $("#file_version").text(fileversion);
     $("#pr_id").text(" "+prid);
     $("#pr_name").text(prname);
     $("#lastupdated_by").text(lastupdatedby);
     $("#lastupdated_at").text(lastupdatedate);

     sessionStorage.oldfileversion = fileversion; //session storage --can change
     sessionStorage.newfileversion = newfileversion; //session storage --can change
     sessionStorage.projectid = prid; //session storage
     sessionStorage.projectname = prname; //session storage     
     sessionStorage.author = author; //session storage
     sessionStorage.lastupdatedby = lastupdatedby; //session storage --can change
     sessionStorage.lastupdateddate = lastupdatedate; //session storage --can change
     



      
          //SNO values    
          $serialno = $xml.find("sno");
          $.each($serialno, function() {
            serialno[arraylen] = $(this).text();
            arraylen++;
          });     

          arraylen = 1; //reset the variable

          //Queries values
          $queries = $xml.find("question");
          $.each($queries, function() {
            queries[arraylen] = $(this).text();
            arraylen++;
          }); 

          arraylen = 1; //reset the variable

          //Remarks or comments values
          $remarks = $xml.find("comments");
          $.each($remarks, function() {
            remarks[arraylen] = $(this).text();
            arraylen++;
          }); 

          arraylen = 1; //reset the variable

          //open date values
          $queryopendate = $xml.find("openeddate");
          $.each($queryopendate, function() {
            queryopendate[arraylen] = $(this).text();
            arraylen++;
          }); 

          arraylen = 1; //reset the variable

          //status values
          $querystatus = $xml.find("status");
          $.each($querystatus, function() {
            querystatus[arraylen] = $(this).text().toLowerCase();
            arraylen++;
          }); 

          arraylen = 1; //reset the variable

          //pending with values
          $querypendingwith = $xml.find("pendingwith");
          $.each($querypendingwith, function() {
            querypendingwith[arraylen] = $(this).text();
            arraylen++;
          }); 

          arraylen = 1; //reset the variable


          $querycloseddate = $xml.find("closeddate");
          $.each($querycloseddate, function() {
            querycloseddate[arraylen] = $(this).text();
            arraylen++;
          }); 
          
     
     var totalqueries = (queries.length)-1;
     

     for (a=1; a<=totalqueries; a++)
     
     {

      var hiddendiv = document.getElementById("hiddendiv");
      var hiddendata = document.createElement("input");
      hiddendata.id = "q"+a;
      hiddendata.type = "hidden";
      hiddendata.setAttribute("sno-"+a, serialno[a]);
      hiddendata.setAttribute("query-"+a, queries[a]);                                                             
      hiddendata.setAttribute("comments-"+a,remarks[a]);
      hiddendata.setAttribute("openeddate-"+a,queryopendate[a]);
      hiddendata.setAttribute("qstatus-"+a,querystatus[a]);
      hiddendata.setAttribute("pendingwith-"+a,querypendingwith[a]);
      hiddendata.setAttribute("closeddate-"+a,querycloseddate[a]);
      hiddendiv.appendChild(hiddendata);    
      

     }
              

      createQueryButtons();

} //end of function writedata



function createQueryButtons()
{

     
      $("#tableopenq").empty();
      $("#tablecloseq").empty();

        var newtotalqueries = $('#hiddendiv input').length;
        var openqs = 0;
        var closedqs = 0;
        var newserialno = new Array();
        var newqueries = new Array();
        var newremarks = new Array();
        var newqueryopendate = new Array();
        var newquerystatus = new Array();
        var newquerypendingwith = new Array();
        var newquerycloseddate = new Array();



        for(c=1; c<=newtotalqueries; c++)
        {
          
          newserialno[c] = $("#q"+c).attr("sno-"+c);
          newqueries[c]  = $("#q"+c).attr("query-"+c);
          newremarks[c]  = $("#q"+c).attr("comments-"+c);
          newqueryopendate[c] = $("#q"+c).attr("openeddate-"+c);
          newquerystatus[c] = $("#q"+c).attr("qstatus-"+c);
          newquerypendingwith[c] = $("#q"+c).attr("pendingwith-"+c);
          newquerycloseddate[c] = $("#q"+c).attr("closeddate-"+c);

          var opentablediv = document.getElementById("tableopenq");
          var opentableelement = document.createElement("table");
          opentableelement.id= "openqueryTable";
          opentableelement.className = "table table-condensed";
          opentableelement.setAttribute("style","display:none");
          var opentablehead = document.createElement("thead");
          var opentableheadingtr = document.createElement("tr");
          //var opentableheadingth1 = document.createElement("th");
          //opentableheadingth1.textContent = "SNO";
          var opentableheadingth2 = document.createElement("th");
          opentableheadingth2.textContent = "QUERY";
          var opentableheadingth3 = document.createElement("th");
          opentableheadingth3.textContent = "COMMENTS";
          //opentableheadingtr.appendChild(opentableheadingth1);
          opentableheadingtr.appendChild(opentableheadingth2);
          opentableheadingtr.appendChild(opentableheadingth3);
          opentablehead.appendChild(opentableheadingtr);
          opentableelement.appendChild(opentablehead);
          opentablediv.appendChild(opentableelement);


          var closetablediv = document.getElementById("tablecloseq");
          var closetableelement = document.createElement("table");
          closetableelement.id= "closequeryTable";
          closetableelement.className = "table table-condensed";
          closetableelement.setAttribute("style","display:none");
          var closetablehead = document.createElement("thead");
          var closetableheadingtr = document.createElement("tr");
          //var closetableheadingth1 = document.createElement("th");
          //closetableheadingth1.textContent = "SNO";
          var closetableheadingth2 = document.createElement("th");
          closetableheadingth2.textContent = "QUERY";
          var closetableheadingth3 = document.createElement("th");
          closetableheadingth3.textContent = "COMMENTS";
          //closetableheadingtr.appendChild(closetableheadingth1);
          closetableheadingtr.appendChild(closetableheadingth2);
          closetableheadingtr.appendChild(closetableheadingth3);
          closetablehead.appendChild(closetableheadingtr);
          closetableelement.appendChild(closetablehead);
          closetablediv.appendChild(closetableelement);




          if($("#q"+c).attr("qstatus-"+c)=="open")
          {
              openqs = openqs + 1;
              document.getElementById("openqueryTable").removeAttribute("style");
              var table = document.getElementById("openqueryTable");
              var opentablebody = document.createElement("tbody");
              var opentablebodytr = document.createElement("tr");
              opentablebodytr.id = c;
              opentablebodytr.className = "warning";
              opentablebodytr.setAttribute("style","cursor:pointer");
              //var opentablebodytd1 = document.createElement("td");
              var opentablebodytd2 = document.createElement("td");              
              var opentablebodytd3 = document.createElement("td");             
              //opentablebodytd1.textContent = newserialno[c];
              opentablebodytd2.textContent = newqueries[c];
              opentablebodytd3.textContent = newremarks[c];
              //opentablebodytr.appendChild(opentablebodytd1);
              opentablebodytr.appendChild(opentablebodytd2);
              opentablebodytr.appendChild(opentablebodytd3);
              opentablebody.appendChild(opentablebodytr);
              table.appendChild(opentablebody);
              var nbutton = document.getElementById(c);
              nbutton.setAttribute("data-toggle","tooltip");
              nbutton.setAttribute("title","QUERY NO: "+newserialno[c]);
              nbutton.addEventListener("click", openModal(nbutton,c, newserialno, newqueries, newremarks, newqueryopendate, newquerystatus, newquerypendingwith, newquerycloseddate));
              

          }

          if($("#q"+c).attr("qstatus-"+c)=="closed")
          {

              closedqs = closedqs + 1;
              document.getElementById("closequeryTable").removeAttribute("style");
              var closetable = document.getElementById("closequeryTable");
              var closetablebody = document.createElement("tbody");
              var closetablebodytr = document.createElement("tr");
              closetablebodytr.id = c;
              closetablebodytr.className ="success";
              closetablebodytr.setAttribute("style","cursor:pointer");
              //var closetablebodytd1 = document.createElement("td");
              var closetablebodytd2 = document.createElement("td");
              var closetablebodytd3 = document.createElement("td");
              //closetablebodytd1.textContent = newserialno[c];
              closetablebodytd2.textContent = newqueries[c];
              closetablebodytd3.textContent = newremarks[c];
              //closetablebodytr.appendChild(closetablebodytd1);
              closetablebodytr.appendChild(closetablebodytd2);
              closetablebodytr.appendChild(closetablebodytd3);
              closetablebody.appendChild(closetablebodytr);
              closetable.appendChild(closetablebody);
              var nbutton = document.getElementById(c);
              nbutton.setAttribute("data-toggle","tooltip");
              nbutton.setAttribute("title","QUERY NO: "+newserialno[c]);
              nbutton.addEventListener("click", openModal(nbutton,c, newserialno, newqueries, newremarks, newqueryopendate, newquerystatus, newquerypendingwith, newquerycloseddate));



          }

        }

       
        $("#tableopenbg").text(openqs);
        
        $("#tableclosebg").text(closedqs);
        sessionStorage.openqueries = openqs; //session storage --can change
        sessionStorage.closedqueries = closedqs; //session storage --can change


} //end of function createQueryButtons



function openModal(nbutton,c, newserialno, newqueries, newremarks, newqueryopendate, newquerystatus, newquerypendingwith, newquerycloseddate) 

 {  

            var qmodal = document.getElementById("qmodals");

            var modalDiv = document.createElement('div');

            modalDiv.id = "queryModal-"+c;
            modalDiv.className = "modal fade";
            modalDiv.setAttribute("role","dialog");
            modalDiv.setAttribute("data-keyboard","false");
            modalDiv.setAttribute("data-backdrop","static");
            
            qmodal.appendChild(modalDiv);
            var modaldailogdiv = document.createElement("div");
            modaldailogdiv.className = "modal-dialog";
            modalDiv.appendChild(modaldailogdiv);

            //modal content
            var modalcontentdiv = document.createElement("div");
            modalcontentdiv.className = "modal-content";
            modaldailogdiv.appendChild(modalcontentdiv);

            //modal header

            var modalheaderdiv = document.createElement("div");
            modalheaderdiv.className = "modal-header1"; 
            var title = document.createElement("h4");
            title.className = "modal-title";
            title.innerText = "UPDATE QUERY";
            var modalclosebutton = document.createElement("button");
            modalclosebutton.className = "close";           
            modalclosebutton.setAttribute("aria-hidden","true");
            modalclosebutton.id = "close-modal" + c;
            modalclosebutton.innerText = "Close";
            modalheaderdiv.appendChild(modalclosebutton);
            modalheaderdiv.appendChild(title);
            modalcontentdiv.appendChild(modalheaderdiv);


            //modal body
            var modalbodydiv = document.createElement("div");
            modalbodydiv.className = "modal-body1";
            modalbodydiv.style = "display:block;"
            modalcontentdiv.appendChild(modalbodydiv);                          

            //query
            var queryinput = document.createElement("textarea");
            var queryinputlabel = document.createElement("label");
            var newline = document.createElement('br');
            queryinputlabel.textContent = "QUERY " + c + ":";
            queryinput.id = "QUERY" + c;
            queryinput.className = "form-control"
            queryinput.value = document.getElementById("q"+c).getAttribute("query-"+c);
            modalbodydiv.appendChild(queryinputlabel);
            modalbodydiv.appendChild(queryinput);
            modalbodydiv.appendChild(newline);

            //comments for query
            var querycomments = document.createElement("textarea");
            var querycommentslabel = document.createElement("label");
            querycommentslabel.textContent = "\n" + "COMMENTS: ";
            querycomments.id = "QUERYCOMMENTS"+c;
            querycomments.className = "form-control"
            querycomments.value = document.getElementById("q"+c).getAttribute("comments-"+c); 
            modalbodydiv.appendChild(querycommentslabel);
            modalbodydiv.appendChild(querycomments);

            //status of ticket
            var newline = document.createElement('br');
            var statuslabel = document.createElement("label");
            statuslabel.textContent = "STATUS: "; 
            var statusselect = document.createElement("select");
            statusselect.className = "form-control";
            statusselect.id = "selectstatus" + c;                          
            var openoption = document.createElement("option");
            openoption.value = "open";
            openoption.id = "openoptionid"+c;
            openoption.innerText = "open";
            var closeoption = document.createElement("option");
            closeoption.value = "closed";
            closeoption.id = "closedoptionid"+c;
            closeoption.innerText = "closed";
            statusselect.appendChild(openoption);
            statusselect.appendChild(closeoption);
            modalbodydiv.appendChild(newline);
            modalbodydiv.appendChild(statuslabel);
            modalbodydiv.appendChild(statusselect);
                           

                          
                          if(document.getElementById("q"+c).getAttribute("qstatus-"+c) == "open")
                          {
                            openoption.setAttribute("selected","true");
                          }

                          if(document.getElementById("q"+c).getAttribute("qstatus-"+c) =="closed")
                          {
                            closeoption.setAttribute("selected","true");
                            
                          }


            //ticket open date
            var newline = document.createElement('br');
            var opendatelabel = document.createElement("label");
            opendatelabel.textContent = "OPEN DATE: ";
            var opendateinput = document.createElement("input");
            opendateinput.type = "text";
            opendateinput.value = document.getElementById("q"+c).getAttribute("openeddate-"+c);
            opendateinput.id = "opendate"+c;
            opendateinput.className = "form-control clsDatePicker";
            opendateinput.setAttribute("readonly","readonly");
            modalbodydiv.appendChild(newline);
            modalbodydiv.appendChild(opendatelabel);
            modalbodydiv.appendChild(opendateinput);
            var idstring = "#opendate" + c;
            dopendatechooser(idstring);

            //ticket close date
            var newline = document.createElement('br');
            var closedatelabel = document.createElement("label");
            closedatelabel.textContent = "CLOSED DATE: ";
            var closedateinput = document.createElement("input");
            closedateinput.type = "text";
            closedateinput.value = document.getElementById("q"+c).getAttribute("closeddate-"+c);
            closedateinput.id = "closedate"+c;
            closedateinput.className = "form-control clsDatePicker";
            closedateinput.setAttribute("readonly","readonly");
            modalbodydiv.appendChild(newline);
            modalbodydiv.appendChild(closedatelabel);
            modalbodydiv.appendChild(closedateinput);



            //pendingwith
            var pendinginput = document.createElement("input");
            var pendinginputlabel = document.createElement("label");
            var newline = document.createElement('br');
            pendinginputlabel.textContent = "PENDING WITH: ";
            pendinginput.className = "form-control"
            pendinginput.id = "pendinginput"+c;
            pendinginput.value = document.getElementById("q"+c).getAttribute("pendingwith-"+c);
            modalbodydiv.appendChild(newline);
            modalbodydiv.appendChild(pendinginputlabel);
            modalbodydiv.appendChild(pendinginput);
            





            //save button
            var modalfooterdiv = document.createElement("div");
            modalfooterdiv.className = "modal-footer";                         
            var modalsavebutton = document.createElement("button");
            modalsavebutton.className = "btn btn-success";
            //modalclosebutton.setAttribute("data-dismiss","modal");
            modalsavebutton.setAttribute("aria-hidden","true");
            modalsavebutton.id = "save-modal" + c;
            modalsavebutton.innerText = "SAVE";
            var errmsg = document.createElement("span");
            errmsg.id = "saveerr"+c;
            errmsg.className = "msgclass";


            //resetbutton
            var modalresetbutton = document.createElement("button");
            modalresetbutton.className = "btn btn-danger";
            modalresetbutton.setAttribute("aria-hidden","true");
            modalresetbutton.id = "reset-modal" + c;
            modalresetbutton.innerText = "RESET";

            modalfooterdiv.appendChild(errmsg);
            modalfooterdiv.appendChild(modalsavebutton);
            modalfooterdiv.appendChild(modalresetbutton);
            modalcontentdiv.appendChild(modalfooterdiv);

            document.getElementById("reset-modal"+c).setAttribute("data-toggle","tooltip");
            document.getElementById("reset-modal"+c).setAttribute("title","resets current query details to last saved draft");

                          
                                            
             //don't allow enter action in text areas

            $('textarea').keypress(function(event) {
                      // Check the keyCode and if the user pressed Enter (code = 13) 
                      // disable it
                      if (event.keyCode == 13) {
                          event.preventDefault();
                      }
                  });            
            
            
              var selectstatusvalue = document.getElementById("selectstatus" + c).value;

              if (selectstatusvalue == "closed")

                 {
                     var idstring = "#closedate" + c;
                     dclosedatechooser(idstring);
                 }                          

                        
            //when ticket status changed add or remove date picker

              $( "#selectstatus"+c ).change(function() {
                        //console.log("changed");
                        selectstatusvalue = document.getElementById("selectstatus" + c).value;
                         if(selectstatusvalue == "open")
                             {
                                var idstring = "#closedate" + c;
                                $(idstring).datepicker("destroy"); 
                                document.getElementById("closedate"+c).value = "NA";
                             }  

                          else 
                              {
                                var idstring = "#closedate" + c;
                                dclosedatechooser(idstring);                                     
                              }  
                            });



                           $( "#close-modal"+c ).click(function() {                              
                              document.getElementById("close-modal" + c).setAttribute("data-dismiss","modal");                                

                             });

                            $( "#save-modal"+c ).click(function() {

                               if(selectstatusvalue == "closed" && (document.getElementById("closedate"+c).value == "NA"||document.getElementById("closedate"+c).value == "SELECT CLOSED DATE"))
                                      {
                                        document.getElementById("closedate"+c).value = "SELECT CLOSED DATE";
                                        document.getElementById("saveerr"+c).textContent = "*close date is required!"
                                                                                 
                                      }
                               else
                                  { 

                                     //$("QUERY" + c).val().replace(/\r\n|\r|\n/g,"<br />")
                                     

                                     document.getElementById("saveerr"+c).textContent = ""
                                     document.getElementById("q"+c).setAttribute("query-"+c, document.getElementById("QUERY"+c).value);                                     
                                     document.getElementById("q"+c).setAttribute("comments-"+c, document.getElementById("QUERYCOMMENTS"+c).value); 
                                     document.getElementById("q"+c).setAttribute("qstatus-"+c, document.getElementById("selectstatus" + c).value);                                
                                     document.getElementById("q"+c).setAttribute("openeddate-"+c, document.getElementById("opendate"+c).value);                                                       
                                     document.getElementById("q"+c).setAttribute("closeddate-"+c, document.getElementById("closedate"+c).value);
                                     document.getElementById("q"+c).setAttribute("pendingwith-"+c, document.getElementById("pendinginput"+c).value);
                                     document.getElementById("newversionsave").removeAttribute("disabled");
                                     createQueryButtons();
                                  }
                             });

                           $( "#reset-modal"+c ).click(function() {
                             document.getElementById("QUERY"+c).value = $("#q"+c).attr("query-"+c);
                             document.getElementById("QUERYCOMMENTS"+c).value = $("#q"+c).attr("comments-"+c);                             
                             document.getElementById("selectstatus" + c).value = $("#q"+c).attr("qstatus-"+c);
                             document.getElementById("opendate"+c).value = $("#q"+c).attr("openeddate-"+c);
                             document.getElementById("closedate"+c).value = $("#q"+c).attr("closeddate-"+c);
                             document.getElementById("pendinginput"+c).value = $("#q"+c).attr("pendingwith-"+c);
                              
                                                         
                             });
                          
  nbutton.setAttribute("data-toggle", "modal"); 
  nbutton.setAttribute("data-target", "#queryModal-"+c); 

 
 }//end of function openModal

 


function dopendatechooser(idstring) {

$(idstring).datepicker({
                             dateFormat: 'mm/dd/yy',                            
                             changeMonth: true,
                             changeYear: true,                             
                             });

}//end of function dopendatechooser


function dclosedatechooser(idstring) {

$(idstring).datepicker({
                             dateFormat: 'mm/dd/yy',                            
                             changeMonth: true,
                             changeYear: true,  
                             minDate: 0                           
                             });

}//end of function dopendatechooser