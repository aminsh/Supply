using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic
{
    public class BLLetter : BLBase<Letter>
    {
        public override void OnSubmitEntity(Letter entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            //var isNoDuplicated = Context.Letters.Any(l => l.No == entity.No);
            
            //if(isNoDuplicated) throw new ValidationException("شماره نامه تکراری میباشد",null,entity);
            base.OnSubmitEntity(entity, state, originalValues);
        }
    }

    public class BLLetterRequestGood : BLBase<Letter>
    {
        public override void OnSubmitEntity(Letter entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
