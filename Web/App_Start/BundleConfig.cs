using System;
using System.Web.Optimization;

namespace Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/scripts/vendor")
                .Include("~/scripts/bootstrap.js")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/jquery-ui-{version}.js")
                .Include("~/scripts/amplify.js")
                .Include("~/scripts/query.ui.core.js")
                .Include("~/scripts/jquery.ui.datepicker-cc.js")
                .Include("~/scripts/calendar.js")
                .Include("~/scripts/jquery.ui.datepicker-cc-ar.js")
                .Include("~/scripts/jquery.ui.datepicker-cc-fa.js")
                .Include("~/scripts/knockout-{version}.debug.js")
                .Include("~/scripts/sammy-{version}.js")
                .Include("~/scripts/toastr.js")
                .Include("~/scripts/Q.js")
                .Include("~/scripts/breeze.debug.js")
                .Include("~/scripts/kendo/2013.1.319/kendo.web.min.js")
                .Include("~/scripts/knockout-kendo.js")
                .Include("~/scripts/moment.min.js")
                .Include("~/scripts/helper/helper.config.js")
                .Include("~/scripts/helper/helper.array.js")
                .Include("~/scripts/helper/helper.window.js")
                .Include("~/scripts/helper/helper.ko.js")
                .Include("~/scripts/helper/helper.note.js")
                .Include("~/scripts/helper/helper.date.js")
                .Include("~/scripts/helper/helper.ko_context.js")
                .Include("~/scripts/helper/helper.string.js")
                .Include("~/scripts/helper/helper.number.js")
                .Include("~/scripts/helper/helper.ajax.js")
                .Include("~/scripts/helper/helper.ko.bindingHandlers.js")
                .Include("~/scripts/helper/helper.modelInfo.js")
                .Include("~/scripts/helper/helper.datacontext.js")
                .Include("~/scripts/helper/helper.defaults.js")
              );

            bundles.Add(
              new StyleBundle("~/Content/css")
                .Include("~/Content/themes/themes/base/jquery.ui.core.css")
                .Include("~/Content/themes/start/jquery-ui-{version}.custom.css")
                .Include("~/Content/themes/themes/base/jquery.ui.datepicker.css")
                .Include("~/Content/jquery-ui-1.8.23.custom.css")
                .Include("~/Content/ie10mobile.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-responsive.css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/toastr.css")
                .Include("~/Content/app.css")
                .Include("~/Content/kendo/2013.1.319/kendo.rtl.min.css")
                .Include("~/Content/kendo/2013.1.319/kendo.default.min.css")
                .Include("~/Content/kendo/2013.1.319/kendo.common.min.css")
                .Include("~/Content/kendo/2013.1.319/kendo.blueopal.min.css")
                .Include("~/Content/main.css")
                .Include("~/Content/app.widget.css")
                .Include("~/Content/header.css")
                .Include("~/Content/bootstrapX.css")
                .Include("~/Content/body-main.css")
                
              );
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");

            //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}