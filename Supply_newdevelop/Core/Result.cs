using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public interface IResult
    {
        IList<Error> Errors { get; set;}
        bool IsValid { get; }
    }
    public class Result : IResult
    {
        public Result()
        {
            Errors = new List<Error>();
        }
        public IList<Error> Errors { get; set; }
        public bool IsValid { get { return !Errors.Any(); } }
    }

    public class Error
    {
        public string Message { get; set; }
        public string PropertyName { get; set; }
    }
}
