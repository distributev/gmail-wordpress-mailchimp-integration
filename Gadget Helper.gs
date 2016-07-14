// https://script.google.com/macros/s/AKfycbzdkgpfWPrBUNWd8oe9uFg1KCjSBQjCcLuiCEx6Fcb3MuY2Nko/exec?req=contact&email=
// https://script.google.com/macros/s/AKfycbzdkgpfWPrBUNWd8oe9uFg1KCjSBQjCcLuiCEx6Fcb3MuY2Nko/exec?req=event&email=&etype=&desc=&notes=&edate=&sendemail=

function doGet(e){
  var req = e.parameter.req;
  var email = e.parameter.email;
  Logger.log(req);
  if (req == 'contact'){
    var result = getwpContact(email);
    ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  }else if (req == 'event'){
    var etype = e.parameter.etype;
    var desc = e.parameter.desc;
    var notes = e.parameter.notes;
    var edate = e.parameter.edate;
    var sendemail = e.parameter.sendemail;
    newEvent(etype,desc,notes,edate,sendemail,email);
    ContentService.createTextOutput('{status:"OK"}')
    .setMimeType(ContentService.MimeType.JSON);
  }else{
    var result = {'msg':'Error'}
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}


function newEvent(eventType,desc,notes,eventDate,sendemail,email){
  var um_url = 'http://mdkass.ispa-sa.com/wp-json/pods/event';
  var um_headers = {"Authorization":"Basic "+Utilities.base64Encode("user:password")};
                     
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
    if (sendemail == 1){
      MailApp.sendEmail(email, "New Event Created", "Event type:"+eventType+"\n"+
                                                    "Description:"+desc+"\n"+  
                                                    "Notes:"+notes+"\n"+  
                                                    "Date:"+eventDate+"\n");
    }
    Logger.log(json);
 }





function getwpContact(email) {
  var um_url = 'http://test.ispa-sa.com/wp/wp-json/wp/v2/ContactInfo';
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
