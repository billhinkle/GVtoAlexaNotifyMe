# GVtoAlexaNotifyMe
Google script to forward Google Voice messages to Alexa via Notify Me skill

* Google Voice to Alexa Notify Me
* inspired by and loosely based on 'Gmail to Twitter' @labnol / Amit Agarwal
* by Bill Hinkle github: @billhinkle
* ver 2018-10-22 added command verbs ON, OFF, KEYWORD, HELP

* About: This script works with the Amazon Alexa Notify Me skill to send your Google Voice texts and voice mails (all or some)
* to your Echo to be read by Alexa as notification.  She will announce the sender and (approximate) time of receipt.  Messages
* may take up to a few minutes to appear at your Echo.  Google Voice text yourself #GVALEXA HELP to get help when the script is
* up and running.  This script uses the Notify Me Alexa skill by Thomptronics http://www.thomptronics.com/notify-me
*
* First: you must have a Google Voice number associated with your GMail account.
* To get this script running: find and install the Notify Me skill in the Alexa Skills store.  Once that's done, tell Alexa to 
* 'open Notify Me'; she will acknowledge that and you will then receive an access code in your email associated with your Echo.
* Meanwhile, in Google Sheets sheets.google.com, Start a new spreadsheet, +Blank (or Google Drive, New, Google Sheets)...
* Title the new sheet: Google Voice to Alexa Notify Me
* From the menu: Tools, Script Editor
* In the script editor: erase the sample code, and paste this ENTIRE script into the code window
* In the left column, under the little down-arrow next to the script name, click Rename and rename the script GVtoAlexaNotifyMe
* From the menu: File, Save
* Close the code editor window, and then close the sheet window also
* Re-open the sheet (now named 'Google Voice to Alexa Notify Me') and a new menu item should appear: 'Google Voice to Alexa Notify Me'
* Click that new menu item and then click 'Enter Notify Me access code'
* In the popup window, paste the (very long!) access code sent in the skill's email mentioned above.  Be careful when copying it, from
* the email message to your clipboard, to include JUST the access code, without any extra spaces or characters.
*     Something like:       amzn1.ask.account.AWHOLELOTOFGOBBLETYGOOK
* After pasting in the code, press Enter and you should get a message that 'Google Voice to Alexa Notify Me can now be started.'
* Again click the 'Google Voice to Alexa Notify Me' menu item, then 'Start'. You should see an acknowledgment message and a short HELP message.
* The script should now be up and running, redirecting your Google Voice messages and voicemails to your Echo as notifications.
*
* Most script activity is logged directly to the sheet; you can delete any or all of those rows anytime.
* To entirely stop the script, open the sheet, click the 'Google Voice to Alexa Notify Me' menu item, then 'Stop'.
* You can suspend (OFF), resume (ON), and filter messages to those with a specific word (KEYWORD).  See the HELP message.