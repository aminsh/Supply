using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic
{
    public class BLSection : BLBase<Section>
    {
        public override void OnSubmitEntity(Section entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            base.OnSubmitEntity(entity, state, originalValues);
        }

        public String SetAllFullRoot(Section entity = null)
        {
            if (entity.IsNull())
            {
                Context.Sections.Where(s => !s.Children.Any()).ToList().ForEach(p =>
                    {
                        p.FullPathID = p.ID.ToString();
                        var parentRoot = SetAllFullRoot(p);
                        p.FullPathID = parentRoot; //+ "/" + p.ID;
                    });
                return "";
            }

            if (entity.Parent.IsNull())
                return entity.ID.ToString();

            entity.FullPathID = SetAllFullRoot(entity.Parent) + "/" + entity.ID;
            return entity.FullPathID;
        }

        public void SetFullPathIdForAllEntities()
        {
            var sections = Context.Sections
                .IncludeX(s => s.Parent)
                .IncludeX(s => s.Children)
                .Where(s => !s.Children.Any())
                .ToList();

            sections.ForEach(s => Set(s));
            Context.SaveChanges();
        }

        private string Set(Section section)
        {
            if (section.Parent.IsNull())
                section.FullPathID = section.ID.ToString();
            else
                section.FullPathID = Set(section.Parent) + "/" + section.ID;

            return section.FullPathID;
        }
    }
}
