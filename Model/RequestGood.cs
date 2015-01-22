using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class RequestGood : Request
    {
        [Display(Name = "شماره درخواست کالا از انبار")]
        public virtual Int32? RequestGoodNo { get; set; }

        [Display(Name = "انبار محل تحویل")]
        public virtual Stock StockDeliveryLocation { get; set; }

        public virtual Int32? StockDeliveryLocationID { get; set; }

        public virtual ICollection<RequestDetailGood> RequestDetailGoods { get; set; }

        public virtual ICollection<LetterRequestGood> LetterRequestGoods { get; set; }

        public virtual ICollection<EffectiveCostGood> EffectiveCostGoods { get; set; }

    }

    
}
