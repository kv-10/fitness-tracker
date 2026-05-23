'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, FoodLog, WeightLog, DailyLog, Profile, FavouriteFood } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import {
  Home, Utensils, Scale, BarChart2, Settings,
  Plus, Search, X, Check, ChevronRight,
  Droplets, Footprints, Flame, Zap, Apple,
  LogOut, Camera, Star, BookOpen, Trash2, ChevronDown
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async () => {
    setLoading(true); setMsg('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg(error.message)
      else setMsg('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg(error.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100dvh', padding:'32px 24px' }}>
      <div style={{ marginBottom:48, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🥗</div>
        <h1 style={{ fontSize:28, fontWeight:600, color:'var(--text)' }}>Ketan's Fitness</h1>
        <p style={{ color:'var(--text3)', marginTop:6, fontSize:14 }}>Your personal tracker. No ads. No noise.</p>
      </div>

      <div style={{ width:'100%', maxWidth:360 }}>
        <button className="btn btn-ghost btn-full" onClick={handleGoogle} style={{ marginBottom:16, border:'1px solid var(--border2)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div className="divider" style={{ flex:1, margin:0 }} />
          <span style={{ color:'var(--text3)', fontSize:13 }}>or</span>
          <div className="divider" style={{ flex:1, margin:0 }} />
        </div>

        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ marginBottom:10 }} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{ marginBottom:16 }} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />

        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? <div className="spinner" /> : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        {msg && <p style={{ color: msg.includes('Check') ? 'var(--accent)' : 'var(--red)', fontSize:13, marginTop:12, textAlign:'center' }}>{msg}</p>}

        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text3)' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={()=>setIsSignUp(!isSignUp)} style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:14 }}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

// ─── PROGRESS RING ────────────────────────────────────────────────────────────
function Ring({ value, max, size=120, stroke=8, color='var(--accent)', children }: {
  value:number; max:number; size?:number; stroke?:number; color?:string; children?:React.ReactNode
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circ * (1 - pct)
  return (
    <div className="ring-container" style={{ width:size, height:size }}>
      <svg width={size} height={size} style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border2)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position:'relative', textAlign:'center' }}>{children}</div>
    </div>
  )
}

