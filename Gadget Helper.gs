function doGet(e){
  var req = e.parameter.req;
  var email = e.parameter.email;
  Logger.log(req);
  if (req == 'contact'){
    var result = getwpContact(email);
    ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  }else{
    var result = {'msg':'Error'}
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
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
