import { profile } from '../data/content';

export function Imprint() {
  return (
    <section className="surface imprint-card">
      <div className="section-heading">
        <span className="eyebrow">Imprint</span>
        <h2>Legal details</h2>
        <p>
          I included the structure and the contact channel. The postal address
          line is left intentionally obvious so you can replace it with the full
          legal data before launch.
        </p>
      </div>

      <dl className="imprint-grid">
        <div>
          <dt>Name</dt>
          <dd>{profile.name}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
          </dd>
        </div>
        <div>
          <dt>Postal address</dt>
          <dd>Add full legal address before publishing.</dd>
        </div>
      </dl>
    </section>
  );
}
