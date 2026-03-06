import type { UntappdData } from '../types'

interface Props {
  hero: UntappdData['hero']
}

const COUNTRY_FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  'New Zealand': '🇳🇿',
  'Germany': '🇩🇪',
  'Ireland': '🇮🇪',
  'Poland': '🇵🇱',
  'Netherlands': '🇳🇱',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Europe': '🌍',
  'Australia': '🇦🇺',
}

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--dark-3)',
      border: '1px solid var(--dark-4)',
      borderRadius: 8,
      padding: '20px 24px',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 44,
        lineHeight: 1,
        color: 'var(--amber)',
        letterSpacing: 1,
      }}>{value}</div>
      <div style={{ color: 'var(--text)', fontSize: 14, marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export default function HeroSection({ hero }: Props) {
  const topCountries = Object.entries(hero.countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <section style={{
      background: `linear-gradient(180deg, var(--dark-2) 0%, var(--dark) 100%)`,
      borderBottom: '1px solid var(--dark-4)',
      padding: '40px 24px 36px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Big headline */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.9,
            letterSpacing: 2,
            color: 'var(--foam)',
          }}>
            2,583<br />
            <span style={{ color: 'var(--amber)' }}>UNIQUE</span><br />
            BEERS
          </h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 16, maxWidth: 480, lineHeight: 1.5 }}>
            Every beer Luke Inkster has ever logged on Untappd. Across {hero.countries_count} countries, 
            {' '}{hero.unique_venues.toLocaleString()} venues, and {hero.unique_breweries.toLocaleString()} breweries. 
            Average rating: {hero.avg_rating} / 5.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <StatCard value={hero.total_beers.toLocaleString()} label="Unique beers" sub="no repeats" />
          <StatCard value={hero.unique_breweries.toLocaleString()} label="Breweries" sub="explored" />
          <StatCard value={hero.unique_venues.toLocaleString()} label="Venues" sub="worldwide" />
          <StatCard value={hero.avg_rating.toString()} label="Avg rating" sub="out of 5" />
          <StatCard value={hero.countries_count.toString()} label="Countries" sub="with check-ins" />
        </div>

        {/* Country breakdown */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 12, marginRight: 4 }}>Beers by country:</span>
          {topCountries.map(([country, count]) => (
            <div key={country} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'var(--dark-3)',
              border: '1px solid var(--dark-4)',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 12,
            }}>
              <span>{COUNTRY_FLAGS[country] || '🍺'}</span>
              <span style={{ color: 'var(--text-dim)' }}>{country}</span>
              <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
