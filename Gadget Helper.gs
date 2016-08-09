// https://script.google.com/macros/s/AKfycbzdkgpfWPrBUNWd8oe9uFg1KCjSBQjCcLuiCEx6Fcb3MuY2Nko/exec?req=contact&email=
// https://script.google.com/macros/s/AKfycbzdkgpfWPrBUNWd8oe9uFg1KCjSBQjCcLuiCEx6Fcb3MuY2Nko/exec?req=event&email=&etype=&desc=&notes=&edate=&sendEmail=
// The link of the log spreadsheet. 
//https://docs.google.com/spreadsheets/d/1_xUj5zizYTjrmP5xv2ZjMIV2C54Wjmd6uPcZMN4cOIY/edit?usp=sharing

var ssID = '1_xUj5zizYTjrmP5xv2ZjMIV2C54Wjmd6uPcZMN4cOIY'; //id of the log spreadsheet

//report log info to a google spreadsheet. 
function addLog(type,message){
  var ss = SpreadsheetApp.openById(ssID);   
  var sheet = ss.getSheetByName('logs');
  
  sheet.insertRowAfter(1);
  var range = sheet.getRange(2, 1, 1, 3);
  var d = Utilities.formatDate(new Date(),'GMT','yyyy-MM-dd HH:mm:ss')
  range.setValues([[type,message,d]]);
}


function doGet(e){
  var req = e.parameter.req;
  var email = e.parameter.email;
  Logger.log(req);
  if (req == 'contact'){
    var result = getContactDetails(email);
    ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  }else if (req == 'event'){
    var etype = e.parameter.etype;
    var desc = e.parameter.desc;
    var notes = e.parameter.notes;
    var edate = e.parameter.edate;
    var sendEmail = e.parameter.sendEmail;
    saveEvent(etype,desc,notes,edate,sendEmail,email);
    ContentService.createTextOutput('{status:"OK"}')
    .setMimeType(ContentService.MimeType.JSON);
  }else{
    var result = {'msg':'Error'}
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// use this to test the saveEvent function 
function testSaveEvent(){
  saveEvent('test Event','description for test','notes','08/08/2016',1,'mohammad.kassoumeh@hotmail.com');

}


function saveEvent(eventType,desc,notes,eventDate,sendEmail,email){
  try{
    var um_url = 'http://mdkass.ispa-sa.com/wp-json/pods/event';
    var um_headers = {"Authorization":"Basic "+Utilities.base64Encode("user:password")};
    //put your Wordpress user and password here
                       
    var um_options = {  
    "method":"POST",     
    "headers": um_headers,
    "payload":{"title":"created from Google gadget",
               "status":"Publish",
               "etype":eventType,"description":desc,"notes":notes,"edate":eventDate},
    "muteHttpExceptions":true
             }
       
   
    
      var um_response = UrlFetchApp.fetch(um_url, um_options);
      var json = um_response.getContentText();
      if (sendEmail == 1){
        MailApp.sendEmail(email, "New Event Created", "Event type:"+eventType+"\n"+
                                                      "Description:"+desc+"\n"+  
                                                      "Notes:"+notes+"\n"+  
                                                      "Date:"+eventDate+"\n");
      }
      Logger.log(json);
      addLog('Info','saveEvent responce: '+json); // an example how to use addLog function
   }catch (e) {
     Logger.log(e.message + "-" + e.lineNumber);
     addLog('Error','saveEvent: '+eventType+'  '+e.message + "-" + e.lineNumber);
     // another example how to use addLog function
   
   
   }
}




function test(){
  Logger.log(getContactDetails('mdkass@gmail.com'));
}

function getContactDetails(email) {
  var um_url = 'http://mdkass.ispa-sa.com/contact/'+email;
  var um_headers = {};

  var um_options = {  
  "method":"GET",     
  "headers": um_headers
           };
 
  try{
    var um_response = UrlFetchApp.fetch(um_url, um_options);
    var json = um_response.getContentText();
    return json;
    Logger.log(json);
 
  }catch(e){
 
  }
}
