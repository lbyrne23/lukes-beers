import { useEffect, useRef, useState } from 'react'
import type { MapVenue } from '../types'

interface Props {
  venues: MapVenue[]
}

function ratingColor(rating: number): string {
  if (rating >= 4.2) return '#F5C842'   // gold
  if (rating >= 3.9) return '#E8A020'   // amber
  if (rating >= 3.5) return '#C07010'   // dark amber
  return '#6B5B3A'                        // muted
}

function ratingSize(checkins: number): number {
  if (checkins >= 30) return 14
  if (checkins >= 15) return 11
  if (checkins >= 5) return 9
  return 7
}

function PopupContent({ venue }: { venue: MapVenue }) {
  return `
    <div style="font-family: DM Sans, sans-serif; min-width: 220px; max-width: 280px;">
      <div style="font-weight: 600; font-size: 14px; color: #F0E8D0; margin-bottom: 4px; line-height: 1.3;">
        ${venue.name}
      </div>
      <div style="font-size: 11px; color: #9B8A68; margin-bottom: 10px;">
        ${venue.city ? venue.city.split(' ')[0] + ' · ' : ''}${venue.country} · ${venue.checkins} check-in${venue.checkins !== 1 ? 's' : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <div style="font-size: 22px; font-family: Bebas Neue, sans-serif; color: #E8A020; letter-spacing: 1px;">
          ${venue.avg_rating.toFixed(2)}
        </div>
        <div style="font-size: 11px; color: #9B8A68;">avg rating</div>
      </div>
      <div style="border-top: 1px solid #332510; padding-top: 8px;">
        <div style="font-size: 11px; color: #9B8A68; margin-bottom: 6px;">TOP BEERS HERE</div>
        ${venue.top_beers.slice(0, 4).map(b => `
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; gap: 8px;">
            <div style="font-size: 12px; color: #F0E8D0; line-height: 1.3; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${b.beer}
            </div>
            <div style="font-size: 12px; color: #E8A020; font-weight: 600; flex-shrink: 0;">${b.rating}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

export default function MapSection({ venues }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [filter, setFilter] = useState<'all' | 'top'>('all')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  const countries = ['all', ...Array.from(new Set(venues.map(v => v.country))).sort()]

  const filtered = venues.filter(v => {
    if (filter === 'top' && v.avg_rating < 3.9) return false
    if (selectedCountry !== 'all' && v.country !== selectedCountry) return false
    return true
  })

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // @ts-ignore
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [30, 10],
      zoom: 2,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    mapInstance.current = map
    return () => { map.remove(); mapInstance.current = null }
  }, [])

  useEffect(() => {
    // @ts-ignore
    const L = window.L
    if (!L || !mapInstance.current) return

    const map = mapInstance.current
    // Remove old markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer)
    })

    filtered.forEach(venue => {
      const color = ratingColor(venue.avg_rating)
      const size = ratingSize(venue.checkins)

      const marker = L.circleMarker([venue.lat, venue.lng], {
        radius: size,
        fillColor: color,
        color: 'rgba(0,0,0,0.4)',
        weight: 1,
        fillOpacity: 0.9,
      })

      marker.bindPopup(PopupContent({ venue }), {
        maxWidth: 300,
        className: 'beer-popup',
      })

      marker.addTo(map)
    })
  }, [filtered])

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          color: 'var(--foam)',
          letterSpacing: 1,
          marginBottom: 6,
        }}>
          WHERE IN THE WORLD
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
          {filtered.length} venues plotted · click any dot to see what he drank there
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'top'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? 'var(--amber)' : 'var(--dark-3)',
              color: filter === f ? 'var(--dark)' : 'var(--text-dim)',
              border: '1px solid var(--dark-4)',
              borderRadius: 4,
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
            }}>
              {f === 'all' ? 'All venues' : '⭐ Rated 3.9+'}
            </button>
          ))}
        </div>
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          style={{
            background: 'var(--dark-3)',
            color: 'var(--text)',
            border: '1px solid var(--dark-4)',
            borderRadius: 4,
            padding: '5px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {countries.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All countries' : c}</option>
          ))}
        </select>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', alignItems: 'center' }}>
          {[
            { color: '#F5C842', label: '4.2+' },
            { color: '#E8A020', label: '3.9+' },
            { color: '#C07010', label: '3.5+' },
            { color: '#6B5B3A', label: 'below' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-dim)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>· size = visit count</span>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{
        height: 560,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--dark-4)',
      }} />

      {/* Top venues by avg rating */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: 'var(--foam)',
          letterSpacing: 1,
          marginBottom: 14,
        }}>
          HIGHEST RATED VENUES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {[...venues]
            .filter(v => v.checkins >= 3)
            .sort((a, b) => b.avg_rating - a.avg_rating)
            .slice(0, 12)
            .map(v => (
              <div key={v.name} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--dark-4)',
                borderRadius: 6,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                    {v.country} · {v.checkins} beer{v.checkins !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  color: 'var(--amber)',
                  letterSpacing: 1,
                  flexShrink: 0,
                }}>
                  {v.avg_rating.toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
