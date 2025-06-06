/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Tabsverse Brand Colors (From Logo)
        brand: {
          'pink': '#af0946',        // Deep Pink/Magenta - Primary accent
          'navy': '#000d85',        // Deep Navy Blue - Primary brand
          'blue': '#31a9d6',        // Bright Blue - Secondary accent
          'orange': '#dc8c35',      // Orange/Gold - Warm accent
          'pink-light': '#e682ad',  // Light Pink - Soft accent
          // Darker variations for hover states
          'pink-dark': '#8b073a',   // Darker pink for hover
          'navy-dark': '#000a6b',   // Darker navy for hover
          'blue-dark': '#2889b8',   // Darker blue for hover
          'orange-dark': '#b8711d', // Darker orange for hover
        },
        // Essential Neutrals for UI
        neutral: {
          50: '#f8f9fa',   // Light gray backgrounds
          100: '#e9ecef',  // Border gray
          200: '#dee2e6',  // Subtle borders
          300: '#ced4da',  // Form borders
          400: '#adb5bd',  // Placeholder text
          500: '#6c757d',  // Secondary text
          600: '#495057',  // Body text
          700: '#343a40',  // Dark text
          800: '#212529',  // Headings
          900: '#1a1a1a',  // Near black
        },
        // Component Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2B7CE9", // Brand blue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#5A9DF7", // Brand light blue  
          foreground: "#0B1426", // Brand deep blue
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#00D4FF", // Brand cyan
          foreground: "#0B1426", // Brand deep blue
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}
