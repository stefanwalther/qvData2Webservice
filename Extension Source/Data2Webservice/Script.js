


// Global Default Settings
var _MaxRecords_Default = 250;
var _Label_Submit = 'Submit';

function Data2Webservice_Init() {
    Qv.AddExtension("Data2Webservice",
        function () {

            var _this = this;
            if (!_this.ExtensionLoaded) {
                this.ExtensionLoaded = true;
            }
            else {
                //alert('Extension loaded for ' + _this.Layout.ObjectId);
            }

            // Add CSS
            Qva.LoadCSS(Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + "Extensions/Data2Webservice/Data2Webservice.css");

            // Retrieve extension properties
            setProps();

            $(_this.Element).empty();
            initLoadingPane("Loading data ...");
            showLoadingPanel("loading data ...");
            initGrid();
            initFooter();
            loadData(data_loaded);


            // ------------------------------------------------------
            // Set Properties
            // ------------------------------------------------------
            function setProps() {

                // Max records
                _this.MaxRecords = $.isNumeric(_this.Layout.Text2.text) ? parseInt(_this.Layout.Text2.text) : _MaxRecords_Default;
                _this.Data.SetPagesizeY(_this.MaxRecords);

                // Submit button label
                _this.Label_Submit = "Submit";
                if (_this.Layout.Text1 && _this.Layout.Text1.text != 'undefined') {
                    _this.Label_Submit = _this.Layout.Text1.text;
                }

                // Retrieve Props
                _this.WebserviceUrl = _this.Layout.Text0.text;

                // Selection Enabled
                _this.Selection_Enabled = (_this.Layout.Text3.text === 1);

            }

            // ------------------------------------------------------------------
            // Html structure
            // ------------------------------------------------------------------
            function initGrid() {

                var tableDiv = document.createElement("div");
                // see http://stackoverflow.com/questions/139000/div-with-overflowauto-and-a-100-wide-table-problem
                // for browsers < IE7
                tableDiv.style.overflow = "auto";
                //tableDiv.style.width = _this.GetWidth() + "px";
                tableDiv.style.height = _this.GetHeight() - 35 + "px";
                tableDiv.className = "divTable";

                var myTable = document.createElement("table");
                myTable.className = "tblDataSelection";
                myTable.id = "tblDataSelection_" + safeId(_this.Layout.ObjectId);

                tableDiv.appendChild(myTable);
                _this.Element.appendChild(tableDiv);
            }

            function initFooter() {
                var divStatusBar = document.createElement("div");
                divStatusBar.className = "statusBar";
                divStatusBar.id = "statusBar_" + safeId(_this.Layout.ObjectId);

                // Statusbar-Content
                var divStatusContent = document.createElement("div");
                divStatusContent.className = "statusContent";
                divStatusContent.id = "statusContent_" + safeId(_this.Layout.ObjectId);
                divStatusBar.appendChild(divStatusContent);

                // Submit-Button
                var divSubmit = document.createElement("div");
                divSubmit.className = "divSubmit";
                var submitButton = document.createElement("input");
                submitButton.type = "button";
                submitButton.value = _this.Label_Submit;
                submitButton.addEventListener("click", submitButton_Click, false);
                divSubmit.appendChild(submitButton);
                divStatusBar.appendChild(divSubmit);

                _this.Element.appendChild(divStatusBar);

            }

            // ------------------------------------------------------------------
            // Status Bar
            // ------------------------------------------------------------------
            function hideStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).hide();
            }
            function showStatusBar() {
                $('#statusBar_' + safeId(_this.Layout.ObjectId)).show();
            }
            function updateStatusContent() {

                var all = 0;
                if (_this.Selection_Enabled) {
                    all = $("input[name='SelectionCheckbox_" + safeId(_this.Layout.ObjectId) + "']").length;
                    var selected = $("input[name='SelectionCheckbox_" + safeId(_this.Layout.ObjectId) + "']:checked").length;
                    $('#statusContent_' + safeId(_this.Layout.ObjectId)).text(selected + '/' + all + ' records selected');
                }
                else {
                    all = _this.Data.Rows.length;
                    $('#statusContent_' + safeId(_this.Layout.ObjectId)).text(all + ' records');
                }

                showStatusBar();

            }

            // ------------------------------------------------------------------
            // Data related
            // ------------------------------------------------------------------
            function loadData(callback) {
                if (_this.Data.HeaderRows[0] == null) {

                    // Message here ...
                    hideLoadingPanel();
                    hideStatusBar();

                    // if there are no dimensions/expressions defined, just return
                    return;
                }

                var $myTable = $('#tblDataSelection_' + GetSafeId());

                var noCols = _this.Data.HeaderRows[0].length;
                var tableBody = document.createElement("tbody");
                tableBody.style.width = "100%";

                // Data Header
                for (var r = 0; r < _this.Data.HeaderRows.length; r++) {
                    var dataHeader = document.createElement("thead");
                    var dataHeaderRow = document.createElement("tr");

                    // Add the col for the selection
                    var selColHeader = document.createElement("th");
                    selColHeader.className = "selectionColHeader";
                    selColHeader.style.width = '60px';
                    selColHeader.style.display = (_this.Selection_Enabled ? 'block' : 'none');

                    var aAll = document.createElement("a");
                    aAll.innerText = "All";
                    aAll.className = "AllNone";
                    aAll.href = "javascript:void(0);";
                    aAll.style.marginRight = '10px';
                    aAll.addEventListener("click", dataRowsAll_Click, false);

                    var aNone = document.createElement("a");
                    aNone.innerText = "None";
                    aNone.className = "AllNone";
                    aNone.href = "javascript:void(0);";
                    aNone.addEventListener("click", dataRowsNone_Click, false);

                    selColHeader.appendChild(aAll);
                    selColHeader.appendChild(aNone);
                    dataHeaderRow.appendChild(selColHeader);


                    var maxLength = 12; // Max string length for header
                    for (var c = 0; c < noCols; c++) {
                        var cell = document.createElement("th");
                        cell.style.textAlign = "left";
                        var strHeader = _this.Data.HeaderRows[r][c].text;
                        var strHeaderFull = strHeader;
                        if (strHeader.length > maxLength) { strHeader = strHeader.substring(0, maxLength - 1) + " ..." };
                        cell.innerHTML = strHeader;
                        cell.title = strHeaderFull;
                        dataHeaderRow.appendChild(cell);
                    }
                }
                dataHeader.appendChild(dataHeaderRow);
                $myTable.append(dataHeader);

                // Content - Rows
                for (var r = 0; r < _this.Data.Rows.length; r++) {
                    var dataRow = document.createElement("tr");
                    dataRow.id = "dr_" + r;
                    dataRow.dataIndex = r;
                    dataRow.addEventListener("click", dataRow_Click, false);

                    // Column for the selection
                    var selCol = document.createElement("td");
                    selCol.className = "selectionCol";
                    selCol.style.display = (_this.Selection_Enabled ? 'block' : 'none');

                    var chk = document.createElement("input");
                    chk.type = "checkbox";
                    chk.dataIndex = r;
                    chk.name = "SelectionCheckbox_" + GetSafeId();
                    chk.id = "chk_" + r;
                    // default value: checked
                    chk.checked = "checked";
                    chk.addEventListener("click", dataRow_Click, false);
                    chk.addEventListener("change", selectionChange_Click, false);

                    selCol.appendChild(chk);
                    dataRow.appendChild(selCol);


                    for (var c = 0; c < noCols; c++) {
                        var cell = document.createElement("td");
                        cell.innerHTML = _this.Data.Rows[r][c].text;
                        //cell.innerHTML = _this.Data.Rows[r][c].data;
                        //alertProps(_this.Data.Rows[r][c]);
                        dataRow.appendChild(cell);
                    }
                    tableBody.appendChild(dataRow);
                }
                $myTable.append(tableBody);

                callback.call(null);


            }

            function data_loaded() {

                updateStatusContent();
                hideLoadingPanel();
            }

            function getResults() {

                var QVDataTable = {};
                QVDataTable.ObjectId = _this.Layout.ObjectId;

                // Define the header for the dataTable
                QVDataTable.Headers = [];

                var noCols = _this.Data.HeaderRows[0].length;

                //for (var r = 0; r < _this.Data.HeaderRows.length; r++) {
                var r = 0; // Only export the first row
                for (var c = 0; c < noCols; c++) {
                    var header = {};
                    header.Name = _this.Data.HeaderRows[r][c].text;
                    QVDataTable.Headers.push(header);
                }
                //}

                // Define the rows/cols
                QVDataTable.Rows = [];
                $("input[name='SelectionCheckbox_" + safeId(_this.Layout.ObjectId) + "']:checked").each(function () {
                    var dataidx = this.dataIndex; //this for checkbox (not _this) !!!
                    var dataRow = {};
                    dataRow.Cells = [];
                    for (c = 0; c < noCols; c++) {
                        var datacolumn = {
                            Text: _this.Data.Rows[dataidx][c].text,
                            Data: _this.Data.Rows[dataidx][c].data
                        };
                        dataRow.Cells.push(datacolumn);
                    }
                    QVDataTable.Rows.push(dataRow);
                });


                return QVDataTable;

            }

            // ------------------------------------------------------------------
            // Loading Panel
            // ------------------------------------------------------------------
            function showLoadingPanel(msg) {
                if (msg != '') { $('#loadingInnerMsg_' + GetSafeId()).innerText = msg };
                $("#loadingPanel_" + GetSafeId()).show();
            }

            function hideLoadingPanel() {
                $("#loadingPanel_" + GetSafeId()).hide();
            }

            function initLoadingPane() {

                var divLoader = document.createElement("div");
                divLoader.className = "divLoading";
                divLoader.id = "loadingPanel_" + GetSafeId();

                var imageUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + 'Extensions/Data2Webservice/Loading.gif';
                var loadingMsg = document.createElement("div");
                loadingMsg.style.width = GetTableWidth();
                loadingMsg.style.textAlign = "center";

                var loadingInnerMsg = document.createElement("div");
                loadingInnerMsg.id = "loadingInnerMsg_" + GetSafeId();
                loadingInnerMsg.className = "loadingInnerMsg";
                //loadingInnerMsg.innerText = "Loading data ...";


                var loadingImg = document.createElement("img");
                loadingImg.src = imageUrl;
                loadingImg.className = "loadingImg";
                loadingImg.style.paddingTop = (_this.GetHeight() / 2) - 40 + "px";

                loadingMsg.appendChild(loadingImg);
                loadingMsg.appendChild(loadingInnerMsg);
                divLoader.appendChild(loadingMsg);

                _this.Element.appendChild(divLoader);

            }

            // ------------------------------------------------------------------
            // Internal Methods
            // ------------------------------------------------------------------
            function GetTableHeight() {
                _this.GetHeight() - 35 + "px";
            }

            function GetTableWidth() {
                _this.GetWidth() + "px";
            }

            function safeId(str) {
                return str.replace("\\", "_");
            }

            function GetSafeId() {
                return safeId(_this.Layout.ObjectId);
            }

            // ------------------------------------------------------------------
            // Events ...
            // ------------------------------------------------------------------
            function dataRow_Click() {
                var dataIndex = this.dataIndex; //this is in the current case the dataRow

                // Toggle selection of checkbox
                $("#chk_" + dataIndex).toggleCheckbox();

                // Deactivated code for highliting the selected/deselected row with background colors ...
                //var checked = $("#chk_" + dataIndex).attr('checked') == "checked";
                //                var newCSS = '';
                //                if (checked) {
                //                    newCSS = 'deselectRecord';
                //                }
                //                else {
                //                    newCSS = 'selectRecord';
                //                }

                //                var oldBgColor = $("#dr_" + dataIndex).backgroundColor;
                //                $("#dr_" + dataIndex).addClass(newCSS, 10).removeClass(newCSS, 1000);

                updateStatusContent();
            }

            function dataRowsAll_Click() {
                $("[name^=SelectionCheckbox_]").each(function () {
                    this.checked = true;
                });
            }

            function dataRowsNone_Click() {
                $("[name^=SelectionCheckbox_]").each(function () {
                    this.checked = false;
                });
                return true;
            }



            function selectionChange_Click() {
                updateStatusContent();
            }

            function submitButton_Click() {

                showLoadingPanel("Submitting data to salesforce.com");

                var resultsFromData = getResults();

                var stringJSON = JSON.stringify(resultsFromData);
                var webServiceUrl = _this.WebserviceUrl;
                postData(webServiceUrl, resultsFromData);

            }

            // ------------------------------------------------------------------
            // Webservice Call
            // ------------------------------------------------------------------
            function postData(webServiceUrl, obj) {

                jQuery.support.cors = true;
                $.ajax({
                    type: "POST",
                    url: webServiceUrl,
                    data: "{'qvDataTable':" + JSON.stringify(obj) + "}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {

                        hideLoadingPanel();
                        alert(msg.d.StatusMessage);

                        //Todo: Handle return msg

                    },
                    error: function (xhr, ajaxOptions, thrownError) {

                        switch (xhr.status.toString()) {
                            case "404":
                                alert('Error 404 posting the data to the webservice!\n\nCould not find webservice at Url ' + _this.WebserviceUrl);
                                break;

                            default:
                                alert('Error posting the data to the webservice:\n\n' + 'Error Status: ' + xhr.status + '\nError Status: ' + xhr.statusText);
                                break;
                        }
                        hideLoadingPanel();

                        //                        var msg = JSON.parse(xhr.responseText);
                        //                        alertProps(msg);
                        //                        alert(msg);
                        //                        alert(xhr.status);
                        //                        alert(thrownError);
                        //                        alert(xhr.statusText);
                    }
                });

            }
        }, false);
}
Data2Webservice_Init();


// jQuery Extensions
$.fn.toggleCheckbox = function () {
    this.attr('checked', !this.attr('checked'));
}

// Some helper functions
function alertProps(o) {
    var sMsg = "";
    for (var key in o) {
        if (o.hasOwnProperty(key)) {
            //alert(key + " -> " + o[key]);
            sMsg += key + " -> " + o[key] + "\n";
        }
    }
    alert(sMsg);
}