import type { SocialLink } from '../data/content';

type SocialLinksProps = {
  links: SocialLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <section className="social-stack" aria-labelledby="social-links-heading">
      <div className="social-heading">
        <span className="eyebrow">Profiles</span>
        <h3 id="social-links-heading">Find me elsewhere.</h3>
      </div>

      <div className="social-grid">
        {links.map((link) => {
          const content = (
            <>
              <span className="social-platform">{link.name}</span>
              <span className={`social-value${link.href ? '' : ' social-empty'}`}>
                {link.value}
              </span>
            </>
          );

          if (link.href) {
            return (
              <a
                key={link.name}
                className="social-card"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <div key={link.name} className="social-card social-card-static">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
