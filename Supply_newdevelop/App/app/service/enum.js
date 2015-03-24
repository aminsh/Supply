define(['app'],function(app){
    app.register.factory('enums', function(){
        return{
            purchaseMethod: [
                {key: 'Small', value: 'جزئی'},
                {key: 'Quotation', value: 'استعلام'},
                {key: 'Tender', value: 'مناقصه'},
                {key: 'DirectDelivery', value: 'تحویل مستقیم'},
                {key: 'Contract', value: 'قرارداد'},
            ]
        }
    });
});