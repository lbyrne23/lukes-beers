import { useState } from 'react'
import data from './data/untappd_data.json'
import type { UntappdData } from './types'
import HeroSection from './components/HeroSection'
import MapSection from './components/MapSection'
import StyleSection from './components/StyleSection'
import DeviationSection from './components/DeviationSection'
import BrewerySection from './components/BrewerySection'

const d = data as UntappdData

const TABS = [
  { id: 'map', label: 'The Map' },
  { id: 'styles', label: 'Style DNA' },
  { id: 'vs-world', label: 'Luke vs The World' },
  { id: 'breweries', label: 'Loyalties' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('map')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--dark-4)',
        background: 'var(--dark-2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--amber)', letterSpacing: 1 }}>
                LUKE'S BEER JOURNEY
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                {d.hero.total_beers.toLocaleString()} unique beers · {d.hero.countries_count} countries
              </span>
            </div>
            <nav style={{ display: 'flex', gap: 4 }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'var(--amber)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--dark)' : 'var(--text-dim)',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 13,
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <HeroSection hero={d.hero} />

      {/* Tab content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {activeTab === 'map' && <MapSection venues={d.map_venues} />}
        {activeTab === 'styles' && <StyleSection styles={d.styles} />}
        {activeTab === 'vs-world' && <DeviationSection loved={d.loved} snubbed={d.snubbed} styles={d.styles} />}
        {activeTab === 'breweries' && <BrewerySection breweries={d.top_breweries} />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--dark-4)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: 12,
        background: 'var(--dark-2)',
      }}>
        Data from Untappd · {d.hero.total_beers.toLocaleString()} beers logged since the beginning
      </footer>
    </div>
  )
}
