sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";
        var lastId;
        var imputProd;
        var globalID;

        return Controller.extend("app.controller.View4", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("View4").attachMatched(this._onRouteMatched, this);

                var oModel = this.getOwnerComponent().getModel();
                var that = this;
                oModel.read("/Products", {
                    success: function (odata) {
                        console.log(odata);
                        var lastItem = odata.results[odata.results.length - 1];
                        console.log(lastItem);
                        that.lastId = lastItem.ID + 1; 
                        var oModel = new sap.ui.model.json.JSONModel({
                            "Products": odata.results
                            });
                           that.getView().setModel(oModel, "generalDataModel");
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });
            },

            _onRouteMatched: function (oEvent) {
                var that = this;
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                console.log("ID parameter:", oArgs.ID); // Check if ID parameter is correct
                oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                this.globalID = oArgs.ID;
                // Step 1: Retrieve the Category
                oModel.read("/Categories(" + oArgs.ID + ")/Products", {
                    success: function (odata) {
                        console.log(odata);
                        // var jModel = new sap.ui.model.json.JSONModel(odata); 
                        // that.getView().byId("idProducts").setModel(jModel);
                        var oModel = new sap.ui.model.json.JSONModel({
                            "Products": odata.results
                            });
                           that.getView().setModel(oModel, "generalDataModel");
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },

            onInsert: function () {
                if (!this._pDialog) {
                    this._pDialog = sap.ui.xmlfragment("app.view.fragments.InsertDialog", this);
                    this.getView().addDependent(this._pDialog);
                }
                this._pDialog.open();
            },

            onSubmitInsert: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oTable = this.getView().byId("idProducts");

                var sName = sap.ui.getCore().byId("inputName").getValue();
                var sPrice = sap.ui.getCore().byId("inputPrice").getValue();
                var sRating = sap.ui.getCore().byId("inputRaiting").getValue();

                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                console.log("ID parameter:", this.globalID); // Check if ID parameter is correct
                oView = this.getView();

                oModel.read("/Products", {
                    success: function (odata) {
                        console.log(odata);
                        var lastItem = odata.results[odata.results.length - 1];
                        console.log(lastItem);
                        that.lastId = lastItem.ID + 1; 
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });

                console.log(that.lastId);

                var imputProd = {
                    ID: that.lastId,
                    Name: sName,
                    Price: sPrice,
                    Rating: sRating
                }

                console.log(imputProd);

                oModel.setUseBatch(false);

                oModel.create("/Categories(" + this.globalID + ")/Products", imputProd, {
                    success: function (odata) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("messageForInsertSucces");
                        sap.m.MessageToast.show(msg);
                        oTable.getBinding().refresh();
                        that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function (oError) {
                        var msg = "Nu se poate insera fraiere"
                        sap.m.MessageToast.show(msg);
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

            onCloseDialogInsert: function () {
                this._pDialog.close();
            },

            onSubmitDelete: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                var oId = this.byId("idProducts").getSelectedItem().getBindingContext().getProperty("ID");
                oModel.remove("/Categories(" + this.globalID + ")/Products(" + oId + ")", {
                    success: function (odata) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("deleteSuccessMessage");
                        sap.m.MessageToast.show(msg);
                        that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })

                this._dpDialog.close();
            },

            onDelete: function (oEvent) {
                if (!this._dpDialog) {
                    this._dpDialog = sap.ui.xmlfragment("app.view.fragments.DeleteDialog", this);
                    this.getView().addDependent(this._dpDialog);
                }
                this._dpDialog.open();
            },

            onCloseDialogDelete: function () {
                this._dpDialog.close();
            },

            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View3");
            }
        });
    });
