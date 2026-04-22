export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

const styles = {
  primary: {
    backgroundColor: '#8232FF',
    padding: 12,
    paddingLeft: 24, paddingRight: 24,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  secondary: {
    backgroundColor: 'rgba(130, 50, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(130, 50, 255, 0.4)',
    padding: 12,
    paddingLeft: 24, paddingRight: 24,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ghost: {
    borderWidth: 1,
    borderColor: 'rgba(130, 50, 255, 0.6)',
    backgroundColor: 'transparent',
    padding: 12,
    paddingLeft: 24, paddingRight: 24,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

const textColors = {
  primary: '#FFFFFF',
  secondary: '#E2E8F0',
  ghost: '#E2E8F0',
};

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <view
      bindtap={disabled ? undefined : onPress}
      style={{
        ...styles[variant],
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <text style={{
        fontSize: 14,
        fontWeight: '600',
        color: disabled ? '#9CA3AF' : textColors[variant],
      }}>
        {title}
      </text>
    </view>
  );
}
