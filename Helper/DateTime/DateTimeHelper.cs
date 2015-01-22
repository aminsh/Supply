using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Helper
{
    public class DateTimeHelper
    {
        public static List<String> Months()
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

        public static DateTime PersianToDateTime(string date)
        {
            //if(date.Length==10) date = date.Replace("/", string.Empty);

            var dateList = date.Split('/');

            var pc = new PersianCalendar();
            //var year = Convert.ToInt32(date.Substring(4));
            //var month = Convert.ToInt32(date.Substring(2, 2));
            //var day = Convert.ToInt32(date.Substring(0, 2));

            var year = dateList[0].Convert<int>();
            var month = dateList[1].Convert<int>();
            var day = dateList[2].Convert<int>();

            return pc.ToDateTime(year, month, day, 0, 0, 0, 0);
        }

    }
}
