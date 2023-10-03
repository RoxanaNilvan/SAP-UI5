sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("app.controller.View3", {
            onInit: function () {

            },

            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");
            },

            onItemPress: function (oEvent) {
                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();

                // Assuming your "ID" property is available in the binding context
                var categoryId = oCtx.getProperty("ID");

                // Access the router via the component and navigate to the "View4" route
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View4", {
                    ID: categoryId
                });
            },

            onInsert: function () {
                if (!this._cDialog) {
                    this._cDialog = sap.ui.xmlfragment("idInsertCat","app.view.fragments.InsertCategory", this);
                    this.getView().addDependent(this._cDialog);
                }
                this._cDialog.open();
            },

            onCloseDialogInsert: function () {
                this._cDialog.close();
            },

            onSubmitInsert: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var sName = oEvent.getSource().getParent().getContent()[1].getValue();
                // var names =Fragment.byId("idInsertCat","i")
                var oTable = this.getView().byId("idCategories");
                var oBinding = oTable.getBinding("items");
                var oLastItem = oBinding.getContexts()[oBinding.getLength() - 1].getObject();

                var lastId = oLastItem.ID + 1;

                var imputCat = {
                    ID: lastId,
                    Name: sName,
                }

                oModel.setUseBatch(false);

                oModel.create("/Categories", imputCat, {
                    success: function (odata) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("messageForInsertSucces");
                        sap.m.MessageToast.show(msg);
                        oTable.getBinding().refresh();
                        that.getView().byId("idCategories").getModel().refresh();
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
                // Persist the changes locally
                oModel.updateBindings();

                // Refresh the table to reflect the changes
                oTable.removeSelections();

                // Refresh the model to update the data from the server
                oModel.refresh();

                this.onCloseDialogInsert();
            },

            onDuplicate: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                var oDuplicateData = oEvent.getSource().getBindingContext().getObject();
                oDuplicateData.ID = 100 + oDuplicateData.ID;
                oModel.create("/Categori", oDuplicateData, {
                    success: function (odata) {
                        that.getView().byId("idProducts").getModel().refresh();
                        //that.onReadAll();
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },

        });
    });
