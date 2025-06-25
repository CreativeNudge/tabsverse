# Incident Report: June 7, 2025 - API Catastrophe

## 📊 **INCIDENT SUMMARY**

**Time**: June 7, 2025, ~4:00 PM  
**Duration**: ~1 hour  
**Impact**: 21,170+ API requests to Supabase  
**Cause**: Infinite loop in authentication provider  
**Status**: RESOLVED - Complete API shutdown implemented  

### **Damage Metrics**
- **Total Requests**: 21,170+
- **Token Refreshes**: 20,631+
- **Rate Limit**: Completely exceeded
- **Development**: Blocked for 1+ hours
- **Application**: Completely unusable

## 🔍 **ROOT CAUSE ANALYSIS**

### **Primary Cause: Broken AuthProvider Foundation**
The AuthProvider was fundamentally broken BEFORE today's development session:

```typescript
// BROKEN PATTERN (was already in codebase):
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient() // ❌ NEW CLIENT EVERY RENDER!
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
    return () => subscription.unsubscribe()
  }, []) // ❌ MISSING supabase dependency
}
```

**Problem**: 
1. `createClient()` called on every component render
2. New auth listener created every render
3. Old listeners never properly cleaned up
4. Exponential growth: 1 → 2 → 4 → 8 → 16 → 32 → ... → 21,170

### **Trigger: Reactive API Hooks**
Today we added hooks that were reactive to the broken auth:

```typescript
// TRIGGER PATTERN (added today):
export function useCurations() {
  const { user } = useAuth() // ❌ user object recreated constantly
  
  useEffect(() => {
    fetchUserData() // API CALL
  }, [user?.id]) // ❌ Fires constantly due to broken auth
}
```

### **Perfect Storm Sequence**
1. AuthProvider creates multiple listeners (pre-existing bug)
2. Each auth state change fires ALL listeners
3. user object gets recreated constantly  
4. useCurations sees "new" user and makes API call
5. API call triggers auth refresh
6. Auth refresh fires all listeners again
7. **INFINITE EXPONENTIAL LOOP**

## 🚨 **WHAT WENT WRONG - DETAILED TIMELINE**

### **Pre-Existing Issues (Silent Time Bombs)**
- ✅ AuthProvider had unstable client creation
- ✅ Auth listeners were multiplying on every render
- ✅ No rate limiting or circuit breakers
- ✅ No API call monitoring
- ✅ No safeguards against runaway loops

### **Today's Changes (Triggers)**
- ✅ Added `useCurations` hook with reactive API calls
- ✅ Added `useUserStats` hook with reactive API calls
- ✅ Both hooks subscribed to constantly-changing user object
- ✅ Dashboard component used both hooks simultaneously

### **Catastrophic Escalation**
- 🔥 Dashboard loads → Multiple auth listeners created
- 🔥 Auth state changes → All listeners fire
- 🔥 user object changes → Hooks make API calls
- 🔥 API calls trigger more auth changes
- 🔥 **EXPONENTIAL GROWTH BEGINS**
- 🔥 Rate limits exceeded → Application unusable

## 🛡️ **IMMEDIATE RESPONSE ACTIONS TAKEN**

### **Emergency Shutdown**
1. ✅ Disabled AuthProvider in layout.tsx
2. ✅ Removed all Supabase imports from dashboard
3. ✅ Replaced all API calls with mock data
4. ✅ Commented out all useEffect hooks with API calls
5. ✅ Verified zero API connections

### **Analysis & Documentation**
1. ✅ Identified root cause in AuthProvider
2. ✅ Created comprehensive API safety guidelines
3. ✅ Documented dangerous patterns to avoid
4. ✅ Created incident report (this document)

## 🔄 **SAFE REBUILD STRATEGY**

### **Phase 1: Fix Foundation (AuthProvider)**
**CRITICAL**: Fix the broken auth provider FIRST

