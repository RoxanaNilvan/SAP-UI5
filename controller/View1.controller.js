sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("app.controller.View1", {
            onInit: function () {

            },
            
            onTilePress: function(){
                var msg = 'We are taking you to the crud operations';
                sap.m.MessageToast.show(msg);
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View2");
            },

            onTilePress2: function(){
                var msg = 'We are taking you to the categories';
                sap.m.MessageToast.show(msg);
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View3");
            }
        });
    });
