define(['app'],function(app){
    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('fa', {
            'SAVE': 'ذخیره',
            'NEW': 'جدید',
            'REMOVE': 'حذف',
            'SHOW': 'نمایش',
            'NEW PRODUCT': 'محصول جدید',
            'TITLE': 'عنوان',
            'PRICE': 'قیمت',
            'CONFIRM': 'تایید',
            'CANCEL': 'انصراف',
            'SELECT IMAGE': 'انتخاب عکس',
            'NAME': 'نام',
            'DES': 'توضیحات',
            'SCALE': 'واحد اندازه گیری',
            'PURCHASEMETHOD': 'روش خرید',
            'DATE': 'تاریخ',
            'SECTION': 'قسمت',
            'CONSUMER': 'مصرف کننده',
            'REQUESTER': 'درخواست دهنده',
            'QTY': 'مقدار',
            'LETTER': 'نامه',
            'OFFICER': 'کارپرداز',
            'EXTRACOST': 'هزینه اضافه',
            'COSTDETAIL': 'ریز هزینه',
            'COST': 'هزینه',

            'NAME IS REQUIRED': 'نام اجباری است',
            'TITLE IS REQUIRED': 'عنوان اجباری است',
            'SCALE IS REQUIRED': 'مقیاس اجباری است',
            'DATE IS REQUIRED': 'تاریخ اجباری است',
            'SECTION IS REQUIRED': 'قسمت اجباری است',
            'CONSUMER IS REQUIRED': 'مصرف کننده اجباری است',
            'FOOD IS REQUIRED': 'میوه و شیرینی اجباری است',
            'QTY IS REQUIRED': 'مقدار اجباری است',
            'PRICE IS REQUIRED': 'قیمت اجباری است',
            'OFFICER IS REQUIRED': 'کارپرداز اجباری است',

            'FOOD': 'میوه و شیرینی',

            'ASSIGNOFFICER': 'انتخاب کارپرداز',
            'CLOSE': 'بستن',
            'ADDDETAIL': 'ردیف جدید'
        });

        $translateProvider.translations('de', {
            'SAVE': 'Hallo',
            'NEW': 'Dies ist ein Paragraph'
        });

        $translateProvider.preferredLanguage('fa');
    }]);
});
