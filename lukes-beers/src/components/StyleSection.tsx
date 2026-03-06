import { useState } from 'react'
import type { StyleStat } from '../types'

interface Props {
  styles: StyleStat[]
}

const MAX_RATING = 5

export default function StyleSection({ styles }: Props) {
  const [sort, setSort] = useState<'count' | 'rating' | 'deviation'>('count')
  const [showAll, setShowAll] = useState(false)

  const sorted = [...styles].sort((a, b) => {
    if (sort === 'count') return b.count - a.count
    if (sort === 'rating') return b.avg_rating - a.avg_rating
    return b.avg_deviation - a.avg_deviation
  })

  const displayed = showAll ? sorted : sorted.slice(0, 20)
  const maxCount = Math.max(...styles.map(s => s.count))

  function styleColor(s: StyleStat) {
    const style = s.style.toLowerCase()
    if (style.includes('hazy') || style.includes('new england')) return '#4A9EDB'
    if (style.includes('ipa') || style.includes('pale ale')) return '#E8A020'
    if (style.includes('sour') || style.includes('gose') || style.includes('berliner')) return '#E05555'
    if (style.includes('stout') || style.includes('porter')) return '#9B8A68'
    if (style.includes('lager') || style.includes('pilsner')) return '#4CAF7D'
    if (style.includes('wheat') || style.includes('wit')) return '#F5C842'
    return 'var(--muted)'
  }

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          color: 'var(--foam)',
          letterSpacing: 1,
          marginBottom: 6,
        }}>
          STYLE DNA
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 560 }}>
          What Luke actually drinks, how he rates each style, and where he diverges from the global average.
          The hazy IPA obsession is very real.
        </p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {[
          { label: 'Hazy / NEIPA', value: styles.filter(s => s.style.toLowerCase().includes('hazy') || s.style.toLowerCase().includes('new england')).reduce((a, s) => a + s.count, 0), color: '#4A9EDB' },
          { label: 'All IPA', value: styles.filter(s => s.style.toLowerCase().includes('ipa')).reduce((a, s) => a + s.count, 0), color: '#E8A020' },
          { label: 'Sours', value: styles.filter(s => s.style.toLowerCase().includes('sour') || s.style.toLowerCase().includes('gose')).reduce((a, s) => a + s.count, 0), color: '#E05555' },
          { label: 'Lager / Pilsner', value: styles.filter(s => s.style.toLowerCase().includes('lager') || s.style.toLowerCase().includes('pilsner')).reduce((a, s) => a + s.count, 0), color: '#4CAF7D' },
          { label: 'Stouts', value: styles.filter(s => s.style.toLowerCase().includes('stout')).reduce((a, s) => a + s.count, 0), color: '#9B8A68' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--dark-3)',
            border: `1px solid ${color}40`,
            borderRadius: 20,
            padding: '6px 14px',
            display: 'flex',
            gap: 8,
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color, letterSpacing: 1 }}>{value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 12, marginRight: 6, alignSelf: 'center' }}>Sort by:</span>
        {(['count', 'rating', 'deviation'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)} style={{
            background: sort === s ? 'var(--amber)' : 'var(--dark-3)',
            color: sort === s ? 'var(--dark)' : 'var(--text-dim)',
            border: '1px solid var(--dark-4)',
            borderRadius: 4,
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
          }}>
            {s === 'count' ? 'Volume' : s === 'rating' ? 'Luke\'s Rating' : 'Deviation from World'}
          </button>
        ))}
      </div>

      {/* Style bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {displayed.map(s => {
          const color = styleColor(s)
          const devColor = s.avg_deviation > 0.05 ? '#4CAF7D' : s.avg_deviation < -0.05 ? '#E05555' : 'var(--text-dim)'
          return (
            <div key={s.style} style={{
              background: 'var(--dark-3)',
              border: '1px solid var(--dark-4)',
              borderRadius: 6,
              padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.style}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text)' }}>{s.count}</span> beers
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                    avg <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color }}>{s.avg_rating.toFixed(2)}</span>
                  </span>
                  <span style={{ fontSize: 11, color: devColor, minWidth: 60, textAlign: 'right' }}>
                    {s.avg_deviation > 0 ? '+' : ''}{s.avg_deviation.toFixed(2)} vs world
                  </span>
                </div>
              </div>
              {/* Volume bar */}
              <div style={{ height: 4, background: 'var(--dark-4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(s.count / maxCount) * 100}%`,
                  background: color,
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {!showAll && sorted.length > 20 && (
        <button onClick={() => setShowAll(true)} style={{
          marginTop: 16,
          background: 'var(--dark-3)',
          color: 'var(--amber)',
          border: '1px solid var(--amber-dark)',
          borderRadius: 4,
          padding: '8px 20px',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'var(--font-body)',
          width: '100%',
        }}>
          Show all {sorted.length} styles
        </button>
      )}
    </div>
  )
}
