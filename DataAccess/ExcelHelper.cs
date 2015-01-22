using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;

namespace DataAccess
{
    public class ExcelHelper
    {
        public static OleDbConnection GetConnextion(string fileName)
        {
            OleDbConnection cn;
            var originalExtension = Path.GetExtension(fileName);

            if (originalExtension != null && originalExtension.ToLower() == ".xls")
                cn = new OleDbConnection(string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};Extended Properties=Excel 8.0", fileName));
            else
                cn = new OleDbConnection(string.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=Excel 12.0 Xml;HDR=YES;IMEX=1", fileName));

            return cn;
        }

        public static IEnumerable<String> Sheets(String fileName)
        {
            var connection = GetConnextion(fileName);
            connection.Open();
            var dt = connection.GetSchema("tables");
            var result = dt.AsEnumerable().Select(t => t.Field<String>("Table_Name").Replace("$",string.Empty));
            connection.Close();
            return result;
        }

        public static bool IsSheetNameValid(OleDbConnection connection,String sheet)
        {
            connection.Open();
            var dt = connection.GetSchema("tables");
            var result = dt.AsEnumerable().Any(s => s.Field<String>("Table_Name").Contains(sheet));
            connection.Close();
            return result;
        }

        public static DataSet ExcelToDataset(string fileName, string sheet)
        {
            var originalExtension = Path.GetExtension(fileName);

            var connection = GetConnextion(fileName);
            DataSet ds;
            OleDbDataAdapter command;

            IsSheetNameValid(connection, sheet);
            command = new OleDbDataAdapter(string.Format("select * from [{0}$]", sheet), connection);
            command.TableMappings.Add("Table", "Table1");
            ds=new DataSet();
            command.Fill(ds);
            return ds;
        }
    }
}