import React from 'react'
import { env, eq, when, Voltra, type WidgetVariants } from '@use-voltra/ios'

type WidgetSize = 'small' | 'medium'

/** Per-mode label text color (avoids nesting `match` inside `when` for style types). */
const labelByMode = when(
  eq(env.renderingMode, 'accented'),
  '#CBD5E1',
  when(eq(env.renderingMode, 'fullColor'), '#475569', '#FBCFE8')
)

/** Per-mode primary text / active border color. */
const valueByMode = when(
  eq(env.renderingMode, 'accented'),
  '#F9FAFB',
  when(eq(env.renderingMode, 'fullColor'), '#0F172A', '#FDF2F8')
)

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <Voltra.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Voltra.Text
        style={{
          width: 78,
          fontSize: 12,
          fontWeight: '600',
          color: labelByMode,
        }}
      >
        {label}
      </Voltra.Text>

      <Voltra.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {children}
      </Voltra.View>
    </Voltra.View>
  )
}

const IosResolvablePlaygroundBody = ({ size }: { size: WidgetSize }) => {
  const compact = size === 'small'
  const box = compact ? 26 : 28

  return (
    <Voltra.View
      style={{
        flex: 1,
        padding: compact ? 14 : 18,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Voltra.View
        style={{
          flexDirection: 'column',
          gap: compact ? 10 : 12,
          alignItems: 'stretch',
        }}
      >
        <Voltra.Text
          style={{
            fontSize: compact ? 15 : 16,
            fontWeight: '700',
            color: valueByMode,
            textAlign: 'center',
          }}
        >
          Resolvable Values
        </Voltra.Text>

        <Row label="mode">
          <Voltra.ControlSwitch
            value={env.renderingMode}
            cases={{
              accented: (
                <Voltra.View
                  style={{
                    width: box,
                    height: box,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#F9FAFB',
                    borderRadius: 4,
                  }}
                >
                  <Voltra.Text style={{ fontSize: compact ? 13 : 14, fontWeight: '700', color: valueByMode }}>
                    A
                  </Voltra.Text>
                </Voltra.View>
              ),
              fullColor: (
                <Voltra.View
                  style={{
                    width: box,
                    height: box,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#0F172A',
                    borderRadius: 4,
                  }}
                >
                  <Voltra.Text style={{ fontSize: compact ? 13 : 14, fontWeight: '700', color: valueByMode }}>
                    F
                  </Voltra.Text>
                </Voltra.View>
              ),
              default: (
                <Voltra.View
                  style={{
                    width: box,
                    height: box,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#FDF2F8',
                    borderRadius: 4,
                  }}
                >
                  <Voltra.Text style={{ fontSize: compact ? 13 : 14, fontWeight: '700', color: valueByMode }}>
                    V
                  </Voltra.Text>
                </Voltra.View>
              ),
            }}
          />
        </Row>

        <Row label="background">
          <Voltra.ControlIf
            condition={eq(env.showsWidgetContainerBackground, true)}
            else={
              <Voltra.View
                style={{
                  width: box,
                  height: box,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: labelByMode,
                  borderRadius: 4,
                }}
              >
                <Voltra.Text style={{ fontSize: compact ? 13 : 14, fontWeight: '700', color: valueByMode }}>
                  N
                </Voltra.Text>
              </Voltra.View>
            }
          >
            <Voltra.View
              style={{
                width: box,
                height: box,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: valueByMode,
                borderRadius: 4,
              }}
            >
              <Voltra.Text style={{ fontSize: compact ? 13 : 14, fontWeight: '700', color: valueByMode }}>
                Y
              </Voltra.Text>
            </Voltra.View>
          </Voltra.ControlIf>
        </Row>
      </Voltra.View>
    </Voltra.View>
  )
}

export const IosResolvablePlaygroundWidget = ({ size = 'medium' }: { size?: WidgetSize }) => {
  return <IosResolvablePlaygroundBody size={size} />
}

export const resolvablePlaygroundVariants: WidgetVariants = {
  systemSmall: <IosResolvablePlaygroundWidget size="small" />,
  systemMedium: <IosResolvablePlaygroundWidget size="medium" />,
  systemLarge: <IosResolvablePlaygroundWidget size="medium" />,
}
