sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/export/library", // Import the export library
     "sap/ui/export/Spreadsheet" // Import the Spreadsheet control
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, History, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("app.controller.View2", {
            onInit: function () {

            },

            onSubmitDelete: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                var oId = this.byId("idProducts").getSelectedItem().getBindingContext().getProperty("ID");
                oModel.remove("/Products(" + oId + ")", {
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

                this._dDialog.close();
            },

            onDelete: function (oEvent) {
                if (!this._dDialog) {
                    this._dDialog = sap.ui.xmlfragment("app.view.fragments.DeleteDialog", this);
                    this.getView().addDependent(this._dDialog);
                }
                this._dDialog.open();
            },

            onCloseDialogDelete: function () {
                this._dDialog.close();
            },

            onInsert: function () {
                if (!this._iDialog) {
                    this._iDialog = sap.ui.xmlfragment("app.view.fragments.InsertDialog", this);
                    this.getView().addDependent(this._iDialog);
                }
                this._iDialog.open();
            },

            onEdit: function (oEvent) {
                var that = this;
                var oId = this.byId("idProducts").getSelectedItem();

                if (!oId) {
                    var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                    var msg = oResourceBundle.getText("messageForSelectItem");
                    sap.m.MessageToast.show(msg);
                    return;
                }

                var oSelectedItem = this.getView().byId("idProducts").getSelectedItem().getBindingContext().getObject();

                if (!this._eDialog) {
                    this._eDialog = sap.ui.xmlfragment("app.view.fragments.EditDialog", this);
                    this.getView().addDependent(this._eDialog);
                }

                sap.ui.getCore().byId("editId").setValue(oSelectedItem.ID);
                sap.ui.getCore().byId("editName").setValue(oSelectedItem.Name);
                sap.ui.getCore().byId("editPrice").setValue(oSelectedItem.Price);
                sap.ui.getCore().byId("editRating").setValue(oSelectedItem.Rating);

                this._eDialog.open();
            },

            onSubmitInsert: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                var sName = sap.ui.getCore().byId("inputName").getValue();
                var sPrice = sap.ui.getCore().byId("inputPrice").getValue();
                var sRating = sap.ui.getCore().byId("inputRaiting").getValue();

                var oTable = this.getView().byId("idProducts");
                var oBinding = oTable.getBinding("items");
                var oLastItem = oBinding.getContexts()[oBinding.getLength() - 1].getObject();

                var lastId = oLastItem.ID + 1;

                var imputProd = {
                    ID: lastId,
                    Name: sName,
                    Price: sPrice,
                    Rating: sRating
                }

                oModel.setUseBatch(false);

                oModel.create("/Products", imputProd, {
                    success: function (odata) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("messageForInsertSucces");
                        sap.m.MessageToast.show(msg);
                        oTable.getBinding().refresh();
                        that.getView().byId("idProducts").getModel().refresh();
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

            onSubmitEdit: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oTable = this.getView().byId("idProducts");

                var sId = oEvent.getSource().getParent().getContent()[1].getValue();
                var sName = oEvent.getSource().getParent().getContent()[3].getValue();
                var sPrice = oEvent.getSource().getParent().getContent()[5].getValue();
                var sRating = oEvent.getSource().getParent().getContent()[7].getValue();

                oModel.setUseBatch(false);

                var sProd = this.byId("idProducts").getSelectedItem().getBindingContext().getObject();
                var oId = sProd.ID;

                oModel.update("/Products(" + oId + ")", {
                    Name: sName,
                    Price: sPrice,
                    Rating: sRating
                }, {
                    success: function (odata) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("messageForUpdateSuccess");
                        sap.m.MessageToast.show(msg);
                        oTable.getBinding().refresh();
                        that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function (oError) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        var msg = oResourceBundle.getText("messageForUpdateError");
                        sap.m.MessageToast.show(msg);
                        console.log(oError);
                    }
                })

                this._eDialog.close();
                // Persist the changes locally
                oModel.updateBindings();

                // Refresh the table to reflect the changes
                oTable.removeSelections();

                // Refresh the model to update the data from the server
                oModel.refresh();
            },

            onCloseDialogInsert: function () {
                this._iDialog.close();
            },

            onCloseDialogEdit: function () {
                this._eDialog.close();
            },


            onDuplicate: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                var oDuplicateData = oEvent.getSource().getBindingContext().getObject();
                oDuplicateData.ID = 100 + oDuplicateData.ID;
                oModel.create("/Products", oDuplicateData, {
                    success: function (odata) {
                        that.getView().byId("idProducts").getModel().refresh();
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },

            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView1");

            },

            onExportToExcel: function () {
                var oTable = this.getView().byId("idProducts");
                var oBinding = oTable.getBinding("items");
                var aContexts = oBinding.getContexts();
            
                if (aContexts.length === 0) {
                    sap.m.MessageToast.show("No data available for export.");
                    return;
                }
            
                var aFormattedData = [];
            
                for (var i = 0; i < aContexts.length; i++) {
                    var oProduct = aContexts[i].getObject();
                    aFormattedData.push({
                        ID: oProduct.ID,
                        Name: oProduct.Name,
                        Price: oProduct.Price,
                        Rating: oProduct.Rating
                    });
                }
            
                // Create and trigger the Excel download
                this.exportDataToExcel(aFormattedData);
            },
            
            
            
            exportDataToExcel: function (aFormattedData) {
                var oSettings = {
                    workbook: {
                        columns: this.createColumnConfig(),
                        hierarchyLevel: 'Level'
                    },
                    dataSource: aFormattedData,
                    fileName: 'Products.xlsx',
                    worker: false
                };
            
                var oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        sap.m.MessageToast.show('Spreadsheet export has finished');
                    })
                    .finally(oSheet.destroy);
            },
            
            createColumnConfig: function () {
                // Define your column configuration for Excel export
                return [
                    {
                        label: 'ID',
                        property: 'ID',
                        type: Number,
                        scale: 0
                    },
                    {
                        label: 'Name',
                        property: 'Name',
                        width: '25'
                    },
                    {
                        label: 'Price',
                        property: 'Price',
                        width: '25'
                    },
                    {
                        label: 'Rating',
                        property: 'Rating',
                        width: '18'
                    }
                ];
            },

            onLiveSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("newValue");
                var oTable = this.getView().byId("idProducts");

                var oBinding = oTable.getBinding("items");

                if (sQuery) {
                    var nFilter = new sap.ui.model.Filter({
                        path: "Name",
                        operator: sap.ui.model.FilterOperator.Contains,
                        caseSensitive: false,
                        value1: sQuery
                    });

                    oBinding.filter([nFilter]);
                } else {
                    oBinding.filter([]);
                }
                oTable.getModel().refresh();
            },
        });
    });
