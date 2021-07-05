(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "SalesOrderDocumentNo",
            alias: "tranID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "SalesOrderID",
            alias: "InternalID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "SalesOrderCratedDate",
            alias: "tranDate",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "LSGSalesOrderMapping",
            alias: "SalesOrderMapping",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        $.ajax({
            type: "GET",
            url: "https://EvolutionHealth280892.jitterbit.eu/Sandbox/0.2-2/CopyofnsExfactoryV2?object=salesorderid",
            dataType: "json",
            headers: {
              "Authorization": "Basic " + btoa(tableau.username + ":" + tableau.password)
            },
            success: function (resp) {
              var feat = resp.searchedResult.SearchRowList.SearchRow,
                tableData = [];
     
              // Iterate over the JSON object
              for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                  "SalesOrderDocumentNo": feat[i].SalesOrder_Document_No,
                  "SalesOrderID": feat[i].SalesOrder_ID,
                  "SalesOrderCratedDate": feat[i].SalesOrder_Created_Date
                });
              }
     
              table.appendRows(tableData);
              doneCallback();
            }
          });
      };
    myConnector.init = function(initCallback) {
        tableau.username = "lsgbiauthuser"
        tableau.password = "Evolution@1";
        tableau.authType = tableau.authTypeEnum.basic;
        initCallback();
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "LSG SalesOrder Mapping";
            tableau.submit();
        });
    });
})();