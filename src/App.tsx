import { type FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Field,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  IconButton,
  Input,
  Link,
  NativeSelect,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Timeline
} from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXing } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { LuArrowUpRight } from 'react-icons/lu';

type ContactFormState = {
  topic: string;
  name: string;
  email: string;
  company: string;
  message: string;
};

type ContactRequestPayload = ContactFormState & {
  website: string;
  elapsedMs: number;
};

const CONTACT_ENDPOINT = '/contact.php';
const profileImageUrl = import.meta.env.VITE_PROFILE_IMAGE_URL ?? '/profile-photo.png';
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/hurrtz';
const xUrl = import.meta.env.VITE_X_URL ?? 'https://x.com/hurrtz';
const xingUrl =
  import.meta.env.VITE_XING_URL ?? 'https://www.xing.com/profile/Tobias_Winkler12';

const navigationItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'focus', label: 'Focus' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
  { id: 'imprint', label: 'Imprint' }
] as const;

const highlights = [
  { value: '14+', label: 'Years in frontend and product engineering' },
  { value: 'Berlin', label: 'Based in Germany, working across leadership and delivery' },
  {
    value: 'AI-native',
    label: 'Rebuilding teams toward fully enabled, self-unblocking engineering'
  }
] as const;

const focusAreas = [
  {
    title: 'Product-facing frontend',
    description:
      'Interfaces, flows, and systems that stay legible for users and maintainable for teams.'
  },
  {
    title: 'Technical leadership',
    description:
      'Rebuilding teams around AI-native workflows, stronger enablement, and engineers who can self-unblock quickly.'
  },
  {
    title: 'Native-first execution',
    description:
      'Moving away from the previous way of working toward faster loops, clearer ownership, and tool-augmented delivery.'
  }
] as const;

const experiences = [
  {
    company: 'Omio',
    meta: 'Full-time · 5 years 3 months · Berlin, Germany · Hybrid',
    roles: [
      'Engineering Manager · Oct 2023–Today',
      'Senior Frontend Developer · Jan 2021–Apr 2024'
    ]
  },
  {
    company: 'Tobias Winkler',
    meta: 'Freelance · 4 years 11 months',
    roles: ['Webentwickler · Feb 2018–Dec 2022']
  },
  {
    company: 'SPRING Axel Springer Digital News Media GmbH & Co. KG',
    meta: 'Full-time · 11 months · Berlin, Germany',
    roles: ['Software Engineer · Feb 2020–Dec 2020']
  },
  {
    company: 'Aklamio',
    meta: '6 months',
    roles: ['Senior Frontend Developer · Sep 2019–Feb 2020']
  },
  {
    company: 'HQ plus',
    meta: '1 year · Berlin',
    roles: ['Lead Frontend Developer · Feb 2017–Jan 2018']
  },
  {
    company: 'USEEDS° GmbH',
    meta: '2 years 9 months · Berlin',
    roles: ['Frontend Entwickler · May 2014–Jan 2017']
  },
  {
    company: 'Beyond Interactive Solutions GmbH',
    meta: '1 year 6 months · Berlin',
    roles: ['Frontend Developer · Nov 2012–Apr 2014']
  },
  {
    company: 'blau direkt GmbH & Co. KG',
    meta: '2 years 11 months · Berlin',
    roles: [
      'Frontend Developer · Jan 2012–Aug 2012',
      'Fachinformatiker Anwendungsentwicklung · Oct 2009–Dec 2011'
    ]
  }
] as const;

const projects = [
  {
    slug: 'schnackai',
    name: 'SchnackAI app',
    category: 'Independent product',
    href: undefined,
    summary:
      'A bring-your-own-key AI product built around flexible conversations, where providers and models can be switched live without breaking the active thread.'
  },
  {
    slug: 'rasseportrait',
    name: 'Rasseportrait',
    category: 'Fan project',
    href: 'https://hurrtz.github.io/rasseportrait',
    summary:
      'A fan project for the podcast "Tierisch Menschlich" by Martin Rütter and Katharina Adick, designed to turn breed-related content into a clearer, more navigable digital format.'
  },
  {
    slug: 'mut-taucher',
    name: 'mut-taucher.de',
    category: 'Client project',
    href: 'https://mut-taucher.de',
    summary:
      'A website for psychotherapeutic support where I built the frontend and the full CRM system behind it.'
  }
] as const;

