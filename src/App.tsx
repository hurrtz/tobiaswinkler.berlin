import { type FormEvent, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Field,
  Grid,
  Heading,
  HStack,
  Input,
  Link,
  NativeSelect,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react';

type ContactFormState = {
  topic: string;
  name: string;
  email: string;
  company: string;
  message: string;
};

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL ?? 'info@tobiaswinkler.berlin';

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
  { value: 'Hands-on', label: 'Engineering leadership that stays close to the product' }
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
      'Planning, feedback, prioritization, and technical judgment that keep delivery moving.'
  },
  {
    title: 'Clean execution',
    description:
      'Fewer decorative decisions, better defaults, and a stronger emphasis on clarity.'
  }
] as const;

const experiences = [
  {
    company: 'Omio',
    meta: 'Full-time · Berlin, Germany · Hybrid',
    roles: [
      'Engineering Manager · Oct 2023–Today',
      'Senior Frontend Developer · Jan 2021–Apr 2024'
    ]
  },
  {
    company: 'Tobias Winkler',
    meta: 'Freelance',
    roles: ['Webentwickler · Feb 2018–Dec 2022']
  },
  {
    company: 'SPRING Axel Springer Digital News Media GmbH & Co. KG',
    meta: 'Full-time · Berlin, Germany',
    roles: ['Software Engineer · Feb 2020–Dec 2020']
  },
  {
    company: 'Aklamio',
    meta: 'Full-time',
    roles: ['Senior Frontend Developer · Sep 2019–Feb 2020']
  }
] as const;

const projects = [
  {
    name: 'SchnackAI app',
    category: 'Independent product',
    summary:
      'A smaller, conversation-driven product direction focused on compact workflows and direct utility.'
  },
  {
    name: 'Rasseportrait',
    category: 'Editorial concept',
    summary:
      'A content-led idea with an emphasis on structure, readability, and a less generic interface.'
  },
  {
    name: 'Freelance delivery',
    category: 'Client work',
    summary:
      'Pragmatic product and frontend delivery across agency and independent contexts.'
  }
] as const;

const profileLinks = [
  { label: 'Email', href: `mailto:${contactEmail}` },
  { label: 'GitHub', href: 'https://github.com/hurrtz' },
  { label: 'LinkedIn', href: undefined }
] as const;

const contactTopics = [
  'Engineering leadership',
  'Frontend architecture',
  'Consulting',
  'New product idea'
] as const;

const initialFormState: ContactFormState = {
  topic: contactTopics[0],
  name: '',
  email: '',
  company: '',
  message: ''
};

function buildMailtoLink(formState: ContactFormState) {
  const subject = `${formState.topic} inquiry from ${formState.name}`.trim();
  const body = [
    `Topic: ${formState.topic}`,
    `Name: ${formState.name}`,
    `Email: ${formState.email}`,
    `Company: ${formState.company || 'Not provided'}`,
    '',
    formState.message
  ].join('\n');

  const params = new URLSearchParams({ subject, body });
  return `mailto:${contactEmail}?${params.toString()}`;
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Stack gap="3" maxW="3xl">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="0.12em"
        textTransform="uppercase"
        color="gray.500"
      >
        {eyebrow}
      </Text>
      <Heading
        as="h2"
        fontSize={{ base: '2xl', md: '3xl' }}
        lineHeight="1.1"
        letterSpacing="tight"
        color="gray.900"
      >
        {title}
      </Heading>
      <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall" color="gray.600">
        {description}
      </Text>
    </Stack>
  );
}

