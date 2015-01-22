

using System.Activities;

namespace System
{
    public class ValidationExceptionX : ValidationException
    {
        public ValidationExceptionX(String message, Exception innerException)
            : base(message, innerException)
        {

        }

        public Object EntityInError { get; set; }

        public String BadProp { get; set; }
    }
}