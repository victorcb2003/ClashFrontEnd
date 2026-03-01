import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import Sidebar from '../components/Sidebar'
import { getUser } from '../services/authService'
import { findAllEquipe } from '../services/equipeService'

const DAYS_LONG = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1 }
function getMonday(date) { const d = new Date(date); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); d.setHours(0, 0, 0, 0); return d }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }

function getMatchsForDate(matchs, date) {
  return matchs.filter(m => {
    const d = new Date(m.date_heure)
    return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
  })
}

function Calendar({ compact = false }) {
  const today = new Date()
  const navigate = useNavigate()

  const [matchs, setMatchs] = useState([])
  const [equipes, setEquipes] = useState([])
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)
  const [weekStart, setWeekStart] = useState(getMonday(today))

  useEffect(() => {
    (async () => {
      try {
        const [userData, equipesData] = await Promise.all([
          getUser(),
          findAllEquipe()
        ])
        setMatchs(userData?.match || [])
        setEquipes(equipesData?.equipes || [])
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  const getEquipeName = (id) => equipes.find(e => e.id == id)?.nom || `Équipe #${id}`

  // notre calendrier de la page d'acceuil
  if (compact) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const weekLabel = () => {
      const end = addDays(weekStart, 6)
      const fmt = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      return `${fmt(weekStart)} – ${fmt(end)}`
    }

    return (
      <div className="backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setWeekStart(d => addDays(d, -7))} className="text-white/50 hover:text-white transition-all text-lg">
            <FaArrowAltCircleLeft />
          </button>
          <span className="text-white/70 text-xs font-bold tracking-widest uppercase">{weekLabel()}</span>
          <button onClick={() => setWeekStart(d => addDays(d, 7))} className="text-white/50 hover:text-white transition-all text-lg">
            <FaArrowAltCircleRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, i) => {
            const dayMatchs = getMatchsForDate(matchs, day)
            const isToday = day.toDateString() === today.toDateString()
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className={`text-center rounded-lg py-1 ${isToday ? 'bg-white/20' : ''}`}>
                  <p className="text-white/40 text-xs font-bold tracking-wider">{DAYS_SHORT[i]}</p>
                  <p className={`text-sm font-bold ${isToday ? 'text-white' : 'text-white/60'}`}>{day.getDate()}</p>
                </div>
                {dayMatchs.length === 0 ? (
                  <div className="flex-1 rounded-lg border border-white/5 min-h-[40px]" />
                ) : (
                  dayMatchs.map(m => (
                    <div key={m.id} onClick={() => navigate(`/match/${m.id}`)}
                      className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-1.5 py-1.5 cursor-pointer transition-all duration-150">
                      <p className="text-green-400 text-xs font-bold text-center mb-0.5">
                        {new Date(m.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-white text-xs text-center leading-tight font-medium">{getEquipeName(m.Equipe1_id)}</p>
                      <p className="text-white/30 text-xs text-center">vs</p>
                      <p className="text-white text-xs text-center leading-tight font-medium">{getEquipeName(m.Equipe2_id)}</p>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Notre calendrier sur la page calendrier
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)
  const selectedMatchs = getMatchsForDate(matchs, selectedDate)

  return (
    <div className="relative w-full min-h-screen">
      <Sidebar />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/Pelouse.png" alt="background" className="fixed w-full h-full object-cover brightness-70" />
      </div>
      <div className="relative z-10 ml-16 p-8">
        <p className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-4">Calendrier</p>
        <div className="flex gap-4 items-start">
          <div className="flex-1 backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
              <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) } else setCurrentMonth(m => m - 1) }}
                className="text-white/60 hover:text-white transition-all duration-150 text-2xl">
                <FaArrowAltCircleLeft />
              </button>
              <span className="text-white font-bold text-xl tracking-widest uppercase">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) } else setCurrentMonth(m => m + 1) }}
                className="text-white/60 hover:text-white transition-all duration-150 text-2xl">
                <FaArrowAltCircleRight />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 mb-3">
                {DAYS_LONG.map(d => (
                  <div key={d} className="text-center text-xs font-bold tracking-widest text-white/30 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />
                  const date = new Date(currentYear, currentMonth, day)
                  const isToday = date.toDateString() === today.toDateString()
                  const isSelected = date.toDateString() === selectedDate.toDateString()
                  const hasMatchs = getMatchsForDate(matchs, date).length > 0
                  return (
                    <div key={i} onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer text-sm font-medium transition-all duration-150
                        ${isSelected ? 'bg-white text-gray-900 font-bold shadow-lg' : ''}
                        ${isToday && !isSelected ? 'bg-white/20 text-white font-bold ring-1 ring-white/40' : ''}
                        ${!isSelected && !isToday ? 'hover:bg-white/10 text-white/70' : ''}`}>
                      {day}
                      {hasMatchs && <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-gray-900' : 'bg-green-400'}`} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="w-72 backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl p-5 self-stretch">
            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
              {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {selectedMatchs.length === 0 ? (
              <p className="text-center text-white/20 text-sm italic py-6">Aucun match prévu ce jour</p>
            ) : (
              <div className="space-y-2">
                {selectedMatchs.map(m => (
                  <div key={m.id} onClick={() => navigate(`/match/${m.id}`)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 cursor-pointer transition-all duration-150 hover:translate-x-1">
                    <div className="text-white font-bold text-sm mb-1">
                      {new Date(m.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-white/80 text-sm">
                      {getEquipeName(m.Equipe1_id)}<span className="text-green-400 mx-1 text-xs font-bold">VS</span>{getEquipeName(m.Equipe2_id)}
                    </div>
                    <div className="text-white/30 text-xs mt-1">{m.lieu}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar