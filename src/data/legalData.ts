export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  owner: string;
  contactEmail: string;
  contactPhone?: string;
  website: string;
  address?: string;
  sections: LegalSection[];
  contactInfo?: {
    app: string;
    owner: string;
    email: string;
    phone?: string;
    address: string;
  };
}

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "UPMI — TERMS OF SERVICE",
  effectiveDate: "November 2, 2026",
  lastUpdated: "November 2, 2026",
  owner: "UPMI",
  contactEmail: "contact@upmii.in",
  contactPhone: "9585716229 & 8056983309",
  website: "https://stgesports.in/",
  address: "3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102",
  sections: [
    {
      title: "1. Introduction",
      content:
        "Welcome to Upmi (“App,” “we,” “our,” or “us”). Upmi is an esports community platform designed to help gaming players, teams, tournament organizers, managers, coaches, analysts, editors, commentators, streamers, and esports organizations connect and collaborate.\n\nBy accessing or using Upmi, you agree to these Terms of Service. If you do not agree, please do not use the App.\n\n• App Owner: UPMI\n• Contact Email: contact@upmii.in\n• Contact Number: 9585716229 & 8056983309\n• Address: 3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102\n• Website: https://stgesports.in/"
    },
    {
      title: "2. Eligibility and Accounts",
      content:
        "• You must provide accurate and up-to-date information when creating an account.\n• You are responsible for maintaining the confidentiality of your login credentials.\n• You must notify us if you suspect unauthorized access to your account.\n• You may not impersonate another person, create fraudulent accounts, or misrepresent your esports experience or organization.\n• Users under the age of 18 must have the permission and supervision of a parent or legal guardian where required by applicable law.\n\nWe reserve the right to suspend or restrict accounts that violate these Terms or applicable laws."
    },
    {
      title: "3. App Features",
      content:
        "Depending on availability, Upmi may provide:\n\n• Player, team, and organization discovery.\n• Tournament creation, registration, and participation.\n• Tournament standings, points tables, and match-related information.\n• Profiles for players and esports professionals.\n• Discovery of coaches, managers, analysts, editors, commentators, streamers, and production teams.\n• Communication and community features.\n• Esports-related promotional content and services.\n\nFeatures may change, be temporarily unavailable, or be discontinued."
    },
    {
      title: "4. User Responsibilities",
      content:
        "You agree not to:\n\n• Post false, misleading, abusive, threatening, discriminatory, or unlawful content.\n• Cheat, manipulate tournament results, falsify scores, or engage in match-fixing.\n• Use bots, exploits, or unauthorized methods to access or disrupt the App.\n• Harass, threaten, impersonate, or defraud other users.\n• Share another person's private information without authorization.\n• Upload malware or content that infringes intellectual property rights.\n• Use the platform to organize illegal activities or violate applicable game rules.\n\nYou are responsible for the content and information you submit."
    },
    {
      title: "5. Tournaments and Competitions",
      content:
        "Tournament organizers are responsible for clearly communicating tournament rules, eligibility, schedules, scoring systems, prizes, registration requirements, and cancellation policies.\n\nParticipants must comply with the published rules of each tournament.\n\nUnless expressly stated otherwise, Upmi does not guarantee tournament admission, a particular result, prize availability, or the conduct of independent organizers and participants.\n\nWhere a tournament involves entry fees or prizes, the applicable event-specific terms must be disclosed clearly and must comply with applicable laws. No user should assume that a tournament is officially sponsored or endorsed by a game publisher unless that endorsement is expressly confirmed."
    },
    {
      title: "6. User Content and Profiles",
      content:
        "You retain ownership of content you create, subject to any rights you have granted to others.\n\nBy submitting content to Upmi, you grant us a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, and distribute that content as reasonably necessary to operate, maintain, and promote the App and its features, subject to applicable law and your privacy choices.\n\nYou confirm that you have the rights and permissions necessary to upload your content.\n\nWe may remove content that violates these Terms or applicable law."
    },
    {
      title: "7. Third-Party Services and Links",
      content:
        "Upmi may contain links to or integrations with third-party services, gaming platforms, social networks, payment providers, or streaming platforms.\n\nThose services operate under their own terms and privacy policies. We are not responsible for their independent practices or availability."
    },
    {
      title: "8. Intellectual Property and Trademarks",
      content:
        "The Upmi name, logo, interface, software, and original platform materials are owned by or licensed to the relevant rights holder.\n\nBGMI, PUBG, and other third-party names, logos, characters, and trademarks belong to their respective owners. Their appearance in the App does not imply official affiliation or endorsement unless expressly authorized.\n\nUsers must not copy, distribute, modify, or commercially exploit protected materials without appropriate permission."
    },
    {
      title: "9. Account Suspension and Termination",
      content:
        "We may suspend, restrict, or terminate an account where reasonably necessary to address violations of these Terms, protect users, prevent fraud, comply with legal obligations, or protect the security of the App.\n\nYou may request account deletion using the in-app account controls, where available, or by contacting contact@upmii.in. Account deletion and data retention will be handled in accordance with our Privacy Policy and applicable law."
    },
    {
      title: "10. Disclaimers",
      content:
        "Upmi is provided on an “as available” basis, subject to applicable law. We do not guarantee uninterrupted access, error-free operation, the accuracy of all user-submitted information, or the performance of third-party services.\n\nWe do not guarantee that players, teams, organizers, or service providers discovered through the App will meet a user's expectations."
    },
    {
      title: "11. Limitation of Liability",
      content:
        "To the extent permitted by applicable law, Upmi and its operator will not be liable for indirect, incidental, special, or consequential losses arising from use of the App.\n\nNothing in these Terms excludes or limits liability that cannot legally be excluded or limited, including any mandatory consumer rights or liability for fraud or willful misconduct where applicable."
    },
    {
      title: "12. Changes to These Terms",
      content:
        "We may update these Terms from time to time. We will publish the revised version with an updated date and provide additional notice where required by law.\n\nContinued use of the App after updated Terms take effect constitutes acceptance where such acceptance is legally valid."
    },
    {
      title: "13. Governing Law and Disputes",
      content:
        "These Terms are subject to the laws of India, without prejudice to any mandatory legal protections available to users.\n\nDisputes will be handled by the competent courts or other dispute-resolution bodies having jurisdiction under applicable law."
    },
    {
      title: "14. Contact Us",
      content:
        "For questions, complaints, or concerns regarding these Terms:\n\n• App: Upmi\n• Owner / Company: UPMI\n• Email: contact@upmii.in\n• Contact Number: 9585716229 & 8056983309\n• Address: 3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102"
    }
  ],
  contactInfo: {
    app: "Upmi",
    owner: "UPMI",
    email: "contact@upmii.in",
    phone: "9585716229 & 8056983309",
    address: "3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102"
  }
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "UPMI — PRIVACY POLICY",
  effectiveDate: "November 2, 2026",
  lastUpdated: "November 2, 2026",
  owner: "UPMI",
  contactEmail: "contact@upmii.in",
  contactPhone: "9585716229 & 8056983309",
  website: "https://stgesports.in/",
  address: "3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102",
  sections: [
    {
      title: "1. Introduction",
      content:
        "Upmi (“we,” “our,” or “us”) respects your privacy. This Privacy Policy explains how we collect, use, store, disclose, and protect information when you use the Upmi mobile application and related services.\n\nUpmi is an esports community platform that may support player profiles, teams, organizations, tournaments, registrations, professional services, and community interactions.\n\n• App Owner: UPMI\n• Privacy Contact: contact@upmii.in\n• Contact Number: 9585716229 & 8056983309\n• Address: 3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102\n• Website: https://stgesports.in/"
    },
    {
      title: "2. Information We May Collect",
      content:
        "The information collected depends on the features you use and the permissions you grant.\n\nA. Account Information:\n• Name or display name.\n• Email address and phone number, if requested.\n• Username and profile photograph.\n• Login credentials, stored using appropriate security measures.\n• Account type, role, and profile preferences.\n\nB. Esports Profile Information:\n• Gaming ID, in-game name, and player statistics you submit.\n• Team, organization, and professional role.\n• Skills, experience, portfolio, and availability.\n• Tournament history, registrations, scores, and rankings.\n• Profile descriptions, photographs, and other content you choose to publish.\n\nC. Tournament and Communication Information:\n• Tournament registrations and participation records.\n• Team membership and organization details.\n• Messages, reports, and support requests.\n• Content you submit through community or communication features.\n\nD. Technical Information:\nWe may collect limited technical information necessary to operate and secure the App, such as device type, operating system, app version, diagnostic logs, crash information, and security-related events. IP addresses, device identifiers, and analytics are collected only where applicable to the services actually used.\n\nE. Payment Information:\nIf paid services or tournament payments are supported, payment details may be processed by an authorized payment provider. Upmi does not collect or store sensitive payment card details directly."
    },
    {
      title: "3. How We Use Information",
      content:
        "We may use information, as applicable, to:\n\n• Create and manage user accounts.\n• Display profiles and help users discover players, teams, organizations, and esports professionals.\n• Process tournament registrations and maintain standings.\n• Enable communication and community features.\n• Provide customer support and respond to complaints.\n• Maintain platform security and prevent fraud, cheating, and abuse.\n• Diagnose technical problems and improve app performance.\n• Send essential account, security, or service notifications.\n• Meet legal and regulatory obligations.\n\nWe will not use personal information for purposes incompatible with applicable law or the notices and choices provided to users."
    },
    {
      title: "4. Legal Basis and Consent",
      content:
        "Where required by applicable law, we will obtain consent or rely on another lawful basis to process personal information.\n\nWhere processing is based on consent, you may withdraw consent through the available controls or by contacting us. Withdrawal does not affect processing lawfully performed before withdrawal."
    },
    {
      title: "5. Public Profiles and User-Generated Content",
      content:
        "Information that you choose to display publicly, such as your gaming name, team, organization, professional role, portfolio, or tournament results, may be visible to other users.\n\nOther users may copy or share information that is publicly accessible. Please avoid publishing personal information that you do not want others to see.\n\nWe provide controls for editing profile information and managing content visibility."
    },
    {
      title: "6. Sharing of Information",
      content:
        "We may share relevant information with:\n\n• Other users: To provide profiles, team discovery, tournament participation, and communication features.\n• Service providers: Hosting, database, security, customer support, and analytics providers that help operate the App.\n• Tournament organizers: Information reasonably necessary to administer registrations and competitions.\n• Legal authorities: Where required by law or a valid legal process, or where necessary to protect rights and safety.\n• Business successors: In connection with a merger, restructuring, or transfer of the service, subject to applicable legal requirements.\n\nWe do not sell personal information in exchange for money."
    },
    {
      title: "7. Data Retention",
      content:
        "We retain personal information only for as long as reasonably necessary for the purposes described in this Policy, including account operation, tournament records, security, dispute resolution, and legal compliance.\n\nWhen information is no longer required, we will delete it or anonymize it where appropriate, subject to lawful retention requirements and technical limitations."
    },
    {
      title: "8. Data Security",
      content:
        "We use reasonable technical and organizational safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.\n\nNo method of electronic storage or transmission is completely secure. We cannot guarantee absolute security, but we will address security incidents as required by applicable law."
    },
    {
      title: "9. Your Privacy Rights and Choices",
      content:
        "Subject to applicable law, you may be able to:\n\n• Access or correct personal information associated with your account.\n• Update your profile and privacy settings.\n• Request deletion of your account and associated personal information.\n• Withdraw consent where processing relies on consent.\n• Raise concerns or submit a privacy complaint.\n\nTo make a request, contact contact@upmii.in. We may verify your identity before acting on your request."
    },
    {
      title: "10. Account Deletion",
      content:
        "You may request account deletion through the in-app deletion feature, if available, or by emailing contact@upmii.in with the subject “Upmi Account Deletion Request.”\n\nCertain records may be retained for legitimate legal, security, or dispute-resolution purposes where permitted by law."
    },
    {
      title: "11. Children's Privacy",
      content:
        "Upmi is not intended to collect children's personal information in violation of applicable law.\n\nWhere parental consent, age-related restrictions, or additional safeguards are required, we will apply the relevant requirements. If you believe a child has provided personal information unlawfully, contact contact@upmii.in."
    },
    {
      title: "12. Third-Party Services",
      content:
        "The App may use third-party services or link to external platforms. Their privacy practices are governed by their own policies."
    },
    {
      title: "13. International Data Transfers",
      content:
        "If personal information is stored or processed outside India, we will handle those transfers in accordance with applicable legal requirements."
    },
    {
      title: "14. Changes to This Privacy Policy",
      content:
        "We may update this Policy to reflect changes in the App, our data practices, or legal requirements. We will publish the updated Policy with a revised date and provide notice where required."
    },
    {
      title: "15. Grievances and Contact Information",
      content:
        "For privacy requests, complaints, or questions, contact:\n\n• App: Upmi\n• Owner / Company: UPMI\n• Privacy / Grievance Contact: UPMI Legal & Grievance Officer\n• Email: contact@upmii.in\n• Contact Number: 9585716229 & 8056983309\n• Address: 3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102"
    }
  ],
  contactInfo: {
    app: "Upmi",
    owner: "UPMI",
    email: "contact@upmii.in",
    phone: "9585716229 & 8056983309",
    address: "3rd Floor, 5th Main Road, 6th Sector, HSR Layout, Bengaluru, Karnataka 560102"
  }
};