function App() {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLDivElement>) {
    event.preventDefault();

    const draftBody = [
      `Topic: ${formState.topic}`,
      `Name: ${formState.name}`,
      `Email: ${formState.email}`,
      `Company: ${formState.company || 'Not provided'}`,
      '',
      formState.message
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(draftBody);
      }
    } catch {
      // Clipboard support is optional. Opening the draft is the primary action.
    }

    setStatusMessage(
      'Draft prepared. The message was also copied to the clipboard when the browser allowed it.'
    );
    window.location.assign(buildMailtoLink(formState));
  }

  return (
    <Box minH="dvh" bg="gray.50">
      <Container maxW="7xl" py={{ base: '10', md: '14' }}>
        <Grid templateColumns={{ base: '1fr', lg: '280px minmax(0, 1fr)' }} gap={{ base: '10', lg: '14' }}>
          <Box as="aside" position={{ lg: 'sticky' }} top={{ lg: '8' }} alignSelf="start">
            <Stack gap="8">
              <Stack gap="4">
                <Badge
                  alignSelf="start"
                  colorPalette="gray"
                  variant="subtle"
                  rounded="sm"
                  px="2.5"
                  py="1"
                >
                  Tobias Winkler
                </Badge>
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl' }}
                  lineHeight="1.05"
                  letterSpacing="tight"
                  color="gray.900"
                >
                  Engineering manager and frontend specialist in Berlin.
                </Heading>
                <Text fontSize="md" lineHeight="tall" color="gray.600">
                  Clean product work, technical leadership, and frontend systems that stay
                  understandable after launch.
                </Text>
                <HStack wrap="wrap" gap="2">
                  <Badge rounded="sm" colorPalette="blue" variant="subtle">
                    Berlin
                  </Badge>
                  <Badge rounded="sm" colorPalette="gray" variant="subtle">
                    Omio
                  </Badge>
                  <Badge rounded="sm" colorPalette="gray" variant="subtle">
                    Frontend
                  </Badge>
                </HStack>
              </Stack>

              <HStack gap="3" wrap="wrap">
                <Button asChild colorPalette="blue" rounded="sm" size="sm">
                  <a href="#contact">Get in touch</a>
                </Button>
                <Button asChild variant="outline" rounded="sm" size="sm">
                  <a href={`mailto:${contactEmail}`}>Email directly</a>
                </Button>
              </HStack>

              <Separator borderColor="gray.200" />

              <Stack as="nav" gap="2" aria-label="Page sections">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    color="gray.600"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ color: 'gray.900', textDecoration: 'none' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>

              <Separator borderColor="gray.200" />

              <Stack gap="3">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  color="gray.500"
                >
                  Links
                </Text>
                {profileLinks.map((link) =>
                  link.href ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      color="gray.700"
                      fontSize="sm"
                      _hover={{ color: 'blue.700' }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Text key={link.label} fontSize="sm" color="gray.500">
                      {link.label} pending
                    </Text>
                  )
                )}
              </Stack>
            </Stack>
          </Box>

          <Stack as="main" gap="12">
            <Stack as="section" id="overview" gap="8">
              <Stack gap="4" maxW="4xl">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  color="gray.500"
                >
                  Overview
                </Text>
                <Heading
                  fontSize={{ base: '4xl', md: '5xl' }}
                  lineHeight={{ base: '1.05', md: '1' }}
                  letterSpacing="tight"
                  color="gray.900"
                  maxW="4xl"
                >
                  A cleaner personal page, rebuilt around clarity instead of decoration.
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} lineHeight="tall" color="gray.600" maxW="3xl">
                  My background sits between hands-on frontend implementation and engineering
                  leadership. I care about product quality, readable systems, and interfaces that
                  do not need visual noise to feel intentional.
                </Text>
              </Stack>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
                {highlights.map((item) => (
                  <Card.Root
                    key={item.label}
                    rounded="sm"
                    shadow="none"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                  >
                    <Card.Body gap="2" p="5">
                      <Heading fontSize="2xl" lineHeight="1" color="gray.900">
                        {item.value}
                      </Heading>
                      <Text fontSize="sm" lineHeight="tall" color="gray.600">
                        {item.label}
                      </Text>
                    </Card.Body>
                  </Card.Root>
                ))}
              </SimpleGrid>
            </Stack>

            <Separator borderColor="gray.200" />

            <Stack as="section" id="focus" gap="8">
              <SectionHeading
                eyebrow="Focus"
                title="Clean, concise, and easier to scan."
                description="This reimplementation stays close to Chakra defaults: neutral colours, modest borders, compact radii, and layout decisions driven by content rather than effects."
              />

              <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
                {focusAreas.map((area) => (
                  <Card.Root
                    key={area.title}
                    rounded="sm"
                    shadow="none"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                  >
                    <Card.Body gap="3" p="5">
                      <Heading fontSize="lg" color="gray.900">
                        {area.title}
                      </Heading>
                      <Text fontSize="sm" lineHeight="tall" color="gray.600">
                        {area.description}
                      </Text>
                    </Card.Body>
                  </Card.Root>
                ))}
              </SimpleGrid>
            </Stack>

            <Separator borderColor="gray.200" />

            <Stack as="section" id="experience" gap="8">
              <SectionHeading
                eyebrow="Experience"
                title="Recent roles and professional context."
                description="The experience section is intentionally compressed. It gives enough detail to understand the trajectory without turning the homepage into a full CV dump."
              />

              <Stack gap="4">
                {experiences.map((experience) => (
                  <Card.Root
                    key={experience.company}
                    rounded="sm"
                    shadow="none"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                  >
                    <Card.Body gap="4" p="5">
                      <Stack gap="1">
                        <Heading fontSize="lg" color="gray.900">
                          {experience.company}
                        </Heading>
                        <Text fontSize="sm" color="gray.500">
                          {experience.meta}
                        </Text>
                      </Stack>

                      <Stack gap="2">
                        {experience.roles.map((role) => (
                          <Text key={role} fontSize="sm" color="gray.700">
                            {role}
                          </Text>
                        ))}
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Stack>
            </Stack>

            <Separator borderColor="gray.200" />

            <Stack as="section" id="projects" gap="8">
              <SectionHeading
                eyebrow="Projects"
                title="Selected work and current threads."
                description="A concise project layer that can later expand into deeper case studies without changing the structure of the page."
              />

              <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                {projects.map((project) => (
                  <Card.Root
                    key={project.name}
                    rounded="sm"
                    shadow="none"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                  >
                    <Card.Body gap="3" p="5">
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color="gray.500"
                      >
                        {project.category}
                      </Text>
                      <Heading fontSize="lg" color="gray.900">
                        {project.name}
                      </Heading>
                      <Text fontSize="sm" lineHeight="tall" color="gray.600">
                        {project.summary}
                      </Text>
                    </Card.Body>
                  </Card.Root>
                ))}
              </SimpleGrid>
            </Stack>

            <Separator borderColor="gray.200" />

            <Grid as="section" id="contact" templateColumns={{ base: '1fr', md: '0.9fr 1.1fr' }} gap="6">
              <Stack gap="6">
                <SectionHeading
                  eyebrow="Contact"
                  title="Use the form, or just send a direct email."
                  description="The form stays frontend-only and opens a prefilled draft in the default mail app. It is simple, durable, and easy to replace later with a real backend."
                />

                <Card.Root rounded="sm" shadow="none" borderWidth="1px" borderColor="gray.200" bg="white">
                  <Card.Body gap="3" p="5">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                      Preferred topics
                    </Text>
                    <Text fontSize="sm" lineHeight="tall" color="gray.600">
                      Engineering leadership, frontend architecture, consulting, and product ideas
                      that need a clear execution path.
                    </Text>
                    <Link href={`mailto:${contactEmail}`} color="blue.700" fontSize="sm">
                      {contactEmail}
                    </Link>
                  </Card.Body>
                </Card.Root>
              </Stack>

              <Card.Root rounded="sm" shadow="none" borderWidth="1px" borderColor="gray.200" bg="white">
                <Card.Body as="form" gap="4" p="6" onSubmit={handleSubmit}>
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
                        bg="white"
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
                        bg="white"
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
                      bg="white"
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
                      bg="white"
                      rounded="sm"
                    />
                    <Field.HelperText color="gray.500">
                      Submitting opens a draft email and copies the message when the browser allows
                      it.
                    </Field.HelperText>
                  </Field.Root>

                  <HStack justify="space-between" align="start" wrap="wrap" gap="3">
                    <Button type="submit" colorPalette="blue" rounded="sm">
                      Open draft email
                    </Button>
                    <Text fontSize="sm" color="gray.500">
                      Recipient: {contactEmail}
                    </Text>
                  </HStack>

                  {statusMessage ? (
                    <Box borderWidth="1px" borderColor="gray.200" rounded="sm" bg="gray.50" px="4" py="3">
                      <Text fontSize="sm" color="gray.600">
                        {statusMessage}
                      </Text>
                    </Box>
                  ) : null}
                </Card.Body>
              </Card.Root>
            </Grid>

            <Separator borderColor="gray.200" />

            <Stack as="section" id="imprint" gap="4" pb={{ base: '4', md: '6' }}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="0.12em"
                textTransform="uppercase"
                color="gray.500"
              >
                Imprint
              </Text>
              <Text fontSize="sm" lineHeight="tall" color="gray.600" maxW="3xl">
                Tobias Winkler, Berlin, Germany. The full postal address should still be added
                before publishing. For now, the contact route is{' '}
                <Link href={`mailto:${contactEmail}`} color="blue.700">
                  {contactEmail}
                </Link>
                .
              </Text>
            </Stack>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
