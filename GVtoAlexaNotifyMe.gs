/*
* Google Voice to Alexa Notify Me
* inspired by and loosely based on 'Gmail to Twitter' @labnol / Amit Agarwal
* by Bill Hinkle github: @billhinkle
* ver 2018-10-22 added command verbs ON, OFF, KEYWORD, HELP
*
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
*/

function onOpen(e) {
  
  var menu = SpreadsheetApp.getUi().createMenu("Google Voice to Alexa Notify Me");
  
  menu.addItem((hasAccessCode_()?"Re-enter":"Enter")+" Notify Me access code", "showAccessCodeEntryWindow_");
  menu.addSeparator().addItem("Start", "setGVtoNotifyMe_");    
  menu.addSeparator().addItem("Stop", "resetGVtoNotifyMe_");    

  menu.addToUi();  
}

var propertyACodeNotifyMe = "ACODENotifyMe";
var propertyGVAlexaSuspend = "GVAlexaSuspend";
var propertyGVAlexaKeyword = "GVAlexaKeyword";

function hasAccessCode_() {
  var props = getProps_();
  return !!props.getProperty(propertyACodeNotifyMe);
}

function showAccessCodeEntryWindow_() {
  var input = Browser.inputBox("Enter/paste your Alexa Notify Me skill access code", Browser.Buttons.OK_CANCEL).trim();
  if (input !== "cancel" && input !== "") {
    var props = getProps_();
    props.setProperty(propertyACodeNotifyMe, input);

    SpreadsheetApp.getActive().toast("Google Voice to Alexa Notify Me can now be started.");
  }
}

// var gvTxtMailFilterText = "newer_than:1h from:(*@txt.voice.google.com) subject:(New Text Message From)";
// var gvVMMailFilterText = "newer_than:1h from:(voice-noreply@google.com) subject:(New voicemail from)";
var gvMailFilterText = "newer_than:1h {from:(*@txt.voice.google.com) from:(voice-noreply@google.com)} {subject:(New Text Message From) subject:(New voicemail from)}"

function setGVtoNotifyMe_() {
  
  if (!hasAccessCode_()) {
    showAccessCodeEntryWindow_();
    return;
  }
  
  try {
    
    toggleTrigger_(true);
    Browser.msgBox("Started. The script will pass all Google Voice emails to Alexa Notify Me.\\nHELP: text yourself '#GVALEXA ON' to enable, '#GVALEXA OFF' to suspend,\\n'#GVALEXA KEYWORD word' to notify only messages with that 'word' ('word'=blank to disable),\\n'#GVALEXA HELP for this help info.\\nYou can now close this sheet.");
      
  } catch (f) {
    SpreadsheetApp.getActive().toast("Sorry, there was a problem - " + f.toString());
  }
}

function getProps_() {
  return PropertiesService.getUserProperties();
}

function resetGVtoNotifyMe_() {
  toggleTrigger_(false);
  SpreadsheetApp.getActive().toast("Google Voice to Alexa Notify Me has stopped.");
  onOpen();
}

function commandGVtoNotifyMe_(props, msg, aCommand, aCmdTail) {
  if (typeof aCmdTail === 'undefined')
     aCmdTail = null;
  var replyTxt = null;

  switch (aCommand.toUpperCase()) {
    case "REPLY":
      // this would be a reply from this very script, don't reply again to avoid looping
      break;
      
    case "ON":
      props.deleteProperty(propertyGVAlexaSuspend);
      props = getProps_();
      replyTxt = "#GVALEXA REPLY Service is now ON";
      break;
      
    case "OFF":
      props.setProperty(propertyGVAlexaSuspend, true);
      props = getProps_();
      replyTxt = "#GVALEXA REPLY Service is now OFF";
      break;

    case "KEYWORD":
      var keyword = '';
      if (aCmdTail) {
        keyword = aCmdTail.split(" ")[0].toUpperCase();
        props.setProperty(propertyGVAlexaKeyword, keyword);
      }
      else
        props.deleteProperty(propertyGVAlexaKeyword);
      props = getProps_();
      replyTxt = "#GVALEXA REPLY Keyword is now " + (keyword ? keyword : "disabled");
      break;

    case "HELP":
      replyTxt = "#GVALEXA REPLY HELP: text yourself '#GVALEXA ON' to enable, '#GVALEXA OFF' to suspend, '#GVALEXA KEYWORD word' to notify only messages with that word (word=blank to disable)";
      var keyword = props.getProperty(propertyGVAlexaKeyword);
      replyTxt += " - keyword is " + (keyword ? keyword : "disabled");
      break;
  }
  if (msg && replyTxt)
    msg.reply(replyTxt);
  return props;
}

function sendGVtoNotifyMe_(props, notificationTxt) {
  var jsonData =  {
    "notification" : notificationTxt,
    "accessCode" : props.getProperty(propertyACodeNotifyMe)
  };
  var options = {
        "method" : "POST",
        "contentType" : "application/json",
        "payload" : JSON.stringify(jsonData)
  };
  var nmResponse = UrlFetchApp.fetch("https://api.notifymyecho.com/v1/NotifyMe", options);
  return nmResponse;
}

var gvAlexaNotifyMeTriggerName = "gvAlexaNotifyMe";
var gvAlexaNotifyMeTriggerMinutes = 5;

