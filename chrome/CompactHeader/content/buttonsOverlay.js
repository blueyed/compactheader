/*# -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is Mozilla Communicator client code, released
# March 31, 1998.
#
# The Initial Developer of the Original Code is
# Netscape Communications Corporation.
# Portions created by the Initial Developer are Copyright (C) 1998-1999
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#   Joachim Herb <joachim.herb@gmx.de>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****
*/

if (typeof org_mozdev_compactHeader == "undefined") {
  var org_mozdev_compactHeader = {};
};


org_mozdev_compactHeader.buttons = function() {
  var pub = {};
  const MSG_FLAG_FLAGGED = 0x4;

  pub.init = function () {
    var mailSession = Components.classes["@mozilla.org/messenger/services/session;1"]
                                .getService(Components.interfaces.nsIMsgMailSession);
    var nsIFolderListener = Components.interfaces.nsIFolderListener;
    mailSession.AddFolderListener(folderListener, nsIFolderListener.propertyFlagChanged);
    window.addEventListener("load", function loadEventListener(e)
    {
      window.removeEventListener("load", loadEventListener, false);
      pub.singlemessage_controller.onLoad(e);
    },
    false);
  }

  pub.coheToggleStar = function () {
    var starButton = document.getElementById("header-view-toolbox").
                              getElementsByAttribute("id", "CompactHeader_button-starMessages")[0];

    if (starButton) {
      //alert("test2");
      var firstSelectedMessage = gFolderDisplay.selectedMessage;
      if (firstSelectedMessage && firstSelectedMessage.isFlagged) {
        starButton.setAttribute("flagged", "true");
      }
      else {
        starButton.removeAttribute("flagged");
      }
    }
  }

  var folderListener = {
    OnItemPropertyFlagChanged: function(item, property, oldFlag, newFlag) {
      var changedFlag = oldFlag ^ newFlag;

      if (changedFlag & MSG_FLAG_FLAGGED) {
        pub.coheToggleStar();
      }
    },
  }

  pub.singlemessage_controller = {
    onLoad:function(e) {
      top.controllers.appendController(this);
    },

    supportsCommand: function(command) {
      switch(command) {
      case "CompactHeader_button_singlemessage":
          return true;
      }
      return false;
    },

    isCommandEnabled: function(command) {
      switch (command) {
      case "CompactHeader_button_singlemessage":
          var tabmail = document.getElementById("tabmail");
          return (tabmail == null) ||
                 ((tabmail.selectedTab.mode.name == "folder") &&
                  (gFolderDisplay.selectedCount == 1)
                  ) || (tabmail.selectedTab.mode.name == "message");
      }
      return false;
    },

    doCommand: function(command) { },

    onEvent: function(event) { }
  };

  return pub;
}();

org_mozdev_compactHeader.buttons.init();
