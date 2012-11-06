#region Using Directives
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
#endregion

namespace swr.QlikView.Extensions.Data2Webservice.WebService
{
    public class QVData
    {
        public static QVDataTable FromJson(string json)
        {
                    

            QVDataTable qvDataTable = null;

            qvDataTable = (QVDataTable)JsonConvert.DeserializeObject(json.ToString());


            return qvDataTable;
        }
    }


    [Serializable]
    public class QVDataTable
    {
        public string ObjectId { get; set; }
        public List<QVDataHeaderItem> Headers { get; set; }
        public List<QVDataRow> Rows { get; set; }

    }
    /// <summary>
    /// Represents a column.
    /// </summary>
    public class QVDataHeaderItem
    {
        public string Name { get; set; }        
    }

    public class QVDataRow 
    {
        public List<QVDataCell> Cells { get; set; }
    }
    public class QVDataCell
    {
        public string Text { get; set; }
        public decimal Data { get; set; }
    }
}