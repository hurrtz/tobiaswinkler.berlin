import { ContactForm } from './components/ContactForm';
import { CareerTimeline } from './components/CareerTimeline';
import { Imprint } from './components/Imprint';
import { SocialLinks } from './components/SocialLinks';
import {
  experienceGroups,
  profile,
  socialLinks,
  sideProjects,
  topicOptions
} from './data/content';

function App() {
  return (
    <div className="page-shell">
      <main className="business-card">
        <section className="hero-card surface">
          <div className="hero-copy">
            <span className="eyebrow">Tobias Winkler</span>
            <h1>Dark, direct, and built to be contacted.</h1>
            <p className="lede">{profile.summary}</p>
            <div className="hero-meta">
              <span>{profile.location}</span>
              <span>{profile.roles}</span>
            </div>
            <ul className="topic-list" aria-label="Primary contact topics">
              {topicOptions.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="portrait-shell">
            <img
              src={profile.portraitUrl}
              alt="Portrait banner for Tobias Winkler"
              className="portrait-image"
            />
            <div className="portrait-caption">
              <span>Berlin-based</span>
              <span>Engineering manager</span>
              <span>Frontend craft</span>
            </div>
          </div>
        </section>

        <section className="contact-grid">
          <article className="contact-panel surface">
            <div className="section-heading">
              <span className="eyebrow">Contact</span>
              <h2>Tell me what you need.</h2>
              <p>
                This frontend-only form opens a prefilled draft in your default
                mail app. The destination address is configured in one place and
                easy to swap later.
              </p>
            </div>
            <ContactForm />
          </article>

          <aside className="summary-panel surface">
            <span className="eyebrow">At a glance</span>
            <h2>Business card first. Noise removed.</h2>
            <p>{profile.approach}</p>
            <div className="stat-block">
              <span className="stat-value">14+ years</span>
              <span className="stat-label">Frontend and product engineering</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">Berlin</span>
              <span className="stat-label">Hybrid leadership and hands-on delivery</span>
            </div>
            <div className="summary-note">
              <h3>Portrait swap</h3>
              <p>
                Drop a real banner image into
                {' '}
                <code>/public/images</code>
                {' '}
                and point
                {' '}
                <code>VITE_PORTRAIT_URL</code>
                {' '}
                at it when you are ready.
              </p>
            </div>

            <SocialLinks links={socialLinks} />
          </aside>
        </section>

        <section className="surface">
          <div className="section-heading">
            <span className="eyebrow">CV</span>
            <h2>Career timeline</h2>
            <p>
              Structured from the LinkedIn history you provided, with grouped
              companies where multiple roles belong together.
            </p>
          </div>
          <CareerTimeline experienceGroups={experienceGroups} />
        </section>

        <section className="surface">
          <div className="section-heading">
            <span className="eyebrow">Side projects</span>
            <h2>Built alongside the day job.</h2>
            <p>
              I wired in the project section and the current topics you named.
              Exact build windows can be dropped in once you pull them from
              LinkedIn or your notes.
            </p>
          </div>
          <div className="project-grid">
            {sideProjects.map((project) => (
              <article key={project.name} className="project-card">
                <div className="project-head">
                  <h3>{project.name}</h3>
                  <span>{project.period}</span>
                </div>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <Imprint />
      </main>
    </div>
  );
}

export default App;
