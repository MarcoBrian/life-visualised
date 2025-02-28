# LIFE VISUALISED

## Description
LIFE VISUALISED is a React application that allows users to visualize their journey through time. By selecting their birthdate and country of residence, users can see how long they have lived and compare it with the life expectancy in their country. The application presents a grid-based visualization where each block represents a year of life.

## Features
- **Animated Background Paths**: Uses Framer Motion to create subtle animated SVG paths for a dynamic background.
- **Date Selection**: Custom dropdowns for selecting birthdate (year, month, day).
- **Country Selection**: Dropdown to select a country, displaying its life expectancy.
- **Time Alive Calculation**: Calculates and displays the user's age in years, months, and days.
- **Life Grid Visualization**: A 10x10 grid where each block represents one year of life:
  - **Orange Blocks**: Years already lived.
  - **Light Orange Block**: Current year.
  - **Gray Blocks**: Future years.
  - **Dark Gray Blocks**: Years beyond life expectancy.
- **Responsive Design**: Fully responsive and mobile-friendly UI.
- **Dark Mode UI**: Built-in dark-themed UI with Tailwind CSS.

## Tech Stack
- **React**: UI framework for building interactive components.
- **Framer Motion**: Animations for floating background paths.
- **React Select**: Custom country selector with flag icons.
- **Tailwind CSS**: Styling for components and responsive design.
- **TypeScript**: Strongly-typed components for improved maintainability.

## Installation & Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/life-visualised.git
   cd life-visualised
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the development server**
   ```sh
   npm run dev
   ```
4. **Build for production**
   ```sh
   npm run build
   ```

## Usage
1. Open the application in your browser.
2. Select your birthdate using the dropdowns.
3. Choose your country from the list.
4. Click "Visualize My Life" to generate the life grid.
5. View your years lived, remaining years, and expected lifespan.
6. Reset the selection to input a different birthdate.

## File Structure
```
📂 life-visualised
├── 📂 src
│   ├── 📜 App.tsx            # Main application logic
│   ├── 📜 countryData.ts      # Country data with flags & life expectancy
│   ├── 📜 index.tsx          # Entry point
│   ├── 📜 styles.css         # Global styles
│   ├── 📂 components
│   │   ├── 📜 BackgroundPaths.tsx   # Animated background paths
│   │   ├── 📜 FloatingPaths.tsx     # SVG animation logic
│   │   ├── 📜 LifeGrid.tsx          # Grid component for life visualization
├── 📜 package.json         # Dependencies & scripts
├── 📜 tsconfig.json        # TypeScript config
├── 📜 tailwind.config.js   # Tailwind CSS config
└── 📜 README.md            # Project documentation
```

## Customization
### Modify Life Expectancy Data
Life expectancy data is stored in `countryData.ts`. You can update or add new countries by modifying this file:
```ts
export const countryData = [
  { code: "US", name: "United States", lifeExpectancy: 78.8, flag: "🇺🇸" },
  { code: "JP", name: "Japan", lifeExpectancy: 84.6, flag: "🇯🇵" },
  // Add more countries here
];
```

### Adjust Animation Settings
Animation durations, path lengths, and opacity changes can be modified inside `FloatingPaths.tsx` within the `motion.path` properties:
```ts
<motion.path
  initial={{ pathLength: 0.3, opacity: 0.6 }}
  animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3] }}
  transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
/>
```

## Contributing
Contributions are welcome! If you find bugs or have suggestions for improvements, feel free to create an issue or submit a pull request.

## License
This project is licensed under the **MIT License**.

---
**Created with ❤️ by Marco**

