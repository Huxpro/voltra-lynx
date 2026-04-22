// Lynx-safe shared styles
// All borderRadius use 'px' strings, no bare lineHeight, linear layout for rows

export const colors = {
  primary: '#8232FF',
  cardBg: '#0F172A',
  cardBorder: 'rgba(148, 163, 184, 0.12)',
  screenBg: '#0B0F19',
  textPrimary: '#E2E8F0',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  white: '#FFFFFF',
};

export const cardStyle = {
  backgroundColor: colors.cardBg,
  borderRadius: '20px',
  padding: 18,
  borderWidth: 1,
  borderColor: colors.cardBorder,
  marginTop: 16,
};

export const buttonPrimary = {
  backgroundColor: colors.primary,
  paddingTop: 12, paddingBottom: 12,
  paddingLeft: 24, paddingRight: 24,
  borderRadius: '12px',
  alignItems: 'center' as const,
};

export const buttonSecondary = {
  backgroundColor: 'rgba(130, 50, 255, 0.1)',
  borderWidth: 1,
  borderColor: 'rgba(130, 50, 255, 0.4)',
  paddingTop: 12, paddingBottom: 12,
  paddingLeft: 24, paddingRight: 24,
  borderRadius: '12px',
  alignItems: 'center' as const,
};

export const buttonGhost = {
  borderWidth: 1,
  borderColor: 'rgba(130, 50, 255, 0.6)',
  backgroundColor: 'transparent',
  paddingTop: 12, paddingBottom: 12,
  paddingLeft: 24, paddingRight: 24,
  borderRadius: '12px',
  alignItems: 'center' as const,
};

export const pill = {
  paddingLeft: 10, paddingRight: 10,
  paddingTop: 4, paddingBottom: 4,
  borderRadius: '999px',
};

export const row = {
  display: 'linear' as const,
  linearDirection: 'row' as const,
};

export const sectionHeader = {
  fontSize: 12,
  fontWeight: '600' as const,
  color: colors.textMuted,
  letterSpacing: 1,
  marginTop: 24,
  marginBottom: 8,
};
