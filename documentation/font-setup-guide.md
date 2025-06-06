# Galano Grotesque Font Setup Guide

## Step 1: Purchase and Download Font

### Recommended Purchase Options:
1. **Studio René Bieder (Official)**: https://rene-bieder.com
   - Most comprehensive, direct from designer
   - 42 styles available, starts at $30
   
2. **MyFonts**: https://myfonts.com/search/galano-grotesque
   - Established font retailer
   - Often has sales and bundles

3. **Fonts.com**: Adobe's font service
   - May be included with Creative Cloud

### Recommended Weights to Purchase:
- **Regular (400)** - Body text
- **Medium (500)** - UI elements, buttons  
- **Bold (700)** - Headings, emphasis

## Step 2: Convert and Organize Font Files

### Convert to Web Formats:
Use a tool like **FontSquirrel Webfont Generator**:
1. Upload your .otf/.ttf files
2. Download optimized .woff2 and .woff files
3. These are smaller and optimized for web

### File Organization:
```
tabsverse/
├── public/
│   └── fonts/
│       ├── GalanoGrotesque-Regular.woff2
│       ├── GalanoGrotesque-Regular.woff
│       ├── GalanoGrotesque-Medium.woff2
│       ├── GalanoGrotesque-Medium.woff
│       ├── GalanoGrotesque-Bold.woff2
│       └── GalanoGrotesque-Bold.woff
```

## Step 3: Implementation

### Add to globals.css:
```css
/* Add to app/globals.css */
@font-face {
  font-family: 'Galano Grotesque';
  src: url('/fonts/GalanoGrotesque-Regular.woff2') format('woff2'),
       url('/fonts/GalanoGrotesque-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Galano Grotesque';
  src: url('/fonts/GalanoGrotesque-Medium.woff2') format('woff2'),
       url('/fonts/GalanoGrotesque-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Galano Grotesque';
  src: url('/fonts/GalanoGrotesque-Bold.woff2') format('woff2'),
       url('/fonts/GalanoGrotesque-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Update layout.tsx:
```typescript
// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Tabsverse - Your Digital World, Curated by You',
  description: 'Organize, access, and share your web discoveries across devices and with your community.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-galano">{children}</body>
    </html>
  )
}
```

### Update Tailwind Config:
```javascript
// tailwind.config.js
module.exports = {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        'galano': ['Galano Grotesque', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      // ... other theme extensions
    },
  },
}
```

## Step 4: Usage Examples

```jsx
// Headings
<h1 className="font-galano font-bold text-4xl">Tabsverse</h1>

// Body text  
<p className="font-galano font-normal text-base">Your digital world, curated by you</p>

// UI elements
<button className="font-galano font-medium">Get Started</button>
```

## Alternative: Temporary Fallback

If you want to see the design in action before purchasing:

### Use a Similar Google Font:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-galano' // Map to same CSS variable
})

// Then use className={inter.variable} on body
```

This will give you a similar modern sans-serif look while you set up the official font.

## Performance Notes

- **font-display: swap** prevents invisible text during font load
- **.woff2** is the most compressed format (use first)
- **Preload critical fonts** for better performance:

```html
<!-- Add to <head> if needed -->
<link rel="preload" href="/fonts/GalanoGrotesque-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

## Legal Considerations

- ✅ **Web License**: Make sure your purchase includes web/digital rights
- ✅ **Domain License**: Some licenses are per-domain
- ✅ **Traffic Limits**: Check if there are pageview restrictions

**Galano Grotesque will perfectly complete your brand identity - it's the exact match your designers intended!**
