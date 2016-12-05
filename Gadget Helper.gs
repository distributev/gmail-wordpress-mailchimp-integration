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
  }else if (req == 'mc'){
    var result = getActivityOfEmail(email);
    ContentService.createTextOutput(JSON.stringify(result))
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



/////////////////// Mailchimp part 

var mc_apikey = 'mcapikey';
var mc_headers = { 
     'Authorization': 'Basic '  + mc_apikey
    };

// used to get subscriper hash in modifyMember function 
function md5(aStr) {
  var algorithm = Utilities.DigestAlgorithm.MD5; // default MD5
  aStr = aStr || "";  // default to empty string
  var signature = Utilities.computeDigest(algorithm, aStr,
                                      Utilities.Charset.US_ASCII)
  //Logger.log(signature);
  var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }   
  //Logger.log(signatureStr);
  return signatureStr;
}


function getActivityOfEmail(email){
 
  var data = getCampaignsList();
  for (var i=0 ; i<data.length ; i++){
    data[i]["activity"] = getCampaignEmailActivity2(data[i]["id"],email);
    Utilities.sleep(500);
  }
  var ndata = [];
  for (var i=0; i<data.length ; i++){
    if ((data[i]["activity"]["open_count"] == 0) && (data[i]["activity"]["click_count"] == 0)){
      continue;
    }
    
    var sdate = data[i]["time"];
    var year = sdate.substr(0,4);
    var month = sdate.substr(5,2) + 1 ;
    var day = sdate.substr(8,2);
    var hour = sdate.substr(11,2);
    var minute = sdate.substr(14,2);
    var sec = sdate.substr(17,2);
    
    var dt = new Date(year,month,day,hour,minute,sec);
    Logger.log(dt);
    var senton = Utilities.formatDate(dt,'GMT','MMM dd,yyyy HH:mm');
    
    ndata.push({name:data[i]["name"],sent_on:senton,to_email:email,opened:data[i]["activity"]["open_count"],clicked:data[i]["activity"]["click_count"]})
  }
  
  Logger.log(ndata);
  return {done:"OK",result:ndata};
}

function getCampaignEmailActivity2(campaignId,email){
//GET /reports/{campaign_id}/email-activity
try{
   
   var um_options = {  
   "method":"GET",
   "headers": mc_headers,
   "muteHttpExceptions" : true
  
   
   };
   var um_url = 'https://us3.api.mailchimp.com/3.0/reports/'+campaignId+'/email-activity/'+md5(email);  
   var um_response = UrlFetchApp.fetch(um_url, um_options);
   var json = um_response.getContentText();
   var data = JSON.parse(json);
   Logger.log(data["status"]);
   if (data["status"] != '404'){
     var actdata =data["activity"];
     var opencount = 0;
     var clickcount = 0;
     for (var i=0;i<actdata.length;i++){
       var opencount = 0;
       var clickcount = 0;
       
         if (actdata[i]["action"] == "open"){
           opencount++;
         }
         if (actdata[i]["action"] == "click"){
           clickcount++;
         }
         //actdata["open_count"] = opencount;
         //actdata["click_count"] = clickcount;
       
     
     }
     var result = {"open_count":opencount,"click_count":clickcount};
     return result;
     
   }
   else{
     return {open_count:0,click_count:0};
   }
   
}
 catch(e){
   Logger.log(e.message + "-" + e.lineNumber + ' - '+campaignId);
   return {open_count:0,click_count:0};
 }

}

function getCampaignEmailActivity(campaignId){
//GET /reports/{campaign_id}/email-activity
try{
   
   var um_options = {  
   "method":"GET",
   "headers": mc_headers,
   "muteHttpExceptions" : true
  
   
   };
   var um_url = 'https://us3.api.mailchimp.com/3.0/reports/'+campaignId+'/email-activity';  
   var um_response = UrlFetchApp.fetch(um_url, um_options);
   var json = um_response.getContentText();
   var data = JSON.parse(json);
   //Logger.log(data);
   var actdata =[];
   for (var i=0;i<data["emails"].length;i++){
     actdata.push({email:data["emails"][i]["email_address"],activity:data["emails"][i]["activity"]});
   }
   for (var i=0;i<actdata.length;i++){
     var opencount = 0;
     var clickcount = 0;
     for (var j=0; j<actdata[i]["activity"].length;j++){
       if (actdata[i]["activity"][j]["action"] == "open"){
         opencount++;
       }
       if (actdata[i]["activity"][j]["action"] == "click"){
         clickcount++;
       }
       actdata[i]["open_count"] = opencount;
       actdata[i]["click_count"] = clickcount;
     }
   
   }
   var data = [];
   for (var i=0;i<actdata.length;i++){
     if ((actdata[i]["open_count"] == null) && (actdata[i]["click_count"] == null)){
       continue;
     }
     data.push({email:actdata[i]["email"],open_count:actdata[i]["open_count"],click_count:actdata[i]["click_count"]});
   
   }
   return data;
}
 catch(e){
   Logger.log(e.message + "-" + e.lineNumber + ' - '+campaignId);
 
 }

}

function getCampaignsList(){
//GET /campaigns
try{
   
   var um_options = {  
   "method":"GET",
   "headers": mc_headers,
   "muteHttpExceptions" : true
  
   
   };
   var um_url = 'https://us3.api.mailchimp.com/3.0/campaigns';  
   var um_response = UrlFetchApp.fetch(um_url, um_options);
   var json = um_response.getContentText();
   var data = JSON.parse(json);
   var cdata = [];
   for (var i = 0 ;i<data["campaigns"].length ; i++){
     cdata.push({id:data["campaigns"][i]["id"],name: data["campaigns"][i]["settings"]["title"],time:data["campaigns"][i]["create_time"],emails_sent:data["campaigns"][i]["emails_sent"]});
   }
   return cdata;
 }
 catch(e){
   Logger.log(e.message + "-" + e.lineNumber);
 
 }
}

