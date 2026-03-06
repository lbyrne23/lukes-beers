import { useState } from 'react'
import type { BeerDeviation, StyleStat } from '../types'

interface Props {
  loved: BeerDeviation[]
  snubbed: BeerDeviation[]
  styles: StyleStat[]
}

function RatingBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--dark-4)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color, minWidth: 32 }}>{value.toFixed(2)}</span>
    </div>
  )
}

function BeerCard({ beer, mode }: { beer: BeerDeviation; mode: 'loved' | 'snubbed' }) {
  const devColor = mode === 'loved' ? '#4CAF7D' : '#E05555'
  return (
    <div style={{
      background: 'var(--dark-3)',
      border: `1px solid ${mode === 'loved' ? '#4CAF7D30' : '#E0555530'}`,
      borderRadius: 6,
      padding: '12px 14px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>
        {beer.beer}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>
        {beer.brewery} · {beer.style}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', width: 32 }}>LUKE</span>
          <RatingBar value={beer.his} color="var(--amber)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', width: 32 }}>WORLD</span>
          <RatingBar value={beer.avg} color="var(--text-dim)" />
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: devColor, fontWeight: 600 }}>
        {mode === 'loved' ? '+' : ''}{beer.dev.toFixed(2)} vs world avg
      </div>
    </div>
  )
}

export default function DeviationSection({ loved, snubbed, styles }: Props) {
  const [tab, setTab] = useState<'loved' | 'snubbed' | 'styles'>('loved')

  // Style deviations
  const styleDeviations = [...styles]
    .filter(s => Math.abs(s.avg_deviation) > 0.04)
    .sort((a, b) => b.avg_deviation - a.avg_deviation)

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
          LUKE VS THE WORLD
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: 560 }}>
          Where Luke's taste diverges from the global Untappd average. A deviation of +0.5 means 
          he's a full half-point more generous than everyone else. The pattern is clear: he 
          champions small UK breweries and has zero patience for mainstream lagers.
        </p>
      </div>

      {/* Summary insight boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          {
            title: 'UK Indie Champion',
            body: 'Consistently rates small UK breweries 0.5–0.9 above world average. London Beer Lab, Vibrant Forest, Gosnells.',
            color: '#4CAF7D',
            icon: '🇬🇧',
          },
          {
            title: 'Lager Harsh Critic',
            body: 'Marks down lagers, pilsners, and wheats well below the world. Rates session and English ales coldly.',
            color: '#E05555',
            icon: '🥴',
          },
          {
            title: 'Sour Enthusiast',
            body: 'Above-average on Berliner Weisse, fruited gose, and anything sharp and funky.',
            color: '#4A9EDB',
            icon: '🍋',
          },
          {
            title: 'Big Beer Fan',
            body: 'Imperial stouts and pastry stouts rate consistently above global. The heavier the better.',
            color: '#E8A020',
            icon: '💪',
          },
        ].map(({ title, body, color, icon }) => (
          <div key={title} style={{
            background: 'var(--dark-3)',
            border: `1px solid ${color}40`,
            borderRadius: 8,
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{body}</div>
          </div>
        ))}
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {([
          { id: 'loved', label: '💚 Loves more than the world' },
          { id: 'snubbed', label: '❌ Rates below the world' },
          { id: 'styles', label: '📊 By style' },
        ] as const).map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab === id ? 'var(--amber)' : 'var(--dark-3)',
            color: tab === id ? 'var(--dark)' : 'var(--text-dim)',
            border: '1px solid var(--dark-4)',
            borderRadius: 4,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
          }}>
            {label}
          </button>
        ))}
      </div>

      {(tab === 'loved' || tab === 'snubbed') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {(tab === 'loved' ? loved : snubbed).slice(0, 20).map(b => (
            <BeerCard key={`${b.beer}-${b.brewery}`} beer={b} mode={tab} />
          ))}
        </div>
      )}

      {tab === 'styles' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                color: '#4CAF7D',
                letterSpacing: 1,
                marginBottom: 12,
              }}>
                RATES ABOVE WORLD ↑
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {styleDeviations.filter(s => s.avg_deviation > 0).slice(0, 15).map(s => (
                  <div key={s.style} style={{
                    background: 'var(--dark-3)',
                    border: '1px solid #4CAF7D30',
                    borderRadius: 6,
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{s.style}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{s.count} beers · avg {s.avg_rating.toFixed(2)}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#4CAF7D', flexShrink: 0 }}>
                      +{s.avg_deviation.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                color: '#E05555',
                letterSpacing: 1,
                marginBottom: 12,
              }}>
                RATES BELOW WORLD ↓
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...styleDeviations].filter(s => s.avg_deviation < 0).reverse().slice(0, 15).map(s => (
                  <div key={s.style} style={{
                    background: 'var(--dark-3)',
                    border: '1px solid #E0555530',
                    borderRadius: 6,
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{s.style}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{s.count} beers · avg {s.avg_rating.toFixed(2)}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#E05555', flexShrink: 0 }}>
                      {s.avg_deviation.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
