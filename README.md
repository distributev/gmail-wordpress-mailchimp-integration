# gmail-wordpress-mailchimp-integration
Build a Gmail contextual gadget similar (but much simpler) to - https://solve360.com/new/solve360-and-gmail-hook-up/

**Steps to Publish**

Here are the steps I followed to get this published to the Google Apps Marketplace:

1.Go to the [Developer Console] (https://console.developers.google.com/) and create a new project

2.On the Dashboard for the new project under the "Use Google APIs" section, click "Enable and manage APIs".

3.Select the "Google Apps Marketplace SDK" under "Google Apps APIs"

On the "Google Apps Marketplace SDK" page:
Click the "Enable API" button
Click the "Configuration" tab
Click the "Create an OAuth 2.0 client ID" link, which will take you to the Credentials page
On the Credentials page:
Click the "Add credentials" link and choose the "OAuth 2.0 Client ID" option
Click the "Configure Consent Screen" button
Fill out the required information and click "Save".
Under "Create client ID", do the following (per these instructions):
Choose Application type = Web application
Enter the name of your app
Enter your website root in "Authorized JavaScript origins"
Leave "Authorized redirect URIs" blank
Click "Create" and you should see a dialog displaying your client ID and client secret. Record these in a safe place for later use.
Go back to the API Manager Overview for this project by clicking "Overview" on the left.
Select the "Google Apps Marketplace SDK" under "Google Apps APIs"
On the "Google Apps Marketplace SDK" page:
Click the "Configuration" tab
Enter configuration info as follows:
Add a description
Add 4 icons of various sizes
Add a URL for the Terms of Service. I used: http://sbrudz.github.io/gadget-hello-world/tos.html
In the extensions section, check the "Universal navigation extension" and enter a URL. I used: https://github.com/sbrudz/gadget-hello-world
Then check the "Gmail contextual gadget extension" with:
Extractor URL: google.com:HelloWorld
Gadget URL: http://sbrudz.github.io/gadget-hello-world/hello_world_gadget.xml
Extractor param name:
Extractor param value:
Scopes: "Mail - Subject Line" and "Mail - Message Body"
Click the "Save changes" button
Click the "Test installation flow" button
Click the "Accept" button
The gadget should now be installed to your Gmail account
Log into gmail with the clear gadget cache option set: https://mail.google.com/mail/u/0/?nogadgetcache=1
Check that the gadget has been installed by clicking the "Google Apps" button in the upper right corner of Gmail and scrolling down in the resulting popup menu.
