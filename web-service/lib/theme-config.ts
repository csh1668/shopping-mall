export type ThemeColor = "default" | "green" | "purple" | "blue" | "red"

export const themeColors = {
  default: {
    primary: "222.2 84% 4.9%",
    primaryForeground: "210 40% 98%",
    secondary: "210 40% 96%",
    secondaryForeground: "222.2 84% 4.9%",
  },
  green: {
    primary: "142.1 76.2% 36.3%",
    primaryForeground: "355.7 100% 97.3%",
    secondary: "138.5 76.2% 96.7%",
    secondaryForeground: "142.1 84.2% 14.3%",
  },
  purple: {
    primary: "262.1 83.3% 57.8%",
    primaryForeground: "210 20% 98%",
    secondary: "270 95.2% 95.1%",
    secondaryForeground: "262.1 83.3% 17.8%",
  },
  blue: {
    primary: "221.2 83.2% 53.3%",
    primaryForeground: "210 40% 98%",
    secondary: "214.3 31.8% 91.4%",
    secondaryForeground: "221.2 83.2% 13.3%",
  },
  red: {
    primary: "0 84.2% 60.2%",
    primaryForeground: "210 40% 98%",
    secondary: "0 85.7% 97.3%",
    secondaryForeground: "0 84.2% 20.2%",
  },
}

export function setTheme(color: ThemeColor) {
  const root = document.documentElement
  const colors = themeColors[color]

  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })

  localStorage.setItem("theme-color", color)
}

export function getTheme(): ThemeColor {
  if (typeof window === "undefined") return "default"
  return (localStorage.getItem("theme-color") as ThemeColor) || "default"
}

export function initTheme() {
  const savedTheme = getTheme()
  setTheme(savedTheme)
}
