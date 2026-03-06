import type { Brewery } from '../types'

interface Props {
  breweries: Brewery[]
}

function ratingColor(rating: number) {
  if (rating >= 4.1) return '#F5C842'
  if (rating >= 3.9) return '#E8A020'
  if (rating >= 3.7) return '#C07010'
  return '#6B5B3A'
}

export default function BrewerySection({ breweries }: Props) {
  const top = breweries.slice(0, 24)
  const maxCount = top[0]?.count ?? 1

  // Tier labels
  function tier(b: Brewery) {
    if (b.count >= 40) return { label: 'OBSESSION', color: '#F5C842' }
    if (b.count >= 25) return { label: 'REGULAR', color: '#E8A020' }
    if (b.count >= 15) return { label: 'FAVOURITE', color: '#C07010' }
    return { label: 'FREQUENTED', color: '#6B5B3A' }
  }

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          color: 'var(--foam)',
          letterSpacing: 1,
          marginBottom: 6,
        }}>
          BREWERY LOYALTIES
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 560 }}>
          The breweries Luke keeps coming back to — sorted by visit count. 
          Pressure Drop and Verdant hold a special place. The Vault City dedication is real.
        </p>
      </div>

      {/* Top 5 spotlight */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {top.slice(0, 5).map((b, i) => (
          <div key={b.name} style={{
            background: 'var(--dark-3)',
            border: `1px solid ${ratingColor(b.avg_rating)}50`,
            borderRadius: 8,
            padding: '16px 20px',
            flex: 1,
            minWidth: 150,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 8,
              right: 12,
              fontFamily: 'var(--font-display)',
              fontSize: 48,
              color: 'var(--dark-4)',
              lineHeight: 1,
            }}>
              #{i + 1}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>{tier(b).label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
              {b.name}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: ratingColor(b.avg_rating), lineHeight: 1 }}>
                  {b.count}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>beers</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--amber)', lineHeight: 1 }}>
                  {b.avg_rating.toFixed(2)}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>avg rating</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full list as bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {top.map((b, i) => {
          const t = tier(b)
          return (
            <div key={b.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--dark-3)',
              border: '1px solid var(--dark-4)',
              borderRadius: 6,
              padding: '8px 14px',
            }}>
              <div style={{ width: 24, textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-dim)' }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--dark-4)', borderRadius: 2, overflow: 'hidden', maxWidth: 200 }}>
                    <div style={{
                      height: '100%',
                      width: `${(b.count / maxCount) * 100}%`,
                      background: ratingColor(b.avg_rating),
                      borderRadius: 2,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{b.count} beers</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: ratingColor(b.avg_rating), lineHeight: 1 }}>
                  {b.avg_rating.toFixed(2)}
                </div>
                <div style={{ fontSize: 10, color: t.color, marginTop: 1 }}>{t.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
