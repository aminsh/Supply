using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helper
{
    public static class DateTimeExtension
    {
        public static string DateTimeToString(this DateTime date, string format = "yyyy/MM/dd")
        {
            var pc = new PersianCalendar();
            var year = pc.GetYear(date).ToString();
            var month = (pc.GetMonth(date) + 100).ToString().Substring(1);
            var day = (pc.GetDayOfMonth(date) + 100).ToString().Substring(1);
            var strdate = format;
            strdate = strdate.Replace("yyyy", year);
            strdate = strdate.Replace("MM", month);
            strdate = strdate.Replace("dd", day);
            return strdate;
        }

        public static String GetMonthName(this DateTime date)
        {
            var pc = new PersianCalendar();
            var month = pc.GetMonth(date);
            var months = DateTimeHelper.Months().ToArray();
            return months[month - 1];
        }
    }
}
