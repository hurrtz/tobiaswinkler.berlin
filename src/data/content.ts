export const topicOptions = ['SchnackAI app', 'Rasseportrait', 'Other'] as const;

export type ExperienceRole = {
  title: string;
  period: string;
  detail?: string;
};

export type ExperienceGroup = {
  company: string;
  meta: string;
  location?: string;
  roles: ExperienceRole[];
};

export type SocialLink = {
  name: string;
  value: string;
  href?: string;
};

export const profile = {
  name: 'Tobias Winkler',
  location: 'Berlin, Germany',
  roles: 'Engineering manager · Senior frontend developer · Freelance product builder',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL ?? 'info@tobiaswinkler.berlin',
  portraitUrl:
    import.meta.env.VITE_PORTRAIT_URL ?? '/images/tobias-banner-placeholder.svg',
  summary:
    'A personal landing page meant to work like a premium business card: one strong image, one direct way to get in touch, and the relevant professional context underneath.',
  approach:
    'Product sense, frontend depth, and engineering leadership. The page is intentionally reduced: clear entry point, elegant typography, dark surfaces, and no wasted sections.'
};

export const experienceGroups: ExperienceGroup[] = [
  {
    company: 'Omio',
    meta: 'Full-time · 5 years 3 months',
    location: 'Berlin, Germany · Hybrid',
    roles: [
      {
        title: 'Engineering Manager',
        period: 'Oct 2023–Today'
      },
      {
        title: 'Senior Frontend Developer',
        period: 'Jan 2021–Apr 2024'
      }
    ]
  },
  {
    company: 'Tobias Winkler',
    meta: 'Freelance',
    roles: [
      {
        title: 'Webentwickler (Freelance)',
        period: 'Feb 2018–Dec 2022'
      }
    ]
  },
  {
    company: 'SPRING Axel Springer Digital News Media GmbH & Co. KG',
    meta: 'Full-time',
    location: 'Berlin, Germany',
    roles: [
      {
        title: 'Software Engineer',
        period: 'Feb 2020–Dec 2020'
      }
    ]
  },
  {
    company: 'Aklamio',
    meta: 'Full-time',
    roles: [
      {
        title: 'Senior Frontend Developer',
        period: 'Sep 2019–Feb 2020'
      }
    ]
  },
  {
    company: 'HQ plus',
    meta: 'Full-time',
    location: 'Berlin',
    roles: [
      {
        title: 'Lead Frontend Developer',
        period: 'Feb 2017–Jan 2018'
      }
    ]
  },
  {
    company: 'USEEDS° GmbH',
    meta: 'Full-time',
    location: 'Berlin',
    roles: [
      {
        title: 'Frontend Entwickler',
        period: 'May 2014–Jan 2017'
      }
    ]
  },
  {
    company: 'Beyond Interactive Solutions GmbH',
    meta: 'Full-time',
    location: 'Berlin',
    roles: [
      {
        title: 'Frontend Developer',
        period: 'Nov 2012–Apr 2014'
      }
    ]
  },
  {
    company: 'blau direkt GmbH & Co. KG',
    meta: '2 years 11 months',
    location: 'Berlin',
    roles: [
      {
        title: 'Frontend Developer',
        period: 'Jan 2012–Aug 2012'
      },
      {
        title: 'Fachinformatiker Anwendungsentwicklung',
        period: 'Oct 2009–Dec 2011'
      }
    ]
  }
];

export const sideProjects = [
  {
    name: 'SchnackAI app',
    period: 'Add exact build window',
    summary:
      'Reserved as a polished timeline card so you can drop in the exact dates, scope, and launch context once you pull them from your own notes.'
  },
  {
    name: 'Rasseportrait',
    period: 'Add exact build window',
    summary:
      'Prepared as a second callout beneath the CV so project work can sit next to the employment history without making the page feel crowded.'
  }
];

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    value: 'Add your GitHub URL here'
  },
  {
    name: 'Xing',
    value: 'Add your Xing URL here'
  },
  {
    name: 'LinkedIn',
    value: 'Add your LinkedIn URL here'
  },
  {
    name: 'X',
    value: 'Add your X URL here'
  },
  {
    name: 'Instagram',
    value: 'Add your Instagram URL here'
  }
];
