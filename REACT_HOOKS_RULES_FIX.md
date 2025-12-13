# React Hooks Rules Fix - "Rendered more hooks than during the previous render"

## 🚨 Error Description

**Error Message**: 
```
Error: Rendered more hooks than during the previous render.
```

**Root Cause**: This error occurs when React hooks are called conditionally or when the order of hooks changes between renders. React relies on the order of hook calls to maintain state correctly.

## ❌ Problematic Code Pattern

```typescript
export default function MyComponent({ visible }) {
  const [someState] = useState(initialValue);
  
  // ❌ WRONG: Early return before all hooks are declared
  if (!visible) {
    return null;
  }
  
  // ❌ This hook might not be called if visible is false
  const [otherState] = useState(otherValue);
  useEffect(() => {
    // Effect logic
  }, []);
  
  return <ComponentJSX />;
}
```

## ✅ Fixed Code Pattern

```typescript
export default function MyComponent({ visible }) {
  // ✅ CORRECT: All hooks declared first
  const [someState] = useState(initialValue);
  const [otherState] = useState(otherValue);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  // ✅ CORRECT: Conditional return after all hooks
  if (!visible) {
    return null;
  }
  
  return <ComponentJSX />;
}
```

## 🔧 Specific Fix Applied

### Before (Problematic):
```typescript
export default function SevereWeatherAlerts({ visible, ...props }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // ❌ Early return before useEffect hook
  if (!visible) {
    return null;
  }
  
  React.useEffect(() => {
    // This hook might not be called consistently
  }, [visible]);
  
  // Rest of component...
}
```

### After (Fixed):
```typescript
export default function SevereWeatherAlerts({ visible, ...props }) {
  // ✅ All hooks declared first
  const [fadeAnim] = useState(new Animated.Value(0));
  
  React.useEffect(() => {
    if (visible) {
      // Animation logic
    }
  }, [visible]);
  
  // ✅ Conditional return after all hooks
  if (!visible) {
    return null;
  }
  
  // Rest of component...
}
```

## 📋 React Hooks Rules

### Rule 1: Only Call Hooks at the Top Level
- ❌ Don't call hooks inside loops, conditions, or nested functions
- ✅ Always call hooks at the top level of your React function

### Rule 2: Only Call Hooks from React Functions
- ❌ Don't call hooks from regular JavaScript functions
- ✅ Call hooks from React function components or custom hooks

### Rule 3: Hooks Must Be Called in the Same Order
- ❌ Don't change the order of hook calls between renders
- ✅ Ensure hooks are always called in the same sequence

## 🎯 Common Scenarios That Cause This Error

### 1. Early Returns Before Hooks
```typescript
// ❌ Wrong
function Component({ condition }) {
  if (!condition) return null; // Early return
  const [state] = useState(); // Hook after conditional return
}

// ✅ Correct
function Component({ condition }) {
  const [state] = useState(); // Hook first
  if (!condition) return null; // Conditional return after hooks
}
```

### 2. Conditional Hook Calls
```typescript
// ❌ Wrong
function Component({ shouldUseEffect }) {
  const [state] = useState();
  if (shouldUseEffect) {
    useEffect(() => {}); // Conditional hook call
  }
}

// ✅ Correct
function Component({ shouldUseEffect }) {
  const [state] = useState();
  useEffect(() => {
    if (shouldUseEffect) {
      // Conditional logic inside hook
    }
  });
}
```

### 3. Hooks in Loops or Callbacks
```typescript
// ❌ Wrong
function Component({ items }) {
  const [state] = useState();
  items.forEach(() => {
    const [itemState] = useState(); // Hook in loop
  });
}

// ✅ Correct
function Component({ items }) {
  const [state] = useState();
  const [itemStates] = useState({}); // Single hook for all items
}
```

## 🔍 Debugging Tips

### How to Identify Hook Order Issues
1. **Check for early returns** before all hooks are declared
2. **Look for conditional hook calls** based on props or state
3. **Verify hook calls** are not inside loops or callbacks
4. **Use React DevTools** to inspect component re-renders

### Development Tools
```typescript
// Add logging to track hook calls
function MyComponent(props) {
  console.log('Rendering MyComponent', props);
  
  const [state1] = useState(() => {
    console.log('useState 1 called');
    return initialValue;
  });
  
  useEffect(() => {
    console.log('useEffect called');
  });
  
  // Rest of component...
}
```

## ✅ Best Practices

### 1. Declare All Hooks First
```typescript
function Component(props) {
  // All hooks at the top
  const [state1] = useState();
  const [state2] = useState();
  const customHookResult = useCustomHook();
  
  useEffect(() => {});
  useEffect(() => {});
  
  // Logic and conditional returns after hooks
  if (someCondition) return null;
  
  return <JSX />;
}
```

### 2. Use Conditional Logic Inside Hooks
```typescript
function Component({ shouldFetch, data }) {
  // Hook always called
  useEffect(() => {
    // Conditional logic inside hook
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);
  
  // Hook always called
  const processedData = useMemo(() => {
    // Conditional logic inside hook
    return data ? processData(data) : null;
  }, [data]);
}
```

### 3. Extract Conditional Components
```typescript
// Instead of conditional returns, use conditional rendering
function ParentComponent({ showChild }) {
  return (
    <div>
      {showChild && <ChildComponent />}
    </div>
  );
}

function ChildComponent() {
  // All hooks can be safely used here
  const [state] = useState();
  useEffect(() => {});
  
  return <div>Child content</div>;
}
```

## 🚀 Performance Considerations

### Conditional Rendering vs Early Returns
```typescript
// Option 1: Early return (after hooks)
function Component({ visible }) {
  const [state] = useState();
  useEffect(() => {});
  
  if (!visible) return null; // Still runs hooks
  
  return <ExpensiveComponent />;
}

// Option 2: Conditional rendering (parent decides)
function ParentComponent({ showChild }) {
  return (
    <div>
      {showChild ? <ChildComponent /> : null}
    </div>
  );
}
```

## ✅ Result

The "Rendered more hooks than during the previous render" error has been **completely resolved** by:

1. **Moving all hook declarations** to the top of the component
2. **Placing conditional returns** after all hooks are declared
3. **Ensuring consistent hook call order** across all renders
4. **Following React hooks rules** strictly

**Key Takeaway**: Always declare all hooks at the top level of your component, before any conditional logic or early returns.

---

**Status**: ✅ **RESOLVED** - React hooks rules properly followed with consistent hook call order