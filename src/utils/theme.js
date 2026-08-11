export const colors = {
  first: '#EDCB96',        // Apricot Cream (Primary gold accent)
  second: '#A0A0A0',       // Subtle Gray / Secondary text: card section headers, labels
  third: '#9E7682',        // Dusty Mauve
  fourth: '#605770',       // Vintage Grape
  fifth: '#4D4861',        // Dark Vintage Grape

  background: '#000000',   // Canvas background (Pure black #000000)
  card: '#141414',         // Card background (Elevated surface slightly lighter than black)

  textPrimary: '#EDCB96',  // Primary text color alias
  textSecondary: '#F7C4A5',// Secondary text color alias

  border: '#313030'        // Standard container border line color
};

export const typography = {
  fontFamily: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  monoFontFamily: "'JetBrains Mono', monospace",

  displayLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: '700', lineHeight: '56px', letterSpacing: '-0.02em' },
  displayLgMobile: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '36px', fontWeight: '700', lineHeight: '44px', letterSpacing: '-0.02em' },
  headlineMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: '600', lineHeight: '32px', letterSpacing: '0' },
  statsNum: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '32px', fontWeight: '300', lineHeight: '40px', letterSpacing: '0' },
  bodyLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: '400', lineHeight: '28px', letterSpacing: '0' },
  bodyMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', lineHeight: '24px', letterSpacing: '0' },
  labelCaps: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: '500', lineHeight: '16px', letterSpacing: '0.15em', textTransform: 'uppercase' },

  // Legacy aliases
  h1: { fontSize: '28px', fontWeight: '600', lineHeight: '1.2' },
  h2: { fontSize: '22px', fontWeight: '600', lineHeight: '1.3' },
  h3: { fontSize: '18px', fontWeight: '600', lineHeight: '1.4' },
  body: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
  caption: { fontSize: '14px', fontWeight: '400', lineHeight: '1.3' },
};

export const spacing = {
  baseUnit: '4px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  xxl: '64px',
  gutter: '16px',
};

export const borderRadius = {
  none: '0px',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const cardStyle = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  padding: spacing.lg,
  boxSizing: 'border-box',
};