// ─── FOOD SEARCH SHEET ────────────────────────────────────────────────────────
function FoodSearchSheet({ onAdd, onClose }: { onAdd:(food:Partial<FoodLog>)=>void; onClose:()=>void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [servings, setServings] = useState('1')
  const [mealType, setMealType] = useState<'breakfast'|'lunch'|'dinner'|'snack'>('lunch')

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,brands,nutriments,serving_size,code`)
      const data = await res.json()
      setResults(data.products?.filter((p:any)=>p.product_name && p.nutriments?.['energy-kcal_100g']) || [])
    } catch { setResults([]) }
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 500)
    return () => clearTimeout(t)
  }, [query, search])

  const confirm = () => {
    if (!selected) return
    const s = parseFloat(servings) || 1
    const factor = s / 100
    onAdd({
      food_name: selected.product_name,
      brand: selected.brands,
      barcode: selected.code,
      calories: Math.round((selected.nutriments['energy-kcal_100g'] || 0) * factor),
      protein_g: parseFloat(((selected.nutriments['proteins_100g']||0)*factor).toFixed(1)),
      carbs_g: parseFloat(((selected.nutriments['carbohydrates_100g']||0)*factor).toFixed(1)),
      fat_g: parseFloat(((selected.nutriments['fat_100g']||0)*factor).toFixed(1)),
      serving_size: `${servings}g`,
      servings: s,
      meal_type: mealType,
    })
  }

  return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet fade-in">
        <div className="sheet-handle" />
        <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Add Food</h2>

        {selected ? (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer' }}>← Back</button>
            </div>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:2 }}>{selected.product_name}</p>
            {selected.brands && <p style={{ color:'var(--text3)', fontSize:13, marginBottom:16 }}>{selected.brands}</p>}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
              {[
                ['Cal', Math.round((selected.nutriments['energy-kcal_100g']||0)*(parseFloat(servings)||1)/100), 'var(--yellow)'],
                ['Protein', ((selected.nutriments['proteins_100g']||0)*(parseFloat(servings)||1)/100).toFixed(1)+'g', 'var(--accent)'],
                ['Carbs', ((selected.nutriments['carbohydrates_100g']||0)*(parseFloat(servings)||1)/100).toFixed(1)+'g', 'var(--blue)'],
                ['Fat', ((selected.nutriments['fat_100g']||0)*(parseFloat(servings)||1)/100).toFixed(1)+'g', 'var(--purple)'],
              ].map(([label,val,color])=>(
                <div key={label as string} className="card-sm" style={{ textAlign:'center' }}>
                  <div style={{ fontSize:15, fontWeight:600, color:color as string }}>{val}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>

            <label className="section-label">Serving (grams)</label>
            <input className="input" type="number" value={servings} onChange={e=>setServings(e.target.value)} style={{ marginBottom:12 }} />

            <label className="section-label">Meal</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:20 }}>
              {(['breakfast','lunch','dinner','snack'] as const).map(m=>(
                <button key={m} onClick={()=>setMealType(m)}
                  className={`btn btn-sm meal-${m}`}
                  style={{ opacity: mealType===m ? 1 : 0.4, textTransform:'capitalize', fontSize:12 }}>
                  {m}
                </button>
              ))}
            </div>

            <button className="btn btn-primary btn-full" onClick={confirm}>Add to Log</button>
          </div>
        ) : (
          <div>
            <div style={{ position:'relative', marginBottom:16 }}>
              <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }} />
              <input className="input" placeholder="Search foods..." value={query} onChange={e=>setQuery(e.target.value)}
                style={{ paddingLeft:36 }} autoFocus />
            </div>
            {loading && <div style={{ textAlign:'center', padding:20 }}><div className="spinner" style={{ margin:'0 auto' }} /></div>}
            {results.map((p,i)=>(
              <button key={i} onClick={()=>setSelected(p)}
                style={{ width:'100%', background:'none', border:'none', cursor:'pointer', textAlign:'left', padding:'12px 0', borderBottom:'1px solid var(--border)', color:'var(--text)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontWeight:500, fontSize:14 }}>{p.product_name}</p>
                    {p.brands && <p style={{ color:'var(--text3)', fontSize:12 }}>{p.brands}</p>}
                  </div>
                  <span style={{ color:'var(--yellow)', fontSize:13, fontWeight:600, whiteSpace:'nowrap', marginLeft:8 }}>
                    {Math.round(p.nutriments['energy-kcal_100g'])} cal/100g
                  </span>
                </div>
              </button>
            ))}
            {!loading && query && results.length===0 && (
              <p style={{ color:'var(--text3)', textAlign:'center', padding:20 }}>No results. Try a different search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ userId, profile }: { userId:string; profile:Profile }) {
  const today = new Date().toISOString().split('T')[0]
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [dailyLog, setDailyLog] = useState<DailyLog|null>(null)
  const [weight, setWeight] = useState<WeightLog|null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [foods, daily, w] = await Promise.all([
      supabase.from('food_logs').select('*').eq('user_id', userId).eq('logged_date', today).order('created_at'),
      supabase.from('daily_logs').select('*').eq('user_id', userId).eq('log_date', today).single(),
      supabase.from('weight_logs').select('*').eq('user_id', userId).order('logged_at', {ascending:false}).limit(1).single(),
    ])
    setFoodLogs(foods.data || [])
    setDailyLog(daily.data || null)
    setWeight(w.data || null)
    setLoading(false)
  }, [userId, today])

  useEffect(() => { load() }, [load])

  const totalCals = foodLogs.reduce((s,f)=>s+f.calories,0)
  const totalProtein = foodLogs.reduce((s,f)=>s+(f.protein_g||0),0)
  const totalCarbs = foodLogs.reduce((s,f)=>s+(f.carbs_g||0),0)
  const totalFat = foodLogs.reduce((s,f)=>s+(f.fat_g||0),0)
  const calsLeft = profile.calorie_goal - totalCals

  const addFood = async (food: Partial<FoodLog>) => {
    setShowSearch(false)
    await supabase.from('food_logs').insert({ ...food, user_id: userId, logged_date: today })
    // upsert favourite
    const { data: existing } = await supabase.from('favourite_foods').select('id,log_count').eq('user_id', userId).eq('food_name', food.food_name!).single()
    if (existing) {
      await supabase.from('favourite_foods').update({ log_count: existing.log_count+1 }).eq('id', existing.id)
    } else {
      await supabase.from('favourite_foods').insert({ ...food, user_id: userId })
    }
    load()
  }

  const deleteFood = async (id: string) => {
    await supabase.from('food_logs').delete().eq('id', id)
    load()
  }

  const logWeight = async () => {
    const kg = parseFloat(weightInput)
    if (!kg) return
    await supabase.from('weight_logs').insert({ user_id: userId, logged_date: today, weight_kg: kg })
    setShowWeightModal(false); setWeightInput('')
    load()
  }

  const updateWater = async (delta: number) => {
    const current = dailyLog?.water_glasses || 0
    const next = Math.max(0, current + delta)
    if (dailyLog) {
      await supabase.from('daily_logs').update({ water_glasses: next }).eq('id', dailyLog.id)
    } else {
      await supabase.from('daily_logs').insert({ user_id: userId, log_date: today, water_glasses: next })
    }
    load()
  }

  const mealGroups = ['breakfast','lunch','dinner','snack'].map(m=>({
    type: m, foods: foodLogs.filter(f=>f.meal_type===m)
  })).filter(g=>g.foods.length>0)

  const ungrouped = foodLogs.filter(f=>!f.meal_type)

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner" /></div>

  return (
    <div className="fade-in">
      {/* Date */}
      <div style={{ marginBottom:20 }}>
        <p style={{ color:'var(--text3)', fontSize:13 }}>
          {new Date().toLocaleDateString('en-CA', { weekday:'long', month:'long', day:'numeric' })}
        </p>
        <h1 style={{ fontSize:24, fontWeight:600 }}>Today</h1>
      </div>

      {/* Main calorie ring */}
      <div className="card" style={{ display:'flex', alignItems:'center', gap:24 }}>
        <Ring value={totalCals} max={profile.calorie_goal} size={110} stroke={9} color={calsLeft < 0 ? 'var(--red)' : 'var(--accent)'}>
          <div>
            <div className="mono" style={{ fontSize:22, fontWeight:500, color: calsLeft<0 ? 'var(--red)' : 'var(--text)', lineHeight:1 }}>
              {Math.abs(calsLeft)}
            </div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>
              {calsLeft < 0 ? 'over' : 'left'}
            </div>
          </div>
        </Ring>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--text3)' }}>Eaten</div>
              <div className="mono" style={{ fontSize:18, fontWeight:500 }}>{totalCals}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'var(--text3)' }}>Goal</div>
              <div className="mono" style={{ fontSize:18, fontWeight:500 }}>{profile.calorie_goal}</div>
            </div>
          </div>
          {/* Macro bars */}
          {[
            { label:'Protein', val:totalProtein, goal:profile.protein_goal, color:'var(--accent)' },
            { label:'Carbs', val:totalCarbs, goal:profile.carbs_goal, color:'var(--blue)' },
            { label:'Fat', val:totalFat, goal:profile.fat_goal, color:'var(--purple)' },
          ].map(m=>(
            <div key={m.label} style={{ marginBottom:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text3)', marginBottom:2 }}>
                <span>{m.label}</span>
                <span>{Math.round(m.val)}g / {m.goal}g</span>
              </div>
              <div style={{ height:4, background:'var(--border2)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(m.val/m.goal*100,100)}%`, background:m.color, borderRadius:4, transition:'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps + Water + Weight row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12 }}>
        <div className="card" style={{ padding:14, textAlign:'center' }}>
          <Footprints size={18} color="var(--yellow)" style={{ margin:'0 auto 4px' }} />
          <div className="mono" style={{ fontSize:16, fontWeight:500 }}>{(dailyLog?.steps||0).toLocaleString()}</div>
          <div style={{ fontSize:10, color:'var(--text3)' }}>/ {profile.step_goal.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding:14, textAlign:'center' }}>
          <Droplets size={18} color="var(--blue)" style={{ margin:'0 auto 4px' }} />
          <div className="mono" style={{ fontSize:16, fontWeight:500 }}>{dailyLog?.water_glasses||0}</div>
          <div style={{ fontSize:10, color:'var(--text3)' }}>glasses</div>
          <div style={{ display:'flex', gap:4, justifyContent:'center', marginTop:6 }}>
            <button onClick={()=>updateWater(-1)} className="btn btn-ghost btn-sm" style={{ padding:'2px 8px', fontSize:16 }}>−</button>
            <button onClick={()=>updateWater(1)} className="btn btn-ghost btn-sm" style={{ padding:'2px 8px', fontSize:16 }}>+</button>
          </div>
        </div>
        <button onClick={()=>setShowWeightModal(true)} className="card" style={{ padding:14, textAlign:'center', border:'1px solid var(--border)', background:'var(--bg2)', cursor:'pointer' }}>
          <Scale size={18} color="var(--purple)" style={{ margin:'0 auto 4px' }} />
          <div className="mono" style={{ fontSize:16, fontWeight:500 }}>{weight ? `${weight.weight_kg}` : '—'}</div>
          <div style={{ fontSize:10, color:'var(--text3)' }}>kg</div>
        </button>
      </div>

      {/* Food log */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <h2 style={{ fontSize:16, fontWeight:600 }}>Food Log</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowSearch(true)}>
          <Plus size={14} /> Add
        </button>
      </div>

      {foodLogs.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:32, color:'var(--text3)' }}>
          <Apple size={28} style={{ margin:'0 auto 8px', opacity:0.4 }} />
          <p style={{ fontSize:14 }}>No food logged yet</p>
          <p style={{ fontSize:12, marginTop:4 }}>Tap Add to get started</p>
        </div>
      )}

      {mealGroups.map(group=>(
        <div key={group.type} style={{ marginBottom:16 }}>
          <div className={`tag meal-${group.type}`} style={{ marginBottom:8, textTransform:'capitalize', fontSize:11, fontWeight:600, letterSpacing:'0.05em' }}>
            {group.type}
          </div>
          {group.foods.map(food=>(
            <FoodItem key={food.id} food={food} onDelete={()=>deleteFood(food.id)} />
          ))}
        </div>
      ))}

      {ungrouped.map(food=>(
        <FoodItem key={food.id} food={food} onDelete={()=>deleteFood(food.id)} />
      ))}

      {showSearch && <FoodSearchSheet onAdd={addFood} onClose={()=>setShowSearch(false)} />}

      {showWeightModal && (
        <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&setShowWeightModal(false)}>
          <div className="sheet fade-in" style={{ paddingBottom:32 }}>
            <div className="sheet-handle" />
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Log Weight</h2>
            <input className="input" type="number" step="0.1" placeholder="Weight in kg" value={weightInput}
              onChange={e=>setWeightInput(e.target.value)} style={{ marginBottom:16 }} autoFocus />
            <button className="btn btn-primary btn-full" onClick={logWeight}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

function FoodItem({ food, onDelete }: { food:FoodLog; onDelete:()=>void }) {
  return (
    <div className="card-sm" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:14, fontWeight:500 }}>{food.food_name}</p>
        {food.brand && <p style={{ fontSize:11, color:'var(--text3)' }}>{food.brand} · {food.serving_size}</p>}
      </div>
      <div style={{ textAlign:'right' }}>
        <div className="mono" style={{ fontSize:15, fontWeight:600, color:'var(--yellow)' }}>{food.calories}</div>
        <div style={{ fontSize:10, color:'var(--text3)' }}>P:{food.protein_g}g C:{food.carbs_g}g</div>
      </div>
      <button onClick={onDelete} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:4 }}>
        <X size={14} />
      </button>
    </div>
  )
}

