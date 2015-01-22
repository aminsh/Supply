var helper = helper || {};

$(function () {

    Date.prototype.toPersian = function () {
        var year = this.getFullYear();
        var month = this.getMonth() + 1;
        var day = this.getDate();
        
        var persian = jd_to_persian(gregorian_to_jd(year, month, day));
        return persian[0] + "/" + persian[1] + "/" + persian[2];
    };

    window.stringToDate = function(stringDate) {
        return new Date(stringDate);
    };
    
    helper.date = (function () {
        var persianToDate = function(persianDate) {
            var dateArray = persianDate.split('/');

            var year = Number(dateArray[0]);
            var month = Number(dateArray[1]);
            var day = Number(dateArray[2]);

            if (year % 4 == 3) day--;
            if ((month < 10) || (month == 10 && day < 11))
                year = year + 621;
            else
                year = year + 622;

            switch (month) {
                case 1:
                    {
                        if (day < 12) {
                            month = 3;
                            day = day + 20;
                        } else {
                            month = 4;
                            day = day - 11;
                        }

                    }
                    break;
                case 2:
                    {
                        if (day < 11) {
                            month = 4;
                            day = day + 20;
                        } else {
                            month = 5;
                            day = day - 10;
                        }

                    }
                    break;
                case 3:
                    {
                        if (day < 11) {
                            month = 5;
                            day = day + 21;
                        } else {
                            month = 6;
                            day = day - 10;
                        }

                    }
                    break;
                case 4:
                    {
                        if (day < 10) {
                            month = 6;
                            day = day + 21;
                        } else {
                            month = 7;
                            day = day - 9;
                        }

                    }
                    break;
                case 5: case 6: case 8:
                    {
                        if (day < 10) {
                            month = month + 2;
                            day = day + 22;
                        } else {
                            month = month + 3;
                            day = day - 9;
                        }

                    }
                    break;
                case 7:
                    {
                        if (day < 9) {
                            month = 9;
                            day = day + 22;
                        } else {
                            month = 10;
                            day = day - 8;
                        }

                    }
                    break;
                case 9:
                    {
                        if (day < 10) {
                            month = 11;
                            day = day + 21;
                        } else {
                            month = 12;
                            day = day - 9;
                        }

                    }
                    break;
                case 10:
                    {
                        if (day < 11) {
                            month = 12;
                            day = day + 21;
                        } else {
                            month = 1;
                            day = day - 10;
                        }

                    }
                    break;
                case 11:
                    {
                        if (day < 12) {
                            month = 1;
                            day = day + 20;
                        } else {
                            month = 2;
                            day = day - 11;
                        }

                    }
                    break;
                case 12:
                    {
                        if (day < 11) {
                            month = 2;
                            day = day + 19;
                        } else {
                            month = 7;
                            day = day - 10;
                        }

                    }
                    break;
                default:
            }

            return new Date(year + '/' + month + '/' + day);
        },
            convertPersianToDate = function (persianDate) {
                var dateArray = persianDate.split('/');

                var year = Number(dateArray[0]);
                var month = Number(dateArray[1]);
                var day = Number(dateArray[2]);

                if (year % 4 == 3) day--;
                if ((month < 10) || (month == 10 && day < 11))
                    year = year + 621;
                else
                    year = year + 622;

                switch (month) {
                case 1:
                    {
                        if (day < 12) {
                            month = 3;
                            day = day + 20;
                        } else {
                            month = 4;
                            day = day - 11;
                        }

                    }
                    break;
                case 2:
                    {
                        if (day < 11) {
                            month = 4;
                            day = day + 20;
                        } else {
                            month = 5;
                            day = day - 10;
                        }

                    }
                    break;
                case 3:
                    {
                        if (day < 11) {
                            month = 5;
                            day = day + 21;
                        } else {
                            month = 6;
                            day = day - 10;
                        }

                    }
                    break;
                case 4:
                    {
                        if (day < 10) {
                            month = 6;
                            day = day + 21;
                        } else {
                            month = 7;
                            day = day - 9;
                        }

                    }
                    break;
                case 5, 6, 8:
                    {
                        if (day < 10) {
                            month = month + 2;
                            day = day + 22;
                        } else {
                            month = month + 3;
                            day = day - 9;
                        }

                    }
                    break;
                case 7:
                    {
                        if (day < 9) {
                            month = 9;
                            day = day + 22;
                        } else {
                            month = 10;
                            day = day - 8;
                        }

                    }
                    break;
                case 9:
                    {
                        if (day < 10) {
                            month = 11;
                            day = day + 21;
                        } else {
                            month = 12;
                            day = day - 9;
                        }

                    }
                    break;
                case 10:
                    {
                        if (day < 11) {
                            month = 12;
                            day = day + 21;
                        } else {
                            month = 1;
                            day = day - 10;
                        }

                    }
                    break;
                case 11:
                    {
                        if (day < 12) {
                            month = 1;
                            day = day + 20;
                        } else {
                            month = 2;
                            day = day - 11;
                        }

                    }
                    break;
                case 12:
                    {
                        if (day < 11) {
                            month = 2;
                            day = day + 19;
                        } else {
                            month = 7;
                            day = day - 10;
                        }

                    }
                    break;
                default:
                }

                return new Date(year + '/' + month + '/' + day);
            };

        var currentYear = function() {
            var today = new Date;
            var persianToday = today.toPersian();
            var year = persianToday.split('/')[0];
            var persianMin = year + '/1/1';
            var persianMax = year + '/12/29';

            return {
                minDate: persianToDate(persianMin),
                maxDate: persianToDate(persianMax),
                minDatePersian: persianMin,
                maxDatePersian: persianMax
            };
        };

        var currentSeason = function() {
            var today = new Date;
            var persianToday = today.toPersian();
            var year = persianToday.split('/')[0];
            var monthNo = persianToday.split('/')[1];

            var result = {};
            if (monthNo <= 3) {
                result.minDatePersian = year + '/1/1';
                result.maxDatePersian = year + '/3/31';
            }
            
            if ((monthNo > 3) && (monthNo <= 6)) {
                result.minDatePersian = year + '/4/1';
                result.maxDatePersian = year + '/6/31';
            }
            
            if ((monthNo > 6) && (monthNo <= 9)) {
                result.minDatePersian = year + '/7/1';
                result.maxDatePersian = year + '/9/30';
            }
            
            if ((monthNo > 9) && (monthNo <= 12)) {
                result.minDatePersian = year + '/10/1';
                result.maxDatePersian = year + '/12/29';
            }

            result.minDate = persianToDate(result.minDatePersian);
            result.maxDate = persianToDate(result.maxDatePersian);

            return result;
        };

        var currentMonth = function() {
            var today = new Date;
            var persianToday = today.toPersian();
            var year = persianToday.split('/')[0];
            var monthNo = persianToday.split('/')[1];
            
            var result = {};
            result.minDatePersian = year + '/' + monthNo + '/1';
            
            if ((monthNo >= 1) && (monthNo <= 6)) 
                result.maxDatePersian = year + '/' + monthNo + '/31';
            
            if ((monthNo >= 7) && (monthNo <= 11))
                result.maxDatePersian = year + '/' + monthNo + '/30';
            
            if (monthNo == 12)
                result.maxDatePersian = year + '/' + monthNo + '/29';
            
            result.minDate = persianToDate(result.minDatePersian);
            result.maxDate = persianToDate(result.maxDatePersian);
            
            return result;
        };

        var currentWeek = function() {
            var thisSaturday = moment().day(0).day(-1).toDate();
            var thisFriday = moment().day(5).toDate();

            return {
                minDate: thisSaturday,
                maxDate: thisFriday,
                minDatePersian: thisSaturday.toPersian(),
                maxDatePersian: thisFriday.toPersian()
            };
        };

        var monthDateRange = function(monthNo) {
            var today = new Date;
            var persianToday = today.toPersian();
            var year = persianToday.split('/')[0];

            var result = {};
            result.minDatePersian = year + '/' + monthNo + '/1';

            if ((monthNo >= 1) && (monthNo <= 6))
                result.maxDatePersian = year + '/' + monthNo + '/31';

            if ((monthNo >= 7) && (monthNo <= 11))
                result.maxDatePersian = year + '/' + monthNo + '/30';

            if (monthNo == 12)
                result.maxDatePersian = year + '/' + monthNo + '/29';

            result.minDate = persianToDate(result.minDatePersian);
            result.maxDate = persianToDate(result.maxDatePersian);

            return result;
        };

        var seasonDateRange = function(seasonNo) {
            var today = new Date;
            var persianToday = today.toPersian();
            var year = persianToday.split('/')[0];

            var result = {};
            if (seasonNo == 1) {
                result.minDatePersian = year + '/1/1';
                result.maxDatePersian = year + '/3/31';
            }

            if (seasonNo == 2) {
                result.minDatePersian = year + '/4/1';
                result.maxDatePersian = year + '/6/31';
            }

            if (seasonNo == 3) {
                result.minDatePersian = year + '/7/1';
                result.maxDatePersian = year + '/9/30';
            }

            if (seasonNo == 4) {
                result.minDatePersian = year + '/10/1';
                result.maxDatePersian = year + '/12/29';
            }

            result.minDate = persianToDate(result.minDatePersian);
            result.maxDate = persianToDate(result.maxDatePersian);

            return result;
        };

        var persianMonths = [
            { key: 1, name: 'فروردین' },
            { key: 2, name: 'اردیبهشت' },
            { key: 3, name: 'خرداد' },
            { key: 4, name: 'تیر' },
            { key: 5, name: 'مرداد' },
            { key: 6, name: 'شهریور' },
            { key: 7, name: 'مهر' },
            { key: 8, name: 'آبان' },
            { key: 9, name: 'آذر' },
            { key: 10, name: 'دی' },
            { key: 11, name: 'بهمن' },
            { key: 12, name: 'اسفند' }
        ];

        var seasons = [
            { key: 1, name: 'spring', title: 'بهار' },
            { key: 2, name: 'summer', title: 'تابستان' },
            { key: 3, name: 'fall', title: 'پاییز' },
            { key: 4, name: 'winter', title: 'زمستان' }
        ];
        
        return {
            persianToDate: persianToDate,
            convertPersianToDate: convertPersianToDate,
            currentYear: currentYear,
            currentSeason: currentSeason,
            currentMonth: currentMonth,
            currentWeek: currentWeek,
            seasonDateRange: seasonDateRange,
            monthDateRange: monthDateRange,
            persianMonths: persianMonths,
            seasons: seasons
        };
    })();

    function convertParsianToDate(persianDate) {
        var dateArray = persianDate.split('/');

        dateArray.foreach(function(item) {
            item = Number(item);
        });
        
        var year = dateArray[0];
        var month = dateArray[1];
        var day = dateArray[2];

        if (year % 4 == 3) day--;
        if((month<10) || (month == 10 &&day<11))
            year = year + 621;
        else
            year = year + 622;

        switch (month) {
            case 1:
                {
                    if (day < 12) {
                        month = 3;
                        day = day + 20;
                    } else {
                        month = 4;
                        day = day - 11;
                    }

                }
                break;
            case 2:
                {
                    if (day < 11) {
                        month = 4;
                        day = day + 20;
                    } else {
                        month = 5;
                        day = day - 10;
                    }

                }
                break;
            case 3:
                {
                    if (day < 11) {
                        month = 5;
                        day = day + 21;
                    } else {
                        month = 6;
                        day = day - 10;
                    }

                }
                break;
            case 4:
                {
                    if (day < 10) {
                        month = 6;
                        day = day + 21;
                    } else {
                        month = 7;
                        day = day - 9;
                    }

                }
                break;
            case 5, 6, 8:
                {
                    if (day < 10) {
                        month = month + 2;
                        day = day + 22;
                    } else {
                        month = month + 3;
                        day = day - 9;
                    }

                }
                break;
            case 7:
                {
                    if (day < 9) {
                        month = 9;
                        day = day + 22;
                    } else {
                        month = 10;
                        day = day - 8;
                    }

                }
                break;
            case 9:
                {
                    if (day < 10) {
                        month = 11;
                        day = day + 21;
                    } else {
                        month = 12;
                        day = day - 9;
                    }

                }
                break;
            case 10:
                {
                    if (day < 11) {
                        month = 12;
                        day = day + 21;
                    } else {
                        month = 1;
                        day = day - 10;
                    }

                }
                break;
            case 11:
                {
                    if (day < 12) {
                        month = 1;
                        day = day + 20;
                    } else {
                        month = 2;
                        day = day - 11;
                    }

                }
                break;
            case 12:
                {
                    if (day < 11) {
                        month = 2;
                        day = day + 19;
                    } else {
                        month = 7;
                        day = day - 10;
                    }

                }
                break;
            default:
        }

        return new Date(year + '/' + month + '/' + day);
    }
});