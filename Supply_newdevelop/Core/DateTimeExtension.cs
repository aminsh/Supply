using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Helper;

namespace Core
{
    public static class DateTimeExtension
    {
        public static string ToPersian(this DateTime date, string format = "yyyy/MM/dd")
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

        public static int PersianMonthNumber(this DateTime data)
        {
           return new PersianCalendar().GetMonth(data);
        }

        public static int PersianYearNumber(this DateTime date)
        {
            return new PersianCalendar().GetYear(date);
        }

        public static int PersianDayNumber(this DateTime date)
        {
            return new PersianCalendar().GetDayOfMonth(date);
        }
    }

    public class DateTimeHelper
    {
        public static IEnumerable<String> Months()
        {
            var months = new List<String>
                             {
                                 "فروردین",
                                 "اردیبهشت",
                                 "خرداد",
                                 "تیر",
                                 "مرداد",
                                 "شهریور",
                                 "مهر",
                                 "آبان",
                                 "آذر",
                                 "دی",
                                 "بهمن",
                                 "اسفند"
                             };

            return months;
        }
    }
}
