(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "CustomerName",
            alias: "CustomerID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "DocumentNumber",
            alias: "tranID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "TransactionDate",
            alias: "tranDate",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "CustomerPO",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Item Code",
            alias: "ItemID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Quantity",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "QuantityFulfilled",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "QuantityBilled",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "EffectiveRate",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "status",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "LSGBackOrders",
            alias: "LSG Back Orders",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        $.ajax({
            type: "GET",
            url: "https://EvolutionHealth280892.jitterbit.eu/Sandbox/0.2-2/CopyofnsExfactoryV2?object=open1",
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
                  "CustomerName": feat[i].CustomerName,
                  "DocumentNumber": feat[i].DocumentNumber,
                  "TransactionDate": feat[i].TransactionDate,
                  "Quantity": feat[i].Quantity,
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
            tableau.connectionName = "LSG Back Orders";
            tableau.submit();
        });
    });
})();