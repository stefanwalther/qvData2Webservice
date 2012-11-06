#region Using Directives
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using System.Diagnostics; 
#endregion

namespace swr.QlikView.Extensions.Data2Webservice.WebService
{
    /// <summary>
    /// Summary description for HandleQVData
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService] 
    public class HandleQVData : System.Web.Services.WebService
    {

        [WebMethod(true)]
        public WSResponse GetQlikViewData(QVDataTable qvDataTable)
        {
            // WSResponse can be used to deliver some additional data back to the 
            // client (QlikView extension), e.g. a download-link, some detailed additional information, etc.
            WSResponse wsResponse = new WSResponse();

            try
            {
                #region Loop trough the data table
                if (qvDataTable != null)
                {
                    // Loop through the header columns
                    if (qvDataTable.Headers != null)
                    {
                        foreach (var h in qvDataTable.Headers)
                        {
                            Debug.Write("Header: " + "\t\t");
                        }
                        Debug.Write("\n");
                    }

                    // Loop trough all rows & cells
                    if (qvDataTable.Rows != null)
                    {
                        foreach (var r in qvDataTable.Rows)
                        {
                            foreach (var c in r.Cells)
                            {
                                // Access the text value of the current cell
                                Debug.Write(c.Text + "\t");

                                // Access the data value of the current cell
                                Debug.Write(c.Data + "\t");
                            }
                            Debug.Write("\n");
                        }
                    }
                }
                #endregion
                wsResponse.StatusMessage = "Successfully exported " + qvDataTable.Rows.Count.ToString() + " accounts to salesforce.com ...";
                string rMsg = String.Format("Upload of data has been process successfully. ({0} records)", qvDataTable.Rows.Count.ToString());
                wsResponse.ReturnMessage = rMsg;
            }
            catch (Exception ex)
            {

                wsResponse.StatusMessage = "Error";

            }

            return wsResponse;

        }

        public class WSResponse
        {
            
            /// <summary>
            /// Status for the Webservice. Either "OK" or "Error"
            /// </summary>
            public string StatusMessage { get; set; }

            public string ReturnMessage { get; set; }

            /// <summary>
            /// Exception while processing the request. If the webservice is successful, Exception is null.
            /// </summary>
            //public Exception Exception { get; set; }


            /// <summary>
            /// Additional return values.
            /// </summary>
            //public System.Collections.Hashtable ReturnValues { get; set; }

        }
        
        

    }
}
