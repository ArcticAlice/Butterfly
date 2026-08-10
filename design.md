# Butterfly Design System & Component Guidelines

## 1. Core Brand & Aesthetic Philosophy
- **Archetype**: Luxury Dark Mode / Precision Health & Recovery
- **Palette Concept**: Pure black canvas with warm apricot and peach glow accents. Zero heavy drop-shadows. Flat shadowless design with depth created purely through subtle background elevation and 1px borders.
- **Typography Tone**: Clean, architectural, data-focused (`Hanken Grotesk` for display & body text, `JetBrains Mono` for uppercase headers and numeric data).

---

## 2. Token Definitions (`src/utils/theme.js`)

### 2.1 Colors (`colors`)
```javascript
export const colors = {
  first: '#EDCB96',        // Apricot Cream (Primary gold accent: values, brand logo/text, icons, primary text)
  second: '#F7C4A5',       // Peach Fuzz (Secondary text: card section headers, labels, goal subtext)
  third: '#9E7682',        // Dusty Mauve (Accent 3: Light sleep / data stage indicator)
  fourth: '#605770',       // Vintage Grape (Accent 4: Awake / muted data stage indicator)
  fifth: '#4D4861',        // Dark Vintage Grape (Muted border accent)

  background: 'black',     // Canvas background (Pure black #000000)
  card: '#161412',         // Card background (Elevated surface slightly lighter than black)

  textPrimary: '#EDCB96',  // Primary text color alias
  textSecondary: '#F7C4A5',// Secondary text color alias

  border: '#4D4861'        // Standard container border line color
};
```

### 2.2 Typography (`typography`)
```javascript
export const typography = {
  fontFamily: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  monoFontFamily: "'JetBrains Mono', monospace",

  displayLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: '700', lineHeight: '56px', letterSpacing: '-0.02em' },
  headlineMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: '600', lineHeight: '32px', letterSpacing: '0' },
  statsNum: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '32px', fontWeight: '300', lineHeight: '40px', letterSpacing: '0' },
  bodyLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: '400', lineHeight: '28px', letterSpacing: '0' },
  bodyMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: '400', lineHeight: '24px', letterSpacing: '0' },
  labelCaps: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: '500', lineHeight: '16px', letterSpacing: '0.15em', textTransform: 'uppercase' },

  // Standard legacy aliases
  h1: { fontSize: '28px', fontWeight: '600', lineHeight: '1.2' },
  h2: { fontSize: '22px', fontWeight: '600', lineHeight: '1.3' },
  h3: { fontSize: '18px', fontWeight: '600', lineHeight: '1.4' },
  body: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
  caption: { fontSize: '14px', fontWeight: '400', lineHeight: '1.3' },
};
```

### 2.3 Spacing & Radius (`spacing`, `borderRadius`)
```javascript
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  xxl: '64px',
};

export const borderRadius = {
  none: '0px',
  sm: '2px',
  DEFAULT: '4px', // Standard container border radius
  md: '6px',
  lg: '8px',
  full: '9999px', // Accent pills
};
```

---

## 3. Structural Layout & Page Framework

All full-page components (e.g. `SleepPage.jsx`, `DietPage.jsx`, `VitalsPage.jsx`, `BloodWorkPage.jsx`, `DashboardPage.jsx`) must adhere to this overall page hierarchy:

```jsx
<div style={styles.container}>
  {/* Top Fixed Header */}
  <PageHeader onBack={onBack} />

  {/* Centered Content Column */}
  <div style={styles.contentWrapper}>
    {/* Date Navigation */}
    <DateNavigator currentDate={currentDate} onPrevious={...} onNext={...} />

    {/* Main Two-Column Grid */}
    <div style={styles.mainGrid}>
      {/* Left Column Card(s) */}
      <div style={styles.card}> ... </div>

      {/* Right Column Stack */}
      <div style={styles.rightColumn}>
        <div style={styles.card}> ... </div>
        <div style={styles.card}> ... </div>
      </div>
    </div>

    {/* Bottom Section (e.g. Daily Notes) */}
    <NotesSection value={formData.notes} onChange={handleNotesChange} />
  </div>
</div>
```

### Page Container Styles
```javascript
container: {
  backgroundColor: colors.background, // Pure black ('black')
  minHeight: '100vh',
  width: '100vw',
  boxSizing: 'border-box',
  color: colors.first,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
contentWrapper: {
  width: '100%',
  maxWidth: '1080px',
  padding: '72px 24px 16px 24px', // 72px top (below header), 16px bottom
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg, // 24px
},
mainGrid: {
  display: 'grid',
  gridTemplateColumns: '1fr 1.25fr',
  gap: spacing.lg, // 24px
  width: '100%',
}
```

---

## 4. UI Components Specification

### 4.1 Header (`PageHeader.jsx`)
- **Height & Fixation**: Fixed top header, `height: 56px`, `backgroundColor: colors.background`, `borderBottom: 1px solid ${colors.border}`.
- **Left Brand Section**: Clickable back button / home link. Render `Butterfly` SVG icon (`size="26px"`, `color={colors.first}`) + "Butterfly" brand title in `20px` `fontWeight: 600` `color={colors.first}` text.
- **Right Action Section**: Render `Calendar` SVG (`size="20px"`, `color={colors.first}`) and `Settings` SVG (`size="20px"`, `color={colors.first}`). Icons do not require click handlers.

