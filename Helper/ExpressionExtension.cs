using System.Linq.Expressions;
using System.Reflection;

namespace System
{
    public static class ExpressionExtension
    {
        public static PropertyInfo GetPropInfo(this Expression<Func<Object>> expression)
        {
            var lambdaExpression = expression as LambdaExpression;
            var member = GetMemberExpressionFromLambaExpression(lambdaExpression);
            return GetPropInfo(member);
        }

        public static PropertyInfo GetColumnInfo<TEntity, TValue>(this Expression<Func<TEntity, TValue>> expression)
        {
            var lambda = expression as LambdaExpression;

            MemberExpression memberExpression = GetMemberExpressionFromLambaExpression(lambda);

            return memberExpression.GetPropInfo();
        }

        public static MemberExpression GetMemberExpressionFromLambaExpression(this LambdaExpression lambda)
        {
            MemberExpression memberExpression;

            if (lambda.Body is UnaryExpression)
            {
                var unaryExpression = lambda.Body as UnaryExpression;
                memberExpression =
                unaryExpression.Operand as MemberExpression;
            }
            else
                memberExpression = lambda.Body as MemberExpression;

            if (memberExpression == null)
                throw new NullReferenceException("memberExpression");
            return memberExpression;
        }

        public static PropertyInfo GetPropInfo(this MemberExpression expression)
        {
            var memberExpression = expression;
            var propertyInfo = memberExpression.Member as PropertyInfo;
            return propertyInfo;
        }

        public static ConstantExpression GetConstantExpression(this Expression<Func<Object>> expression)
        {
            var lambdaExpression = expression as LambdaExpression;

            var member = GetMemberExpressionFromLambaExpression(lambdaExpression);

            return GetConstantExpression(member);
        }

        public static ConstantExpression GetConstantExpression(this MemberExpression expression)
        {
            var constantExpression = expression.Expression as ConstantExpression;

            if (constantExpression == null)
                throw new NullReferenceException("constantExpression");

            return constantExpression;
        }
    }
}