function toggleTrigger_(enableTrigger) {
  
  try {
    
    var triggers = ScriptApp.getUserTriggers(SpreadsheetApp.getActive());
    var found = false;
    
    for (var t = 0; t < triggers.length; t++) {
      if (triggers[t].getHandlerFunction() === gvAlexaNotifyMeTriggerName) {
        if (!enableTrigger) {
          ScriptApp.deleteTrigger(triggers[t]);
        }
        found = true;
        break;
      }
    }
    
    if (enableTrigger) {
      if (!found)
        ScriptApp.newTrigger(gvAlexaNotifyMeTriggerName).timeBased().everyMinutes(gvAlexaNotifyMeTriggerMinutes).create();
      commandGVtoNotifyMe_(getProps_(), null, "ON")
    }
    
    onOpen();
    
  } catch (f) {}
}

function gvAlexaNotifyMe() {
  var now = new Date();
  var nowMS = now.getTime();

  var ss = SpreadsheetApp.getActive(),
      props = getProps_(),
      gmail = GmailApp.search(gvMailFilterText, 0, 20);

  // Logger.log("Threads: " + gmail.length);
  for (var g = 0; g < gmail.length; g++) {
      
    try {
      
      if ((nowMS - gmail[g].getLastMessageDate().getTime()) < (gvAlexaNotifyMeTriggerMinutes * 60000)) {
        for (var m = 0; m < gmail[g].getMessageCount(); m++) {
          var msg = gmail[g].getMessages()[m];

          if ((nowMS - msg.getDate().getTime()) < (gvAlexaNotifyMeTriggerMinutes * 60000)) {
        
            var from = msg.getFrom();
            var rawText = msg.getPlainBody();

            // Logger.log("Thread " + g + " message " + m + " from " + from +  " is " + rawText);

            // keep only text between the google voice link and "YOUR ACCOUNT"
            if (rawText) {
              var tmp;
              var isVoiceMail = false,
                  isMMS = false;
              var aCommand = null,  // self-sent command verbs
                  aCmdTail = null;

              tmp = rawText.match(/<https:\/\/voice\.google\.com>\s*([\s|\S]*)[\s|\S]*?\bYOUR ACCOUNT\b/);
              if (tmp && tmp[1]) {
                isVoiceMail = !!from.match(/voice\-noreply\@google\.com/); 
                if (isVoiceMail) {
                  from = msg.getSubject();  // expected form is 'New voicemail from *name* at *time*'
                  rawText = tmp[1].replace(/\r?\n\s*play message\s*\r?\n<?(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/\S*)?>?\r?\n?/i,'')
                                  .replace(/\r?\n/g,' ');
                } else {  // must be a text message instead
                  // remove reply-help, newlines, and weblinks
                  rawText = tmp[1].replace(/To respond to this text message, reply to this email or visit Google Voice.\r?\n/,'')
                                  .replace(/\r?\n/g,' ')
                                  .replace(/<?(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/\S*)?>?/ig,'[WEB LINK]');

                  isMMS = !!rawText.match(/^MMS Received\s*$/);             

                  // parse out the sender name and numbers
                  tmp = from.match(/^"?(.*?)(?: \(SMS\))?"?\s*<(\d+)\.(\d+)\..*>/);
                  from = (tmp && tmp[1])? tmp[1] : "an Unknown Sender";
                  
                  if (tmp && (tmp[2] == tmp[3])) {  // if receiver == sender, this may be a command to this script
                    var cmdText = rawText.match(/(?:#GVALEXA\b)\s+(\b\S+\b)\s+(.*)/i);  // look for trigger word #GVALEXA and a non-falsey verb word
                    if (cmdText && cmdText[1]) {
                      aCommand = cmdText[1];
                      if (cmdText[2])
                        aCmdTail = cmdText[2];
                    }
                  }
                }
                // log the incoming message in the parent sheet
                ss.getSheets()[0].appendRow([msg.getDate(), aCommand? "COMMAND=" + aCommand : from, rawText]); 

                if (aCommand) {  // this was a command from ourself (i.e. from the same GV address/phone)
                  props = commandGVtoNotifyMe_(props, msg, aCommand, aCmdTail);
                } else if (rawText &&                                       // else handle as a notification...
                           !props.getProperty(propertyGVAlexaSuspend)) {    //  if not currently suspended ...
                  var keyword = props.getProperty(propertyGVAlexaKeyword);
                  if (keyword)
                    keyword = !(new RegExp('\\b' + keyword + '\\b', "i")).test(rawText);
                    
                  if (!keyword) try { //  if keyword filtering enabled and keyword is present

                    var notificationTxt =  isVoiceMail ? ("A " + from + " says: " + rawText) :
                                                         (isMMS ? (from + " sent you a picture; check your mail!") :
                                                                  ("A new text message from " + from + " says: " + rawText) );
                    var nmResponse = sendGVtoNotifyMe_(props, notificationTxt);
                    if (nmResponse)
                      ss.getSheets()[0].appendRow([new Date(), nmResponse.getResponseCode(), nmResponse.getContentText()]);
                  } catch (f) {
                    Logger.log("Error on notify: " + f.toString());
                  }
                }
              }
            }
          }
        }
        Utilities.sleep(500);      // snooze a bit between threads
      }
      
    } catch (f) {
      Logger.log("Error on message parse: " + f.toString());
    }
  }
}
