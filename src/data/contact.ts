/** Values sent by the contact form, independent of the visitor's language. */
export const SERVICE_EXTRA_VALUES = {
  cosmos: 'Cosmos Pay for my business',
  other: 'Other',
} as const;

/** Budget ranges, in the same order as `contact.form.budgetOptions` in every dictionary. */
export const BUDGET_VALUES = [
  'Under USD 1,000',
  'USD 1,000 - 5,000',
  'USD 5,000 - 15,000',
  'Over USD 15,000',
  'Not sure yet',
] as const;

/** Ecosystems and communities shown in the scroll-linked strip of the achievements section. */
export const ecosystems = [
  'Stellar',
  'Solana',
  'Monad',
  'Ethereum',
  'Arkiv',
  'Stellar Development Foundation',
  'Blockchain Acceleration Foundation',
  'Trustless Work',
  'SaltaDev',
  'DESAFIA',
];
