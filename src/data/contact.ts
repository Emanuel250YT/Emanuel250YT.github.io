/** Values sent by the contact form, independent of the visitor's language. */
export const SERVICE_EXTRA_VALUES = {
  cosmos: 'Cosmos Pay for my business',
  other: 'Other',
} as const;

/** Budget ranges, in the same order as `contact.form.budgetOptions` in every dictionary. */
export const BUDGET_VALUES = [
  'Under USD 1,000',
  'USD 1,000 to 5,000',
  'USD 5,000 to 15,000',
  'Over USD 15,000',
  'Not sure yet',
] as const;