```typescript
// ✅ CORRECT AuthProvider Implementation
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // STABLE CLIENT - created once only
  const [supabase] = useState(() => createClient())
  
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔧 AuthProvider: Setting up listener (should see ONCE)')
    
    let mounted = true
    
    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    setupAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      console.log('🔄 Auth state changed:', event)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('🧹 AuthProvider: Cleaning up listener')
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty deps - supabase is stable

  // MEMOIZED VALUE - prevents object recreation
  const value = useMemo(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### **Phase 2: Safe Hook Patterns**
**RULE**: No reactive API calls - manual triggers only

```typescript
// ✅ SAFE useCurations Implementation
export function useCurations() {
  const { user } = useAuth()
  const [curations, setCurations] = useState<CurationWithUser[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [apiCallCount, setApiCallCount] = useState(0)

  // CIRCUIT BREAKER - prevent runaway calls
  const canMakeApiCall = useCallback(() => {
    if (apiCallCount >= 10) {
      console.warn('🚨 Circuit breaker activated - too many API calls')
      return false
    }
    return true
  }, [apiCallCount])

  // MANUAL FETCH - not reactive
  const fetchCurations = useCallback(async () => {
    if (!user?.id || loading || !canMakeApiCall()) return
    
    console.log('📡 API CALL: Fetching curations for user:', user.id)
    setApiCallCount(prev => prev + 1)
    setLoading(true)
    
    try {
      const response = await fetch('/api/curations')
      const result = await response.json()
      setCurations(result.curations || [])
      setInitialized(true)
      console.log('✅ API SUCCESS: Curations fetched')
    } catch (error) {
      console.error('❌ API ERROR:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, loading, canMakeApiCall])

  // ONE-TIME INITIALIZATION ONLY
  useEffect(() => {
    if (user?.id && !initialized && !loading) {
      console.log('🚀 Initial curations fetch')
      fetchCurations()
    }
  }, [user?.id, initialized, loading, fetchCurations])

  // Reset API count every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setApiCallCount(0)
      console.log('🔄 API rate limit reset')
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return {
    curations,
    loading,
    fetchCurations, // Manual trigger only
    canMakeApiCall,
  }
}
```

### **Phase 3: Circuit Breaker System**
**MANDATORY**: Every API function must have rate limiting

```typescript
// ✅ UNIVERSAL CIRCUIT BREAKER
const useApiCircuitBreaker = (maxCallsPerMinute = 10) => {
  const [callCount, setCallCount] = useState(0)
  const [lastReset, setLastReset] = useState(Date.now())

  const canCall = useCallback(() => {
    const now = Date.now()
    
    // Reset every minute
    if (now - lastReset > 60000) {
      setCallCount(0)
      setLastReset(now)
    }
    
    if (callCount >= maxCallsPerMinute) {
      console.error(`🚨 CIRCUIT BREAKER: Exceeded ${maxCallsPerMinute} calls/minute`)
      return false
    }
    
    return true
  }, [callCount, lastReset, maxCallsPerMinute])

  const recordCall = useCallback(() => {
    setCallCount(prev => {
      const newCount = prev + 1
      console.log(`📊 API Call ${newCount}/${maxCallsPerMinute}`)
      
      if (newCount >= maxCallsPerMinute * 0.8) {
        console.warn(`⚠️ Approaching rate limit: ${newCount}/${maxCallsPerMinute}`)
      }
      
      return newCount
    })
  }, [maxCallsPerMinute])

  return { canCall, recordCall, callCount }
}
```

## 🚫 **MANDATORY PREVENTION MEASURES**

### **Code Review Checklist**
Before ANY API-related code is added:

#### **AuthProvider Requirements**
- [ ] ✅ Client created with `useState(() => createClient())`
- [ ] ✅ Auth listener setup has proper cleanup
- [ ] ✅ Context value is memoized
- [ ] ✅ Console logs verify single listener setup
- [ ] ✅ No dependencies that could cause re-creation

#### **Hook Requirements**
- [ ] ✅ No reactive API calls (`useEffect(() => apiCall(), [changingValue])`)
- [ ] ✅ Circuit breaker implemented (max calls per minute)
- [ ] ✅ Console logging for every API call
- [ ] ✅ Manual triggers only (`fetchData()` function)
- [ ] ✅ Loading states prevent duplicate calls
- [ ] ✅ Error handling and recovery

#### **Component Requirements**
- [ ] ✅ No multiple API hooks in same component initially
- [ ] ✅ Test each hook in isolation first
- [ ] ✅ Monitor console and network tab during development
- [ ] ✅ Verify stable user object (not recreating)

### **Development Workflow**
1. **Foundation First**: Fix AuthProvider completely before any API work
2. **One Hook at a Time**: Never add multiple API hooks simultaneously
3. **Test in Isolation**: Each hook tested alone for 10+ minutes
4. **Monitor Everything**: Console logs + network tab + Supabase dashboard
5. **Circuit Breakers**: Rate limiting on every API function
6. **Emergency Stop**: Immediate shutdown procedure if calls spike

### **Early Warning System**
```typescript
// Development-only API monitor
if (process.env.NODE_ENV === 'development') {
  let apiCallCount = 0
  const startTime = Date.now()
  
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    apiCallCount++
    const elapsed = (Date.now() - startTime) / 1000
    const rate = apiCallCount / elapsed
    
    console.log(`📡 API Call #${apiCallCount} (${rate.toFixed(2)}/sec)`)
    
    if (rate > 5) {
      console.error('🚨 EMERGENCY: API rate too high!', { apiCallCount, elapsed, rate })
      alert('DEVELOPMENT EMERGENCY: Too many API calls detected!')
    }
    
    return originalFetch.apply(this, args)
  }
}
```

## 📚 **LESSONS LEARNED**

### **Technical Lessons**
1. **Foundation Matters**: Broken auth provider infected everything
2. **Reactive Patterns Are Dangerous**: `useEffect` with API calls = potential infinite loops
3. **Objects Recreate**: Every render can create new objects, triggering effects
4. **Compounding Effects**: Small bugs become catastrophic when combined
5. **Circuit Breakers Essential**: Must have rate limiting on ALL API functions

### **Process Lessons**
1. **Test Incrementally**: Never add multiple API features simultaneously
2. **Monitor Always**: Console + network tab + provider dashboard
3. **Expect Failures**: Have emergency shutdown procedures ready
4. **Document Everything**: Patterns, anti-patterns, and safeguards
5. **Review Thoroughly**: All API code must be reviewed for safety patterns

### **Development Lessons**
1. **Stable Dependencies**: All useEffect dependencies must be stable
2. **Manual Triggers**: API calls should be user-initiated, not reactive
3. **Memoization Critical**: useMemo/useCallback prevent object recreation
4. **Cleanup Required**: Every listener needs proper cleanup
5. **Logging Essential**: Track every API call in development

## 🎯 **SUCCESS CRITERIA FOR REBUILD**

### **AuthProvider Health Check**
- [ ] ✅ Console shows exactly ONE "Setting up listener" message
- [ ] ✅ No additional listeners created on component re-renders
- [ ] ✅ user object reference stays stable between renders
- [ ] ✅ Zero API calls on component mount/unmount cycles
- [ ] ✅ Auth state changes trigger only expected API calls

### **Hook Safety Verification**
- [ ] ✅ Each hook tested in isolation for 10+ minutes
- [ ] ✅ API call count remains predictable and bounded
- [ ] ✅ Circuit breakers activate when limits approached
- [ ] ✅ Console logs show clear API call patterns
- [ ] ✅ No unexpected re-renders or effect triggers

### **Integration Testing**
- [ ] ✅ Multiple hooks can coexist without interference
- [ ] ✅ User interactions trigger expected API calls only
- [ ] ✅ Page refreshes don't cause API call storms
- [ ] ✅ Network interruptions don't cause infinite retries
- [ ] ✅ Rate limiting prevents runaway scenarios

## 🔮 **FUTURE SAFEGUARDS**

### **Automated Monitoring**
```typescript
// TODO: Implement in next development session
const useApiMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Track all API calls
      // Alert if rate exceeds threshold
      // Automatic shutdown if critical rate reached
    }
  }, [])
}
```

### **Testing Requirements**
```typescript
// TODO: Required tests before any API deployment
describe('API Safety', () => {
  test('AuthProvider creates single listener only')
  test('user object reference remains stable')
  test('Circuit breakers activate at limits')
  test('No infinite loops in hook dependencies')
  test('Manual API triggers work correctly')
})
```

### **Documentation Requirements**
- [ ] Every API pattern documented with safety notes
- [ ] All hooks documented with dependency analysis
- [ ] Circuit breaker patterns standardized
- [ ] Emergency procedures documented and tested

## 💀 **NEVER FORGET**

This incident was caused by seemingly innocent changes that triggered a pre-existing catastrophic bug. The cost:
- **Development time lost**: 2+ hours
- **Supabase credits wasted**: Thousands of unnecessary requests
- **Trust eroded**: In our development process
- **Stress created**: For the entire development session

**Every API call has cost. Every useEffect is a potential infinite loop. Every dependency is a risk.**

**These safeguards are not optional - they are MANDATORY for any future API development.**

---

*This incident report serves as a permanent reminder and reference for safe API development practices. It must be reviewed before any future API work begins.*