type SocialLink = {
  label: string;
  href?: string;
  icon: IconType;
};

const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tobias-winkler-87a08210b/details/experience/', icon: FaLinkedinIn },
  { label: 'GitHub', href: 'https://github.com/hurrtz', icon: FaGithub },
  { label: 'X', href: xUrl, icon: FaXTwitter },
  { label: 'Instagram', href: instagramUrl, icon: FaInstagram },
  {
    label: 'Xing',
    href: xingUrl,
    icon: FaXing
  }
] as const;

const contactTopics = [
  'General',
  'Engineering leadership',
  'Frontend architecture',
  'Consulting',
  'New product idea',
  ...projects.map((project) => project.name)
] as const;

const defaultContactTopic = contactTopics[0];

function getInitialTopic(search: string): string {
  const requestedProject = new URLSearchParams(search).get('p')?.trim().toLowerCase();

  if (!requestedProject) {
    return defaultContactTopic;
  }

  const matchedProject = projects.find((project) => project.slug === requestedProject);
  return matchedProject?.name ?? defaultContactTopic;
}

function getInitialFormState(search = ''): ContactFormState {
  return {
    topic: getInitialTopic(search),
    name: '',
    email: '',
    company: '',
    message: ''
  };
}

type SectionHeadingProps = {
  title: string;
  description: string;
};

function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <Stack gap="3" maxW="3xl">
      <Heading
        as="h2"
        fontSize={{ base: '2xl', md: '3xl' }}
        lineHeight="1.1"
        letterSpacing="tight"
        color="fg"
      >
        {title}
      </Heading>
      <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall" color="fg.muted">
        {description}
      </Text>
    </Stack>
  );
}

