# API Safety Guidelines - CRITICAL SAFEGUARDS

## 🚨 EMERGENCY PROTOCOL LEARNED FROM JUNE 7, 2025 INCIDENT

### **What Happened:**
- Added curation creation functionality
- Introduced infinite useEffect loop in AuthProvider
- **21,170+ API requests** in one hour
- **Rate limiting hit** - application became unusable
- **Complete development shutdown** required

### **Root Cause:**
```typescript
// DANGEROUS - Creates new Supabase client every render
const supabase = createClient()

// DANGEROUS - Missing stable dependency
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  return () => subscription.unsubscribe()
}, []) // Missing supabase dependency = multiple listeners
```

## 🛡️ MANDATORY API SAFETY RULES

### **Rule 1: Stable Client Creation**
```typescript
// ✅ CORRECT - Client created once
const [supabase] = useState(() => createClient())

// ❌ WRONG - Creates new client every render
const supabase = createClient()
```

### **Rule 2: Proper useEffect Dependencies**
```typescript
// ✅ CORRECT - Empty deps when client is stable
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  return () => subscription.unsubscribe()
}, []) // OK because supabase is stable

// ❌ WRONG - Function recreated every render
const fetchData = () => { /* API call */ }
useEffect(() => {
  fetchData()
}, [fetchData]) // Infinite loop!
```

### **Rule 3: Circuit Breaker Pattern**
```typescript
const [apiCallCount, setApiCallCount] = useState(0)
const [isBlocked, setIsBlocked] = useState(false)

const makeApiCall = async () => {
  if (isBlocked) {
    console.warn('API calls blocked due to excessive usage')
    return
  }
  
  if (apiCallCount > 50) {
    setIsBlocked(true)
    console.error('EMERGENCY: API calls exceeded limit!')
    return
  }
  
  setApiCallCount(prev => prev + 1)
  // Make actual API call...
}
```

### **Rule 4: Development Mode Logging**
```typescript
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 API CALL: Setting up auth listener')
  }
  
  // ... API setup
  
  return () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 CLEANUP: Removing auth listener')
    }
    subscription.unsubscribe()
  }
}, [])
```

## 🚫 DANGEROUS PATTERNS TO AVOID

### **Anti-Pattern 1: Reactive Dependencies**
```typescript
// ❌ NEVER DO THIS
useEffect(() => {
  fetchData()
}, [fetchData, checkLimit, updateState]) // Multiple functions = infinite loop
```

### **Anti-Pattern 2: Object Dependencies**
```typescript
// ❌ NEVER DO THIS
useEffect(() => {
  fetchUserData()
}, [user]) // user object recreated = infinite calls
```

### **Anti-Pattern 3: Nested API Calls**
```typescript
// ❌ NEVER DO THIS
useEffect(() => {
  fetchUser().then(user => {
    fetchProfile(user.id).then(profile => {
      fetchStats(profile.id) // Nested calls = exponential growth
    })
  })
}, [])
```

## ✅ SAFE PATTERNS TO FOLLOW

### **Pattern 1: Manual Triggers Only**
```typescript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)

const handleLoadData = useCallback(async () => {
  if (loading) return // Prevent double calls
  
  setLoading(true)
  try {
    const result = await fetchData()
    setData(result)
  } finally {
    setLoading(false)
  }
}, [loading])

// Trigger manually, not reactively
<button onClick={handleLoadData}>Load Data</button>
```

### **Pattern 2: Cached Results**
```typescript
const [cache, setCache] = useState(new Map())

const fetchWithCache = async (key) => {
  if (cache.has(key)) {
    return cache.get(key)
  }
  
  const result = await apiCall(key)
  setCache(prev => new Map(prev).set(key, result))
  return result
}
```

### **Pattern 3: Request Deduplication**
```typescript
const [pendingRequests, setPendingRequests] = useState(new Set())

const deduplicatedFetch = async (url) => {
  if (pendingRequests.has(url)) {
    return // Request already in progress
  }
  
  setPendingRequests(prev => new Set(prev).add(url))
  try {
    return await fetch(url)
  } finally {
    setPendingRequests(prev => {
      const newSet = new Set(prev)
      newSet.delete(url)
      return newSet
    })
  }
}
```

## 🔍 DEBUGGING CHECKLIST

### **Before Adding ANY API Functionality:**
- [ ] Is the client creation stable? (useState or useMemo)
- [ ] Are useEffect dependencies minimal and stable?
- [ ] Is there proper cleanup in useEffect return?
- [ ] Are there console.logs for debugging?
- [ ] Is there a circuit breaker for runaway calls?
- [ ] Are API calls triggered manually, not reactively?

### **Signs of Infinite Loop:**
- 🚨 Console logs repeating rapidly
- 🚨 Network tab showing hundreds of requests
- 🚨 React DevTools showing constant re-renders
- 🚨 Browser becoming unresponsive
- 🚨 Supabase usage dashboard spiking

### **Emergency Response:**
1. **Immediate**: Comment out all useEffect hooks with API calls
2. **Secondary**: Replace reactive patterns with manual triggers
3. **Verification**: Monitor console and network tab for 5 minutes
4. **Recovery**: Gradually re-enable features with proper safeguards

## 📚 REQUIRED READING

### **React Patterns Documentation:**
- [useEffect dependency arrays](https://react.dev/reference/react/useEffect#specifying-reactive-dependencies)
- [useCallback for stable functions](https://react.dev/reference/react/useCallback)
- [Custom hooks best practices](https://react.dev/learn/reusing-logic-with-custom-hooks)

### **Supabase Patterns:**
- [Client initialization best practices](https://supabase.com/docs/reference/javascript/initializing)
- [Auth listener management](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## 🎯 SUCCESS CRITERIA

### **API calls should be:**
- **Predictable**: Each user action = max 1-2 API calls
- **Logged**: Console shows exactly what's happening
- **Limited**: Built-in safeguards prevent runaway calls
- **Cached**: Repeated requests use cached data
- **Manual**: Triggered by user actions, not reactive updates

### **Development workflow:**
- **Monitor**: Always watch console and network tab
- **Verify**: Test each API feature in isolation
- **Document**: Every API pattern explained in code comments
- **Review**: All API code reviewed for safety patterns

## 💀 NEVER AGAIN

This incident cost development time, Supabase credits, and nearly broke the application. These safeguards are **non-negotiable** for any future API work.

**Remember: Every API call has cost. Every useEffect is a potential infinite loop. Every dependency is a risk.**
