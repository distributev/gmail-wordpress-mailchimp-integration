# gmail-wordpress-mailchimp-integration
Build a Gmail contextual gadget similar (but much simpler) to - https://solve360.com/new/solve360-and-gmail-hook-up/
There are 3 parts to do the Gmail contextual gadget 


**Part1: The Google Apps Marketplace SDK Part**


**Steps to Publish**


based on this:
https://github.com/sbrudz/gadget-hello-world

Here are the steps I followed to get this published to the Google Apps Marketplace:

1.Go to the [Developer Console] (https://console.developers.google.com/) and create a new project

2.On the Dashboard for the new project under the "Use Google APIs" section, click "Enable and manage APIs".

3.Select the "Google Apps Marketplace SDK" under "Google Apps APIs"

  1. On the "Google Apps Marketplace SDK" page:
    1. Click the "Enable API" button
    1. Click the "Configuration" tab
    1. Click the "Create an OAuth 2.0 client ID" link, which will take you to the Credentials page
  1. On the Credentials page:
    1. Click the "Add credentials" link and choose the "OAuth 2.0 Client ID" option
    1. Click the "Configure Consent Screen" button
    1. Fill out the required information and click "Save".
    1. Under "Create client ID", do the following (per [these instructions](https://developers.google.com/api-client-library/javascript/start/start-js)):
      1. Choose Application type = Web application
      1. Enter the name of your app
      1. Enter your website root in "Authorized JavaScript origins"
      1. Leave "Authorized redirect URIs" blank
      1. Click "Create" and you should see a dialog displaying your client ID and client secret.  Record these in a safe place for later use.
  1. Go back to the API Manager Overview for this project by clicking "Overview" on the left.
  1. Select the "Google Apps Marketplace SDK" under "Google Apps APIs"
  1. On the "Google Apps Marketplace SDK" page:
    1. Click the "Configuration" tab
    1. Enter configuration info as follows:
      1. Add a description
      1. Add 4 icons of various sizes
      1. Add a URL for the Terms of Service.  for example : http://sbrudz.github.io/gadget-hello-world/tos.html
      1. In the extensions section, check the "Universal navigation extension" and enter a URL.  I used: https://github.com/distributev/gmail-wordpress-mailchimp-integration
      1. Then check the "Gmail contextual gadget extension" with:
        1. **Extractor URL:** google.com:SenderEmailExtractor
        1. **Gadget URL:** http://www.ispa-sa.com/gadget.xml
        1. **Extractor param name:** sender_email 
        1. **Extractor param value:** .*
        1. **Scopes:** "Mail - Sender Address" and "Mail - Sender Name"
    1. Click the "Save changes" button
    1. Click the "Test installation flow" button
    1. Click the "Accept" button
  1. The gadget should now be installed to your Gmail account
  1. Log into gmail with the clear gadget cache option set: https://mail.google.com/mail/u/0/?nogadgetcache=1
  1. Check that the gadget has been installed by clicking the "Google Apps" button in the upper right corner of Gmail and scrolling down in the resulting popup menu.

**Part2: The WordPress Part**

1.Install all plugins listed in the WpPlugins.png screenshot with exact versions and Wp-Rollback will help you to find the required version of each plugin. 

2.Define the Event pod with exact fields as WpPods.png

3.Change the .htaccess file in your wordpress website like the .htaccess file that exists in this project.

4.Add the php code that exists in the file newEndpoint.php in the wp-router/wp-router.php that comes with the wp-router.php


**Part3: The Google Apps script part**

1.From Google Drive click **New** Button, then click More -> Google Apps Script if not found in the menu click **Connect more Apps** and find it. 

2.When opening the new apps script file rename it with apropriate name and copy and paste code from "Gadget Helper.gs" file that exists with this project.

3.from Menu-> Deploy as wep app set options : **Execute the app as:** = "Me" and **Who has access to the app:** = "Anyone even anonymous" Click "Deploy" or "Update" then copy the Current web app URL 

4.This wep app URL should be replaced in line 227 and line 242 "everything before the -?- mark" in the Gadget.xml file



