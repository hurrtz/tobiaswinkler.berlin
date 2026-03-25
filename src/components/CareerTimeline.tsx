import type { ExperienceGroup } from '../data/content';

type CareerTimelineProps = {
  experienceGroups: ExperienceGroup[];
};

export function CareerTimeline({ experienceGroups }: CareerTimelineProps) {
  return (
    <div className="timeline">
      {experienceGroups.map((group) => (
        <article key={group.company} className="timeline-card">
          <div className="timeline-company">
            <div>
              <h3>{group.company}</h3>
              <p>{group.meta}</p>
            </div>
            {group.location ? <span>{group.location}</span> : null}
          </div>

          <div className="timeline-roles">
            {group.roles.map((role) => (
              <div key={`${group.company}-${role.title}-${role.period}`} className="role-row">
                <div>
                  <h4>{role.title}</h4>
                  {role.detail ? <p>{role.detail}</p> : null}
                </div>
                <span>{role.period}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
