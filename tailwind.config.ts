import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          soft: "hsl(var(--primary-soft))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          soft: "hsl(var(--accent-soft))",
        },
        surface: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        beige: "hsl(var(--beige))",
        semantic: {
          success: "hsl(var(--success))",
          warning: "hsl(var(--warning))",
          danger: "hsl(var(--danger))",
        },
        blush: {
          50: '#FAF6EE',
          100: '#F3E3DA',
          200: '#EBD0C2',
          300: '#DEB5A0',
          400: '#D1967B',
          500: '#C47A5A',
          600: '#B06545',
        },
        lavender: {
          50: '#F7F5FC',
          100: '#EFEBF8',
          200: '#E0D7F2',
          300: '#C7B7E6',
          400: '#A890D7',
          500: '#8A67C5',
          600: '#754EB0',
          700: '#603B94',
          800: '#4D2F77',
          900: '#3D265F',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5EFE0',
          300: '#ECE2CB',
          400: '#DFD1B0',
          500: '#CDBE97',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6EDE4',
          200: '#CFDCCF',
          300: '#AEC3AE',
          400: '#8FAFA0',
          500: '#7A9A7E',
          600: '#668568',
        },
        terracotta: {
          50: '#FBF5F2',
          100: '#F3E3DA',
          200: '#E6C6B5',
          300: '#D5A48C',
          400: '#C47A5A',
          500: '#AC6344',
          600: '#8F4E33',
        }
      },
      fontFamily: {
        serif: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(47, 52, 48, 0.05)",
        card: "0 8px 30px -4px rgba(122, 154, 126, 0.08)",
        glow: "0 0 35px -5px rgba(196, 122, 90, 0.2)",
        dock: "0 10px 40px -10px rgba(47, 52, 48, 0.15)",
      },
      backgroundImage: {
        "warm-glow": "radial-gradient(ellipse at top, rgba(243, 227, 218, 0.6) 0%, rgba(250, 246, 238, 0) 70%)",
        "hero-gradient": "linear-gradient(135deg, rgba(243, 227, 218, 0.7) 0%, rgba(230, 237, 228, 0.5) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
