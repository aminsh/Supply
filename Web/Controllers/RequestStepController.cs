using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Linq;
using System.Web.Http;
using Helper;
using Model;

namespace Web.Controllers
{
    partial class SupplyController
    {

        [HttpGet]
        public IQueryable<RequestDefineStep> RequestDefineSteps()
        {
            return _contextProvider.Context.RequestDefineSteps;
        }

        [HttpGet]
        public IQueryable<RequestStep> MyInProgressSteps()
        {
            var userId = _contextProvider.Context.CurrentUser().ID;
            return
                _contextProvider.Context.RequestSteps.Where(
                    rs => rs.HandlerUserID ==  userId && rs.Status == StepStatus.InProgress);
        }

        [HttpGet]
        public IQueryable<RequestStep> NewSteps()
        {
            var userId = _contextProvider.Context.CurrentUser().ID;

            return
                _contextProvider.Context.RequestSteps.Where(
                    rs =>
                    rs.Status == StepStatus.New &&
                    rs.Step.HandlerUsers.Any(hu => hu.UserID == userId)
                    );
        }

        [HttpGet]
        public IQueryable<RequestStep> MySteps()
        {
            var userId = _contextProvider.Context.CurrentUser().ID;

            return
                _contextProvider.Context.RequestSteps.Where(
                    rs =>
                    (rs.HandlerUserID == userId && rs.Status == StepStatus.InProgress) ||
                    (rs.Status == StepStatus.New && rs.Step.HandlerUsers.Any(hu => hu.UserID == userId))
                    );
        }

        [HttpGet]
        public RequestStep FirstRequestStep(Int32 requestId)
        {
            var bl = new BussinessLogic.BLRequestStep() { Context = _contextProvider.Context };

            var requestStep = bl.FirstStep(requestId);

            _contextProvider.Context.SaveChanges();

            return requestStep; 
        }

        [HttpGet]
        public RequestStep AssignToMeRequestStep(string step)
        {
            var requestStep = JsonHelper.ConvertToObject<IEnumerable<RequestStep>>(step).First();

            var bl = new BussinessLogic.BLRequestStep() { Context = _contextProvider.Context };

            _contextProvider.Context.Set<RequestStep>().Attach(requestStep);
            _contextProvider.Context.Entry(requestStep).State = EntityState.Modified;

            requestStep = bl.StepAssignToMe(requestStep);

           Save(requestStep);
           
            return requestStep;
        }

        [HttpGet]
        public RequestStep AssignToPurchasingOfficer(string step, int employeeId)
        {
            var requestStep = step.JsonToObject<RequestStep>().First();

            var bl = new BussinessLogic.BLRequestStep() {Context = _contextProvider.Context};

            requestStep = bl.AssignToPurchasingOfficer(requestStep,employeeId);

            _contextProvider.Context.Set<RequestStep>().Attach(requestStep);
            _contextProvider.Context.Entry(requestStep).State = EntityState.Modified;

            Save(requestStep);

            return requestStep;
        }

        [HttpGet]
        public RequestStep DoneRequestStep(string step)
        {
            var requestStep = step.JsonToObject<RequestStep>().First();

            var bl = new BussinessLogic.BLRequestStep() {Context = _contextProvider.Context};

            requestStep = bl.DoneStep(requestStep);

            _contextProvider.Context.Set<RequestStep>().Attach(requestStep);
            _contextProvider.Context.Entry(requestStep).State = EntityState.Modified;

            Save(requestStep);

            return requestStep;
        }


        [HttpGet]
        public RequestStep GoToOrder(string step)
        {
            var requestStep = step.JsonToObject<RequestStep>().First();

            var bl = new BussinessLogic.BLRequestStep() { Context = _contextProvider.Context };

            requestStep = bl.GoToOrder(requestStep);

            _contextProvider.Context.Set<RequestStep>().Attach(requestStep);
            _contextProvider.Context.Entry(requestStep).State = EntityState.Modified;

            Save(requestStep);

            return requestStep;
        }

        [HttpGet]
        public RequestStep RejectStep(string step)
        {
            var requestStep = step.JsonToObject<RequestStep>().First();

            var bl = new BussinessLogic.BLRequestStep() { Context = _contextProvider.Context };

            requestStep = bl.Reject(requestStep);

            _contextProvider.Context.Set<RequestStep>().Attach(requestStep);
            _contextProvider.Context.Entry(requestStep).State = EntityState.Modified;

            Save(requestStep);

            return requestStep;
        }

        //This temporary method for solve this error 
        // Store update, insert, or delete statement affected an unexpected number of rows (0). 
        // Entities may have been modified or deleted since entities were loaded. Refresh ObjectStateManager entries.
        private void Save(object entity)
        {
            try
            {
                _contextProvider.Context.SaveChanges();
            }
            catch (Exception)
            {
                var context = ((IObjectContextAdapter)_contextProvider.Context).ObjectContext;
                context.Refresh(RefreshMode.ClientWins, entity);
                _contextProvider.Context.SaveChanges();
            }
        }
    }
}