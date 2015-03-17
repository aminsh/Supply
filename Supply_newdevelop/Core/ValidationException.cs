using System;
// ReSharper disable InconsistentNaming
namespace Core
{
    public class ValidationException : Exception
    {
        public object validationErrors { get; set; }
    }
}
