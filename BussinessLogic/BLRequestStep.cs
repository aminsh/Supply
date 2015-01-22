using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLRequestStep : BLBase<RequestStep>
    {
        public override void OnSubmitEntity(RequestStep entity, EntityState state,
                                            Dictionary<string, object> originalValues)
        {
            base.OnSubmitEntity(entity, state, originalValues);

            switch (state)
            {
                case EntityState.Added:
                    {
                        entity.CreatedOnDate = DateTime.Now.Date;
                        entity.Status = StepStatus.New;
                    }
                    break;
                case EntityState.Modified:
                    {
                        if (entity.HandlerUserID.IsNull())
                            entity.HandlerUserID = Context.CurrentUser().ID;
                    }
                    break;
                case EntityState.Deleted:
                    {
                        Context.Entry(entity).State = EntityState.Unchanged;
                    }
                    break;
            }
        }

        public RequestStep StepAssignTo(RequestStep requestStep,User user)
        {
            requestStep.HandlerUser = user;
            requestStep.HandlerUserID = user.ID;
            requestStep.Status = StepStatus.InProgress;
            return requestStep;
        }

        public RequestStep StepAssignToMe(RequestStep requestStep)
        {
            return StepAssignTo(requestStep, Context.CurrentUser());
        }

        public RequestStep FirstStep(Int32 requestId)
        {
            var firstStep = Context.RequestDefineSteps.FirstOrDefault();

            if (firstStep.IsNull())
                throw new NullReferenceException("RequestStepTypes is null ...");

            var newEntity = new RequestStep()
            {
                RequestID = requestId,
                StepID = firstStep.ID
            };

            Context.RequestSteps.Add(newEntity);

            return newEntity;
        }
        public RequestStep DoneStep(RequestStep entity)
        {
            entity.Status = StepStatus.Done;

            var currentStep = Context.RequestDefineSteps.Find(entity.StepID).Ordering;
            var nextStep = Context.RequestDefineSteps
                .FirstOrDefault(st => st.Ordering == currentStep + 1 && st.IsActive && st.IsRequired);
            
            entity.DoneOnDate = DateTime.Now.Date;
           
            if (nextStep == null)
                return entity;

            var newEntity = new RequestStep()
                {
                    RequestID = entity.RequestID,
                    StepID = nextStep.ID
                };

            Context.RequestSteps.Add(newEntity);

            return entity;
        }

        public RequestStep CloseStep(RequestStep entity)
        {
            entity.Status = StepStatus.Done;

            var currentStep = Context.RequestDefineSteps.Find(entity.StepID).Ordering;
            var nextStep = Context.RequestDefineSteps
                .FirstOrDefault(st => st.Ordering == currentStep + 1 && st.IsActive && st.IsRequired);

            var closeStep =
                Context.RequestDefineSteps.FirstOrDefault(rds => rds.RequestDefineType == RequestDefineType.Closed);
            
            entity.DoneOnDate = DateTime.Now.Date;

            var newEntity = new RequestStep()
                {
                    RequestID = entity.RequestID,
                    StepID = closeStep.ID
                };

            Context.RequestSteps.Add(newEntity);

            return entity;
        }

        public RequestStep GoToOrder(RequestStep entity)
        {
            var request = Context.Requests.Find(entity.RequestID);
            request.HasOrder = true;
            return DoneStep(entity);
        }

        public RequestStep AssignToPurchasingOfficer(RequestStep entity, int employeeId)
        {
            entity.Status = StepStatus.Done;

            var currentStep = Context.RequestDefineSteps.Find(entity.StepID).Ordering;
            var nextStep = Context.RequestDefineSteps
                .FirstOrDefault(st => st.Ordering == currentStep + 1 && st.IsActive && st.IsRequired);

            entity.DoneOnDate = DateTime.Now.Date;

            var request = Context.Requests.FirstOrDefault(r => r.ID == entity.RequestID);
            request.PurchasingOfficerID = Context.PurchasingOfficers.FirstOrDefault(po => po.EmployeeID == employeeId).ID;
            request.OrderDate = DateTime.Now.Date;

            var purchasingOfficerUser = Context.Users.FirstOrDefault(u => u.EmployeeID == employeeId);
            if (purchasingOfficerUser == null)
                throw  new ArgumentException("The user with EmployeeID is not defined");

            if (nextStep == null)
                return entity;

            var newEntity = new RequestStep()
            {
                RequestID = entity.RequestID,
                StepID = nextStep.ID,
                HandlerUserID = purchasingOfficerUser.ID,
                Status = StepStatus.InProgress
            };

            Context.RequestSteps.Add(newEntity);

            return entity;
        }

        public RequestStep GoTo(Int32 requestId, Int32 stepTypeId)
        {
            // contorl no duplicate
            // control not inactive

            var newEntity = new RequestStep()
            {
                RequestID = requestId,
                StepID = stepTypeId
            };

            Context.RequestSteps.Add(newEntity);

            return newEntity;
        }

        public RequestStep Reject(RequestStep entity)
        {
            var request = Context.Requests.FirstOrDefault(r => r.ID == entity.RequestID);

            if(request == null)
                throw new NullReferenceException("Request is not exits");

            request.IsRejected = true;

            entity.Status = StepStatus.Rejected;

            return entity;
        }

        public RequestStep GetLastStep(int requestId)
        {
            return
                Context.RequestSteps.FirstOrDefault(
                    rs => rs.RequestID == requestId && rs.Status == StepStatus.InProgress);
        }
    }
}
