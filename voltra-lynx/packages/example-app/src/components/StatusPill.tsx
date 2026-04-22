export function StatusPill({ active }: { active: boolean }) {
  return (
    <view style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.1)',
      paddingTop: 4, paddingBottom: 4,
      paddingLeft: 10, paddingRight: 10,
      borderRadius: 12,
    }}>
      <view style={{
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: active ? '#22C55E' : '#94A3B8',
        marginRight: 6,
      }} />
      <text style={{
        fontSize: 12,
        fontWeight: '600',
        color: active ? '#22C55E' : '#94A3B8',
      }}>
        {active ? 'Active' : 'Idle'}
      </text>
    </view>
  );
}
