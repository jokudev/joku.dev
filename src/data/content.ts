export const CONTENT = {
  user: {
    name: 'Joshua Kunz',
    host: 'joku-dev',
    role: 'Informatiker EFZ Applikationsentwicklung',
    location: 'Basel, CH',
    birth: '2007',
    email: 'contact@joshuakunz.com',
    github: 'https://github.com/jokudev',
    lehrStart: '2022-08-01',
  },

  about: {
    bio: 'Ich bin Joshua Kunz, 2007 in Basel geboren, und habe die Lehre als Informatiker EFZ Applikationsentwicklung bei Swiss Aviation Software Ltd. erfolgreich abgeschlossen (EFZ im Rang, Note 5.7) sowie die Technische Berufsmaturität mit Note 4.9 absolviert. Ich arbeite praxisnah an Java- und Backend-Themen, baue im Homelab Cloud-native Infrastruktur mit Linux, Kubernetes, Docker, Terraform und Ansible auf und vertiefe mich kontinuierlich in DevOps, Betrieb und Systemdesign.',
    languages: ['Deutsch — Muttersprache', 'Englisch — C1'],
    interests: ['Musik', 'Kochen', 'Gaming', 'Lesen', 'Technologie', 'Reisen'],
  },

  stack: {
    professional: {
      languages: ['Java'],
      databases: ['PostgreSQL', 'HyperSQL'],
      tools: ['Maven', 'GitLab', 'SonarQube', 'IntelliJ IDEA'],
    },
    homelab: {
      cloudInfra: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      cicd: ['Git', 'GitLab CI', 'Ansible', 'Semaphore'],
      systems: ['Linux', 'Proxmox', 'Talos'],
    },
  },

  education: [
    {
      period: '2022 – 2026',
      title: 'Lehre Informatiker EFZ – Applikationsentwicklung',
      org: 'Swiss Aviation Software Ltd.',
      location: 'Allschwil',
      result: 'Abgeschlossen im Rang — Note 5.7',
    },
    {
      period: '2022 – 2026',
      title: 'Technische Berufsmaturität',
      org: 'Berufsbildungszentrum Baselland',
      location: '',
      result: 'Abgeschlossen — Note 4.9',
    },
    {
      period: '2019 – 2022',
      title: 'Sekundarschule Niveau E',
      org: 'Sekundarschule Sissach',
      location: '',
    },
  ],

  competitions: [
    { year: '2025', event: 'Regionalmeisterschaften', result: '1. Platz' },
    { year: '2025', event: 'Nationalmeisterschaften', result: '4. Platz' },
    { year: '2026', event: 'Regionalmeisterschaften', result: '8. Platz' },
    { year: '2027', event: 'Nationalmeisterschaften', result: 'qualifiziert' },
  ],

  projects: [
    {
      slug: 'homelab',
      title: 'Linux-basierte Infrastruktur & Homelab',
      description: 'Pseudo-produktive Infrastruktur zu Hause mit Docker, Kubernetes und IaC.',
      tags: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'Ansible'],
      bullets: [
        'Aufbau und Betrieb einer pseudo-produktiven Infrastruktur mit Docker, Kubernetes und mehreren selbst gehosteten Diensten',
        'Infrastruktur-as-Code mit Terraform und Ansible für automatisierte Deployments',
        'Netzwerk-Segmentierung, TLS/PKI, Reverse Proxies und Least-Privilege-Zugriffe',
        'Monitoring & Alerting für Stabilität und Performance',
      ],
      repo: null,
      live: null,
    },
    {
      slug: 'swiss-aviation-software',
      title: 'Berufliche Applikationsentwicklung',
      description:
        'Praxisnahe Java- und Backend-Aufgaben bei Swiss Aviation Software Ltd.',
      tags: ['Java', 'Applikationsentwicklung'],
      bullets: [
        'Mitarbeit an produktionsnahen Applikationsmodulen und strukturierten Entwicklungsprozessen.',
      ],
      repo: null,
      live: null,
    },
    {
      slug: 'joshuakunz-com',
      title: 'joshuakunz.com',
      description: 'Persönliche Portfolio-Website mit Fokus auf Klarheit, Performance und präziser Darstellung.',
      tags: ['TypeScript', 'Frontend', 'Design System', 'SEO'],
      bullets: [
        'Konzeption und Umsetzung der persönlichen Webpräsenz inklusive Projekt-, Skill- und Kontaktstruktur',
        'Schnelle Ladezeiten, klare Informationsarchitektur und responsive Darstellung',
      ],
      repo: 'https://github.com/jokudev/joshuakunz.com',
      live: 'https://joshuakunz.com',
    },
    {
      slug: 'joku-dev-terminal',
      title: 'joku.dev — Interactive Terminal Portfolio',
      description: 'Terminal-native Portfolio als interaktive Shell-Session inklusive virtueller Filestruktur und Commands.',
      tags: ['Vite', 'TypeScript', 'Tailwind', 'Terminal UX'],
      bullets: [
        'Reale Command-Interaktion mit History, Tab-Completion, Path-Navigation und Easter Eggs',
        'Abbildung der Portfolio-Inhalte als dateibasierte Shell-Erfahrung statt klassischer Seite',
      ],
      repo: 'https://github.com/jokudev/joku.dev',
      live: 'https://joku.dev',
    },
  ],
} as const;

export type Content = typeof CONTENT;