### 4.2 Date Navigator (`DateNavigator.jsx`)
- **Layout**: Flex row centered at top of content, `gap: spacing.lg`.
- **Arrows**: `Left` and `Right` SVG icons (`size="18px"`, `color={colors.first}`).
- **Date Text**: `fontFamily: typography.fontFamily`, `fontSize: 22px`, `fontWeight: 600`, `color: colors.first`.

### 4.3 Standard Cards (`styles.card`)
- **Background**: `colors.card` (`#161412`)
- **Border**: `1px solid ${colors.border}` (`#4D4861`)
- **Border Radius**: `4px`
- **Internal Padding**: `spacing.lg` (`24px`)
- **Section Title (`styles.cardHeader`)**: Uppercase monospace label styled with `...typography.labelCaps`, `color: colors.second` (`#F7C4A5`), `margin: 0 0 16px 0`.

### 4.4 Data Rows & Stage Items (`styles.stageRow`)
- **Row Border**: `borderBottom: 1px solid ${colors.border}` (`#4D4861`) for all rows except the final row.
- **Left Accent Pill (`styles.stagePill`)**: `width: 3px`, `height: 18px`, `borderRadius: 9999px`, `marginRight: spacing.md` (2-pixel vertical colored indicator pill using `colors.first`, `colors.second`, `colors.third`, or `colors.fourth`).
- **Row Label (`styles.stageLabel`)**: `flex: 1`, `fontFamily: typography.fontFamily`, `fontSize: 15px`, `color: colors.first`.
- **Row Value (`styles.stageValue`)**: `fontFamily: typography.fontFamily`, `fontSize: 15px`, `color: colors.first`.

### 4.5 Circular Progress Gauge (`Gauge.jsx`)
- **Ring Dimensions**: `size={240}` (240px x 240px).
- **Track Stroke**: `stroke={colors.border}` (`#4D4861`).
- **Progress Stroke**: `stroke={colors.first}` (`#EDCB96`).
- **Center Text Display**:
  - Primary metric: `32px` light weight font (`color: colors.first`).
  - Goal / Subtext label: `...typography.labelCaps` (`fontSize: 11px`, `color: colors.second`).

### 4.6 Daily Notes Section (`NotesSection.jsx`)
- **Card Header**: `DAILY NOTES` in `...typography.labelCaps` (`color: colors.second`).
- **Textarea Container**: `backgroundColor: colors.background` (`black`), `border: 1px solid ${colors.border}`, `borderRadius: 4px`, `minHeight: 180px`, `padding: spacing.md`.
- **Textarea**: Transparent background (`backgroundColor: 'transparent'`), font `15px` `lineHeight: 22px` (`color: colors.first`), `height: 160px`, `resize: 'none'`.

---

## 5. Interaction Patterns (No Pencil Icons / Direct Inline Editing)

- **Strict Constraint**: **Do NOT use Pencil icons**. All editing is performed via direct click interaction on the value/text display elements.
- **Workflow State**:
  1. Click display text/row (`onClick={() => startEditing(field)}`).
  2. Toggle `editingFields[field]` state to `true`.
  3. Render inline `<input>` field auto-focused via `useEffect` ref (`inputRefs.current[field].focus()`).
  4. Styling for active input:
     - `backgroundColor: colors.background` (`black`)
     - `color: colors.first` (`#EDCB96`)
     - `border: 1px solid ${colors.border}` (`#4D4861`)
     - `borderRadius: 4px`
     - `fontFamily: typography.fontFamily` or `typography.monoFontFamily`
  5. On Enter key press (`onKeyDown`) or blur (`onBlur`), invoke `saveField(e, field)` to save updated values to the data service and restore normal text display mode.

---

## 6. Checklist for Refactoring Other Pages

When modifying `DietPage.jsx`, `VitalsPage.jsx`, `BloodWorkPage.jsx`, `DashboardPage.jsx`, or item components like `Template.jsx`:

1. **Imports**: Import `{ colors, typography, spacing }` from `../utils/theme`. Import `PageHeader`, `DateNavigator`, `NotesSection`.
2. **Colors**: Replace all ad-hoc color strings or legacy tokens with:
   - Primary text / values: `colors.first` (`#EDCB96`)
   - Section titles / sub-labels: `colors.second` (`#F7C4A5`)
   - Data stage indicators: `colors.first`, `colors.second`, `colors.third`, `colors.fourth`
   - Backgrounds: `colors.background` (`black`), `colors.card` (`#161412`)
   - Borders: `colors.border` (`#4D4861`)
3. **Card Container Styling**: Apply `backgroundColor: colors.card`, `border: 1px solid ${colors.border}`, `borderRadius: '4px'`, `padding: spacing.lg`.
4. **Header Titles**: Wrap card section headers in `<h3 style={styles.cardHeader}>TITLE</h3>` styled with `...typography.labelCaps` and `color: colors.second`.
5. **Remove Pencil Icons**: Delete all `Pencil` icon imports and `<Pencil />` components. Implement direct `onClick` inline editing.
6. **Build Check**: Always run `npm run build` (`vite build`) to confirm compilation success.