// ─── WEIGHT TAB ───────────────────────────────────────────────────────────────
function WeightTab({ userId }: { userId:string }) {
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [period, setPeriod] = useState<'7'|'30'|'90'|'all'>('30')
  const [showAdd, setShowAdd] = useState(false)
  const [weightInput, setWeightInput] = useState('')

  const load = useCallback(async () => {
    let q = supabase.from('weight_logs').select('*').eq('user_id', userId).order('logged_date')
    if (period !== 'all') {
      const d = new Date(); d.setDate(d.getDate() - parseInt(period))
      q = q.gte('logged_date', d.toISOString().split('T')[0])
    }
    const { data } = await q
    setLogs(data || [])
  }, [userId, period])

  useEffect(() => { load() }, [load])

  const save = async () => {
    const kg = parseFloat(weightInput)
    if (!kg) return
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('weight_logs').insert({ user_id: userId, logged_date: today, weight_kg: kg })
    setShowAdd(false); setWeightInput(''); load()
  }

  const chartData = logs.map(l=>({ date: l.logged_date.slice(5), weight: l.weight_kg }))
  const minW = logs.length ? Math.min(...logs.map(l=>l.weight_kg)) - 1 : 0
  const maxW = logs.length ? Math.max(...logs.map(l=>l.weight_kg)) + 1 : 100
  const diff = logs.length >= 2 ? (logs[logs.length-1].weight_kg - logs[0].weight_kg) : null

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:600 }}>Weight</h1>
          {diff !== null && (
            <p style={{ fontSize:13, color: diff < 0 ? 'var(--accent)' : diff > 0 ? 'var(--red)' : 'var(--text3)', marginTop:2 }}>
              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg this period
            </p>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}><Plus size={14} /> Log</button>
      </div>

      {/* Period picker */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {(['7','30','90','all'] as const).map(p=>(
          <button key={p} onClick={()=>setPeriod(p)}
            className="btn btn-sm"
            style={{ flex:1, background: period===p ? 'var(--accent)' : 'var(--bg3)', color: period===p ? '#0a0a0f' : 'var(--text3)', border:'1px solid var(--border)' }}>
            {p==='all' ? 'All' : `${p}d`}
          </button>
        ))}
      </div>

      {logs.length >= 2 ? (
        <div className="card" style={{ padding:'20px 8px 12px' }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis domain={[minW, maxW]} tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:8, color:'var(--text)', fontSize:13 }}
                formatter={(v:any)=>[`${v} kg`, 'Weight']} />
              <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r:4, fill:'var(--accent)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="card" style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
          <Scale size={28} style={{ margin:'0 auto 8px', opacity:0.4 }} />
          <p>Log at least 2 entries to see your chart</p>
        </div>
      )}

      <h2 style={{ fontSize:16, fontWeight:600, margin:'20px 0 10px' }}>History</h2>
      {[...logs].reverse().map(l=>(
        <div key={l.id} className="card-sm" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <span style={{ color:'var(--text3)', fontSize:14 }}>{l.logged_date}</span>
          <span className="mono" style={{ fontSize:17, fontWeight:600 }}>{l.weight_kg} kg</span>
        </div>
      ))}

      {showAdd && (
        <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="sheet fade-in">
            <div className="sheet-handle" />
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>Log Weight</h2>
            <input className="input" type="number" step="0.1" placeholder="Weight in kg" value={weightInput}
              onChange={e=>setWeightInput(e.target.value)} autoFocus style={{ marginBottom:16 }} />
            <button className="btn btn-primary btn-full" onClick={save}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────
function HistoryTab({ userId, profile }: { userId:string; profile:Profile }) {
  const [weeks, setWeeks] = useState<{date:string; cals:number; steps:number; hitCal:boolean; hitSteps:boolean}[]>([])

  useEffect(() => {
    const load = async () => {
      const days: typeof weeks = []
      for (let i = 27; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        const date = d.toISOString().split('T')[0]
        const [foods, daily] = await Promise.all([
          supabase.from('food_logs').select('calories').eq('user_id', userId).eq('logged_date', date),
          supabase.from('daily_logs').select('steps').eq('user_id', userId).eq('log_date', date).single(),
        ])
        const cals = (foods.data||[]).reduce((s:number,f:any)=>s+f.calories,0)
        const steps = daily.data?.steps || 0
        days.push({ date, cals, steps, hitCal: cals > 0 && cals <= profile.calorie_goal, hitSteps: steps >= profile.step_goal })
      }
      setWeeks(days)
    }
    load()
  }, [userId, profile])

  const dayLabels = ['S','M','T','W','T','F','S']

  return (
    <div className="fade-in">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:600 }}>History</h1>
        <p style={{ color:'var(--text3)', fontSize:13, marginTop:4 }}>Last 28 days</p>
      </div>

      <div className="card" style={{ marginBottom:16 }}>
        <p className="section-label" style={{ marginBottom:12 }}>Goal Grid</p>
        <div style={{ display:'flex', gap:4, marginBottom:6 }}>
          {dayLabels.map((d,i)=><div key={i} style={{ flex:1, textAlign:'center', fontSize:9, color:'var(--text3)', fontWeight:600 }}>{d}</div>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {weeks.map((day)=>{
            const both = day.hitCal && day.hitSteps
            const one = day.hitCal || day.hitSteps
            const bg = both ? 'var(--accent)' : one ? 'var(--yellow)' : day.cals > 0 ? 'var(--red-dim)' : 'var(--border)'
            const border = both ? 'var(--accent2)' : one ? 'var(--yellow)' : 'transparent'
            return (
              <div key={day.date} title={`${day.date}: ${day.cals} cal, ${day.steps} steps`}
                style={{ aspectRatio:'1', borderRadius:6, background:bg, border:`1px solid ${border}` }} />
            )
          })}
        </div>
        <div style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap' }}>
          {[['var(--accent)','Both goals hit'],['var(--yellow)','One goal hit'],['var(--red-dim)','Logged, missed'],['var(--border)','No data']].map(([c,l])=>(
            <div key={l as string} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:c as string }} />
              <span style={{ fontSize:10, color:'var(--text3)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <div className="card">
          <p className="section-label">Diet days</p>
          <p className="mono" style={{ fontSize:28, fontWeight:600, color:'var(--accent)' }}>
            {weeks.filter(d=>d.hitCal).length}
          </p>
          <p style={{ color:'var(--text3)', fontSize:12 }}>of {weeks.filter(d=>d.cals>0).length} logged</p>
        </div>
        <div className="card">
          <p className="section-label">Step days</p>
          <p className="mono" style={{ fontSize:28, fontWeight:600, color:'var(--yellow)' }}>
            {weeks.filter(d=>d.hitSteps).length}
          </p>
          <p style={{ color:'var(--text3)', fontSize:12 }}>of last 28 days</p>
        </div>
      </div>
    </div>
  )
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ profile, onUpdate, onSignOut }: { profile:Profile; onUpdate:(p:Profile)=>void; onSignOut:()=>void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await supabase.from('profiles').update({
      calorie_goal: form.calorie_goal,
      protein_goal: form.protein_goal,
      carbs_goal: form.carbs_goal,
      fat_goal: form.fat_goal,
      step_goal: form.step_goal,
      water_goal: form.water_goal,
    }).eq('id', profile.id)
    onUpdate(form)
    setEditing(false); setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:600 }}>Settings</h1>
        <p style={{ color:'var(--text3)', fontSize:13, marginTop:4 }}>{profile.email}</p>
      </div>

      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <p style={{ fontWeight:600 }}>Daily Goals</p>
          <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {[
          { label:'Calorie Goal', key:'calorie_goal', unit:'kcal' },
          { label:'Protein Goal', key:'protein_goal', unit:'g' },
          { label:'Carbs Goal', key:'carbs_goal', unit:'g' },
          { label:'Fat Goal', key:'fat_goal', unit:'g' },
          { label:'Step Goal', key:'step_goal', unit:'steps' },
          { label:'Water Goal', key:'water_goal', unit:'glasses' },
        ].map(({ label, key, unit })=>(
          <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <label style={{ fontSize:14, color:'var(--text2)' }}>{label}</label>
            {editing ? (
              <input className="input" type="number" value={(form as any)[key]}
                onChange={e=>setForm({...form,[key]:parseInt(e.target.value)||0})}
                style={{ width:100, textAlign:'right', padding:'6px 10px' }} />
            ) : (
              <span className="mono" style={{ color:'var(--text)', fontWeight:500 }}>{(form as any)[key]} {unit}</span>
            )}
          </div>
        ))}

        {editing && (
          <button className="btn btn-primary btn-full" onClick={save} style={{ marginTop:8 }}>
            {saved ? <><Check size={14}/> Saved</> : 'Save Goals'}
          </button>
        )}
        {saved && !editing && <p style={{ color:'var(--accent)', fontSize:13, textAlign:'center' }}>Goals updated</p>}
      </div>

      <div className="card" style={{ marginBottom:16 }}>
        <p style={{ fontWeight:600, marginBottom:12 }}>Steps Webhook</p>
        <p style={{ fontSize:13, color:'var(--text3)', marginBottom:8 }}>Use Apple Shortcuts to auto-sync your steps. Send a POST request to:</p>
        <div className="card-sm" style={{ fontFamily:'DM Mono', fontSize:11, wordBreak:'break-all', color:'var(--accent)', marginBottom:8 }}>
          POST https://wtckjljbmmphrzgsjbfj.supabase.co/functions/v1/steps-webhook
        </div>
        <p style={{ fontSize:12, color:'var(--text3)' }}>Body: {`{ "user_id": "${profile.id}", "steps": 8000 }`}</p>
      </div>

      <button className="btn btn-ghost btn-full" onClick={onSignOut} style={{ border:'1px solid var(--border2)', color:'var(--red)' }}>
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User|null>(null)
  const [profile, setProfile] = useState<Profile|null>(null)
  const [tab, setTab] = useState<'home'|'weight'|'history'|'settings'>('home')
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setAuthLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
    setAuthLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setTab('home')
  }

  if (authLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div className="spinner" style={{ width:32, height:32, borderWidth:3 }} />
    </div>
  )

  if (!user || !profile) return <AuthScreen />

  const tabs = [
    { id:'home', label:'Today', icon: Home },
    { id:'weight', label:'Weight', icon: Scale },
    { id:'history', label:'History', icon: BarChart2 },
    { id:'settings', label:'Settings', icon: Settings },
  ] as const

  return (
    <div className="app-shell">
      <div className="page-content">
        {tab === 'home' && <HomeTab userId={user.id} profile={profile} />}
        {tab === 'weight' && <WeightTab userId={user.id} />}
        {tab === 'history' && <HistoryTab userId={user.id} profile={profile} />}
        {tab === 'settings' && <SettingsTab profile={profile} onUpdate={setProfile} onSignOut={signOut} />}
      </div>

      <nav className="bottom-nav">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${tab===id?'active':''}`} onClick={()=>setTab(id)}>
            <Icon />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
