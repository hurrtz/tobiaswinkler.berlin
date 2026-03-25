import { type FormEvent, useMemo, useState } from 'react';
import { profile, topicOptions } from '../data/content';

type FormState = {
  topic: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: FormState = {
  topic: topicOptions[0],
  name: '',
  email: '',
  phone: '',
  message: ''
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const mailtoLink = useMemo(() => {
    const subject = `${formState.topic} request from ${formState.name}`.trim();
    const lines = [
      `Topic: ${formState.topic}`,
      `Name: ${formState.name}`,
      `Email: ${formState.email}`,
      `Phone: ${formState.phone || 'Not provided'}`,
      '',
      formState.message
    ];
    const params = new URLSearchParams({
      subject,
      body: lines.join('\n')
    });

    return `mailto:${profile.contactEmail}?${params.toString()}`;
  }, [formState]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          `Topic: ${formState.topic}\nName: ${formState.name}\nEmail: ${formState.email}\nPhone: ${
            formState.phone || 'Not provided'
          }\n\n${formState.message}`
        );
      }
    } catch {
      // Clipboard support is optional here; the mail draft still opens.
    }

    setStatusMessage('Draft prepared. Your message was also copied to the clipboard when allowed.');
    window.location.assign(mailtoLink);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Topic</span>
        <select
          value={formState.topic}
          onChange={(event) =>
            setFormState((current) => ({ ...current, topic: event.target.value }))
          }
        >
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <div className="field-grid">
        <label>
          <span>Name</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={formState.email}
            onChange={(event) =>
              setFormState((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>
      </div>

      <label>
        <span>Phone number</span>
        <input
          type="tel"
          autoComplete="tel"
          value={formState.phone}
          onChange={(event) =>
            setFormState((current) => ({ ...current, phone: event.target.value }))
          }
        />
      </label>

      <label>
        <span>What do you want to talk about?</span>
        <textarea
          rows={7}
          required
          value={formState.message}
          onChange={(event) =>
            setFormState((current) => ({ ...current, message: event.target.value }))
          }
        />
      </label>

      <div className="form-actions">
        <button type="submit">Open draft email</button>
        <p>
          Recipient:
          {' '}
          <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
        </p>
      </div>

      {statusMessage ? <p className="form-status">{statusMessage}</p> : null}
    </form>
  );
}