function App() {
  const [formState, setFormState] = useState<ContactFormState>(() =>
    getInitialFormState(typeof window !== 'undefined' ? window.location.search : '')
  );
  const [honeypot, setHoneypot] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLDivElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatusMessage('');

    const requestPayload: ContactRequestPayload = {
      ...formState,
      website: honeypot,
      elapsedMs: Date.now() - formStartedAt
    };

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const responsePayload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (response.ok) {
        setFormState(getInitialFormState(typeof window !== 'undefined' ? window.location.search : ''));
        setHoneypot('');
        setFormStartedAt(Date.now());
        setStatusMessage(responsePayload?.message ?? 'Message sent successfully.');
        return;
      }

      setStatusMessage(
        responsePayload?.message ?? 'The form could not be sent. Please try again later.'
      );
      return;
    } catch {
      setStatusMessage(
        'The contact endpoint is not available right now. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box minH="dvh" bg="bg">
      <Link
        href="#content"
        position="absolute"
        left="4"
        top="4"
        px="3"
        py="2"
        rounded="sm"
        borderWidth="1px"
        borderColor="border"
        bg="bg"
        color="fg"
        transform="translateY(-200%)"
        _focusVisible={{ transform: 'translateY(0)', outline: 'none' }}
      >
        Skip to content
      </Link>

      <Container maxW="7xl" py={{ base: '10', md: '14' }}>
        <Grid
          templateColumns={{ base: '1fr', lg: '240px minmax(0, 1fr)' }}
          gap={{ base: '10', lg: '16' }}
        >
          <Box as="aside" position={{ lg: 'sticky' }} top={{ lg: '8' }} alignSelf="start">
            <Stack gap="8">
              <Stack gap="4">
                <HStack gap="2" wrap="wrap">
                  {socialLinks.map((link) => {
                    const icon = <link.icon />;

                    if (link.href) {
                      return (
                        <IconButton
                          key={link.label}
                          asChild
                          aria-label={link.label}
                          variant="outline"
                          rounded="sm"
                          size="sm"
                          color="fg.muted"
                          borderColor="border"
                          _hover={{ color: 'fg', bg: 'bg.subtle' }}
                        >
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                          >
                            {icon}
                          </a>
                        </IconButton>
                      );
                    }

                    return (
                      <IconButton
                        key={link.label}
                        aria-label={`${link.label} profile not configured`}
                        variant="outline"
                        rounded="sm"
                        size="sm"
                        color="fg.subtle"
                        borderColor="border"
                        disabled
                      >
                        {icon}
                      </IconButton>
                    );
                  })}
                </HStack>

                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl' }}
                  lineHeight="1.05"
                  letterSpacing="tight"
                  color="fg"
                >
                  Tobias Winkler
                </Heading>
                <Text fontSize="md" lineHeight="tall" color="fg.muted">
                  Engineering Manager at Omio. AI-native teams, frontend systems, product work.
                </Text>
                <Stack gap="1">
                  <Text fontSize="sm" color="fg.subtle">
                    Based in Berlin
                  </Text>
                  <Text fontSize="sm" color="fg.subtle">
                    Engineering Manager at Omio
                  </Text>
                  <Text fontSize="sm" color="fg.subtle">
                    Rebuilding teams toward AI-native, self-unblocking execution
                  </Text>
                </Stack>
              </Stack>

              <HStack gap="3" wrap="wrap">
                <Button asChild colorPalette="blue" rounded="sm" size="sm">
                  <a href="#contact">Get in touch</a>
                </Button>
              </HStack>

              <Separator borderColor="border" />

              <Stack as="nav" gap="2" aria-label="Page sections">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    color="fg.muted"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ color: 'fg', textDecoration: 'none' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Stack as="main" id="content" gap="16">
            <Stack as="section" id="overview" gap="8">
              <Grid templateColumns={{ base: '1fr', md: 'minmax(0, 1.3fr) 320px' }} gap="8" alignItems="start">
                <Stack gap="4" maxW="4xl">
                  <Heading
                    fontSize={{ base: '4xl', md: '5xl' }}
                    lineHeight={{ base: '1.05', md: '1' }}
                    letterSpacing="tight"
                    color="fg"
                    maxW="4xl"
                  >
                    Engineering leadership, frontend systems, and AI-native execution.
                  </Heading>
                  <Text fontSize={{ base: 'lg', md: 'xl' }} lineHeight="tall" color="fg.muted" maxW="3xl">
                    My background sits between hands-on frontend implementation and engineering
                    leadership. I care about product quality, readable systems, and teams that can
                    move without waiting on unnecessary process.
                  </Text>
                  <Text fontSize="md" lineHeight="tall" color="fg.muted" maxW="3xl">
                    Right now a major part of my work is shifting teams from the previous way of
                    operating into AI-native practice: fully enabled engineers, faster feedback
                    loops, and a culture where people can self-unblock instead of queueing for help.
                  </Text>
                </Stack>

                <Box
                  as="figure"
                  m="0"
                  w="full"
                  maxW={{ base: 'xs', md: 'none' }}
                  justifySelf={{ base: 'start', md: 'stretch' }}
                  rounded="sm"
                >
                  <Box
                    p={{ base: '4', md: '5' }}
                    bg="#f4ead8"
                    borderWidth="1px"
                    borderColor="#d9c7ab"
                    boxShadow="0 10px 30px rgba(15, 23, 42, 0.08), inset 0 0 24px rgba(131, 103, 68, 0.08)"
                  >
                    <Box
                      borderWidth="1px"
                      borderColor="#c8b08b"
                      bg="#1f1a17"
                      p="2"
                      boxShadow="0 6px 18px rgba(28, 18, 12, 0.18)"
                    >
                      <Box aspectRatio="4 / 5" overflow="hidden" bg="#1f1a17">
                        <Image
                          src={profileImageUrl}
                          alt="Portrait of Tobias Winkler"
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                {highlights.map((item) => (
                  <Stack
                    key={item.label}
                    gap="2"
                    pt="4"
                    borderTopWidth="1px"
                    borderTopColor="border"
                  >
                    <Heading fontSize="2xl" lineHeight="1" color="fg">
                      {item.value}
                    </Heading>
                    <Text fontSize="sm" lineHeight="tall" color="fg.muted">
                      {item.label}
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>

            <Separator borderColor="border" />

            <Stack as="section" id="focus" gap="8">
              <SectionHeading
                title="Clean, concise, and easier to scan."
                description="This version stays closer to Chakra's own demo and docs pages: semantic tokens, restrained composition, and much less emphasis on framed surfaces."
              />

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                {focusAreas.map((area) => (
                  <Stack
                    key={area.title}
                    gap="2"
                    pt="4"
                    borderTopWidth="1px"
                    borderTopColor="border"
                  >
                    <Heading fontSize="lg" color="fg">
                      {area.title}
                    </Heading>
                    <Text fontSize="sm" lineHeight="tall" color="fg.muted">
                      {area.description}
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>

            <Separator borderColor="border" />

            <Stack as="section" id="experience" gap="8">
              <SectionHeading
                title="Recent roles and professional context."
                description="The experience section is intentionally compressed. It gives enough detail to understand the trajectory without turning the homepage into a full CV dump."
              />

              <Timeline.Root
                size="lg"
                variant="plain"
                colorPalette="blue"
                gap="0"
                showLastSeparator={false}
              >
                {experiences.map((experience) => (
                  <Timeline.Item key={experience.company}>
                    <Timeline.Connector>
                      <Timeline.Separator bg="border" />
                      <Timeline.Indicator
                        mt="1"
                        bg="blue.solid"
                        color="white"
                        borderWidth="0"
                      />
                    </Timeline.Connector>

                    <Timeline.Content pb="8">
                      <Stack gap="2" pt="0.5">
                        <Timeline.Title asChild>
                          <Heading fontSize="lg" color="fg">
                            {experience.company}
                          </Heading>
                        </Timeline.Title>
                        <Timeline.Description asChild>
                          <Text fontSize="sm" color="fg.subtle">
                            {experience.meta}
                          </Text>
                        </Timeline.Description>
                        <Stack gap="1.5" pt="1">
                          {experience.roles.map((role) => (
                            <Text key={role} fontSize="sm" lineHeight="tall" color="fg.muted">
                              {role}
                            </Text>
                          ))}
                        </Stack>
                      </Stack>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline.Root>
            </Stack>

            <Separator borderColor="border" />

            <Stack as="section" id="projects" gap="8">
              <SectionHeading
                title="Selected work and current threads."
                description="A concise project layer that can later expand into deeper case studies without changing the structure of the page."
              />

              <Stack gap="0" separator={<Separator borderColor="border.muted" />}>
                {projects.map((project) => (
                  <Grid
                    key={project.name}
                    templateColumns={{ base: '1fr', md: '220px minmax(0, 1fr)' }}
                    gap="5"
                    py="5"
                  >
                    <Stack gap="1">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color="fg.subtle"
                      >
                        {project.category}
                      </Text>
                      {project.href ? (
                        <Heading fontSize="lg" color="fg">
                          <Link
                            href={project.href}
                            target="_blank"
                            rel="noreferrer"
                            display="inline-flex"
                            alignItems="center"
                            gap="1.5"
                            color="blue.fg"
                            fontWeight="semibold"
                            textDecoration="underline"
                            textDecorationColor="blue.subtle"
                            textUnderlineOffset="0.16em"
                            _hover={{ color: 'blue.emphasized', textDecorationColor: 'blue.muted' }}
                          >
                            {project.name}
                            <Icon as={LuArrowUpRight} boxSize="4" aria-hidden="true" />
                          </Link>
                        </Heading>
                      ) : (
                        <Heading fontSize="lg" color="fg">
                          {project.name}
                        </Heading>
                      )}
                    </Stack>
                    <Text fontSize="sm" lineHeight="tall" color="fg.muted">
                      {project.summary}
                    </Text>
                  </Grid>
                ))}
              </Stack>
            </Stack>

            <Separator borderColor="border" />

            <Grid
              as="section"
              id="contact"
              templateColumns={{ base: '1fr', md: '0.8fr 1.2fr' }}
              gap="8"
            >
              <Stack gap="6">
                <SectionHeading
                  title="Use the form to start a conversation."
                  description="The site does not publish a direct email address. Messages go through the contact form and the server-side endpoint behind it."
                />

                <Stack gap="4">
                  <Stack gap="1">
                    <Text fontSize="sm" fontWeight="medium" color="fg">
                      Preferred topics
                    </Text>
                    <Text fontSize="sm" lineHeight="tall" color="fg.muted">
                      AI-native team transformation, engineering leadership, frontend architecture,
                      consulting, and product ideas that need a clear execution path.
                    </Text>
                  </Stack>
                </Stack>
              </Stack>

              <Box
                as="form"
                onSubmit={handleSubmit}
                borderWidth="1px"
                borderColor="border"
                rounded="l2"
                bg="bg.subtle"
                px={{ base: '5', md: '6' }}
                py={{ base: '5', md: '6' }}
              >
                <Stack gap="4">
                  <Input
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    position="absolute"
                    left="-10000px"
                    top="auto"
                    w="1px"
                    h="1px"
                    opacity="0"
                    pointerEvents="none"
                  />

                  <Field.Root required>
                    <Field.Label>
                      Topic
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={formState.topic}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, topic: event.target.value }))
                        }
                        bg="bg"
                        borderColor="border"
                        rounded="sm"
                      >
                        {contactTopics.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
                    <Field.Root required>
                      <Field.Label>
                        Name
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={formState.name}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, name: event.target.value }))
                        }
                        bg="bg"
                        borderColor="border"
                        rounded="sm"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>
                        Email
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="email"
                        value={formState.email}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, email: event.target.value }))
                        }
                        bg="bg"
                        borderColor="border"
                        rounded="sm"
                      />
                    </Field.Root>
                  </Grid>

                  <Field.Root>
                    <Field.Label>Company</Field.Label>
                    <Input
                      value={formState.company}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, company: event.target.value }))
                      }
                      bg="bg"
                      borderColor="border"
                      rounded="sm"
                    />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Message
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Textarea
                      minH="180px"
                      value={formState.message}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, message: event.target.value }))
                      }
                      bg="bg"
                      borderColor="border"
                      rounded="sm"
                    />
                    <Field.HelperText color="fg.subtle">
                      Messages are sent through the server-side contact endpoint, which also uses
                      basic spam protection.
                    </Field.HelperText>
                  </Field.Root>

                  <HStack justify="start" align="start" wrap="wrap" gap="3">
                    <Button type="submit" colorPalette="blue" rounded="sm" loading={isSubmitting}>
                      Send message
                    </Button>
                  </HStack>

                  {statusMessage ? (
                    <Box
                      borderWidth="1px"
                      borderColor="border"
                      rounded="sm"
                      bg="bg"
                      px="4"
                      py="3"
                    >
                      <Text fontSize="sm" color="fg.muted">
                        {statusMessage}
                      </Text>
                    </Box>
                  ) : null}
                </Stack>
              </Box>
            </Grid>

            <Separator borderColor="border" />

            <Stack as="section" id="imprint" gap="4" pb={{ base: '4', md: '6' }}>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} lineHeight="1.1" letterSpacing="tight" color="fg">
                Impressum
              </Heading>
              <Text fontSize="sm" lineHeight="tall" color="fg.muted" maxW="3xl">
                Angaben gemäß § 5 TMG
              </Text>
              <Grid
                templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
                gap="3"
                maxW="3xl"
                fontSize="sm"
                lineHeight="tall"
                color="fg.muted"
              >
                <Text color="fg">Name</Text>
                <Text>Tobias Winkler</Text>

                <Text color="fg">Address</Text>
                <Text>Zeuschelstraße 97, 13127 Berlin</Text>

                <Text color="fg">Phone</Text>
                <Link href="tel:+491635460791" color="blue.fg">
                  +49 163 5460791
                </Link>

                <Text color="fg">Contact</Text>
                <Link href="#contact" color="blue.fg">
                  Use the contact form on this website
                </Link>
              </Grid>

              <Box maxW="3xl" pt="2">
                <Text fontSize="sm" fontWeight="medium" color="fg">
                  Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
                </Text>
                <Text fontSize="sm" lineHeight="tall" color="fg.muted">
                  Tobias Winkler, Zeuschelstraße 97, 13127 Berlin
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
