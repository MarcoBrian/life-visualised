import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { countryData } from './countryData';

// Define types for country data
type Country = {
  code: string;
  name: string;
  lifeExpectancy: number;
  flag: string;
};

type SelectOption = {
  value: string;
  label: React.ReactNode;
  data: Country;
};

/* 
  1) FloatingPaths component
  --------------------------------
  Renders multiple <path> elements with 
  subtle animations via Framer Motion.
*/
function FloatingPaths({ position }: { position: number }) {
  // Generate 36 paths, each with a unique "d" attribute
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    // color is set by strokeOpacity below
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            // Starting animation values
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            // Animate path length and opacity
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/*
  2) BackgroundPaths component
  --------------------------------
  Wraps two FloatingPaths (position={1} and position={-1}) 
  for a layered effect. You can tweak as desired.
*/
function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 
        Renders two sets of floating paths:
        one offset by position=1, the other by position=-1 
        for symmetrical or mirrored motion.
      */}
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}

function App() {
  const [birthdate, setBirthdate] = useState<string>('');
  const [timeAlive, setTimeAlive] = useState<{ years: number; months: number; days: number } | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Generate date options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Parse birthdate into components
  const birthdateObj = birthdate ? new Date(birthdate) : null;
  const selectedYear = birthdateObj ? birthdateObj.getFullYear().toString() : '';
  const selectedMonth = birthdateObj
    ? (birthdateObj.getMonth() + 1).toString().padStart(2, '0')
    : '';
  const selectedDay = birthdateObj
    ? birthdateObj.getDate().toString().padStart(2, '0')
    : '';

  // Generate days based on selected month and year
  const daysInMonth =
    selectedYear && selectedMonth
      ? getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth))
      : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  // Format country options for react-select
  const countryOptions: SelectOption[] = countryData.map((country) => ({
    value: country.code,
    label: (
      <div className="flex items-center">
        <img
          src={country.flag}
          alt={`${country.name} flag`}
          className="w-6 h-4 mr-2 object-cover"
        />
        <span>{country.name}</span>
      </div>
    ),
    data: country
  }));

  // Handle date component changes
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    const month = selectedMonth || '01';
    const maxDay = getDaysInMonth(parseInt(year), parseInt(month));
    const day =
      selectedDay && parseInt(selectedDay) <= maxDay
        ? selectedDay
        : maxDay.toString().padStart(2, '0');

    setBirthdate(`${year}-${month}-${day}`);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    const year = selectedYear || currentYear.toString();
    const maxDay = getDaysInMonth(parseInt(year), parseInt(month));
    const day =
      selectedDay && parseInt(selectedDay) <= maxDay
        ? selectedDay
        : maxDay.toString().padStart(2, '0');

    setBirthdate(`${year}-${month}-${day}`);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value;
    const year = selectedYear || currentYear.toString();
    const month = selectedMonth || '01';

    setBirthdate(`${year}-${month}-${day}`);
  };

  // Handle country selection
  const handleCountryChange = (option: SelectOption | null) => {
    setSelectedCountry(option ? option.data : null);
  };

  useEffect(() => {
    if (!birthdate || !submitted) return;

    const calculateTimeAlive = () => {
      const birth = new Date(birthdate);
      const now = new Date();

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      // Adjust for negative months or days
      if (days < 0) {
        months--;
        // Get days in the previous month
        const prevMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        ).getDate();
        days += prevMonth;
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      setTimeAlive({ years, months, days });
    };

    calculateTimeAlive();
    const interval = setInterval(calculateTimeAlive, 1000 * 60 * 60 * 24); // Update daily

    return () => clearInterval(interval);
  }, [birthdate, submitted]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Reset form
  const handleReset = () => {
    setSubmitted(false);
    setBirthdate('');
    setSelectedCountry(null);
  };

  const renderLifeGrid = () => {
    const grid = [];
    const totalYears = timeAlive?.years || 0;
    const lifeExpectancy = selectedCountry?.lifeExpectancy || 100;

    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        const year = i * 10 + j;
        const isLived = year < totalYears;
        const isCurrentYear = year === totalYears;
        const isPastLifeExpectancy = year >= lifeExpectancy;

        row.push(
          <div
            key={year}
            className={`w-full aspect-square rounded-sm ${
              isLived
                ? 'bg-orange-500'
                : isCurrentYear
                ? 'bg-orange-300'
                : isPastLifeExpectancy
                ? 'bg-gray-700'
                : 'bg-gray-800'
            }`}
            title={`Year ${year + 1}${
              isPastLifeExpectancy ? ' (Beyond average life expectancy)' : ''
            }`}
          />
        );
      }
      grid.push(
        <div key={i} className="grid grid-cols-10 gap-1 w-full">
          {row}
        </div>
      );
    }

    return grid;
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#f97316'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#1f2937',
      zIndex: 100
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#374151' : '#1f2937',
      '&:hover': {
        backgroundColor: '#374151'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af'
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: '#4b5563'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: '#9ca3af',
      '&:hover': {
        color: '#f97316'
      }
    })
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <BackgroundPaths />
      </div>



      <header className="w-full max-w-4xl py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">LIFE VISUALISED</h1>
        <p className="text-gray-400 text-lg">Visualize your journey through time</p>
      </header>

      <main className="w-full max-w-4xl flex-1 px-4 pb-16" style={{ zIndex: 1 }}>
        {!submitted ? (
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">When were you born?</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Custom date picker */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="month"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Month
                    </label>
                    <select
                      id="month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md block w-full p-2.5 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="" disabled>
                        Select month
                      </option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="day"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Day
                    </label>
                    <select
                      id="day"
                      value={selectedDay}
                      onChange={handleDayChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md block w-full p-2.5 focus:ring-orange-500 focus:border-orange-500"
                      required
                      disabled={!selectedMonth}
                    >
                      <option value="" disabled>
                        Select day
                      </option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Year
                    </label>
                    <select
                      id="year"
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md block w-full p-2.5 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="" disabled>
                        Select year
                      </option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hidden native date input for accessibility and mobile fallback */}
                <div className="mt-4">
                  {datePickerOpen && (
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md block w-full pl-10 p-2.5 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>

                {/* Country selector */}
                <div className="mt-6">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Your Country
                  </label>
                  <Select
                    id="country"
                    options={countryOptions}
                    onChange={handleCountryChange}
                    placeholder="Select your country"
                    styles={customSelectStyles}
                    className="country-select"
                    classNamePrefix="country-select"
                    isSearchable={true}
                  />
                  {selectedCountry && (
                    <div className="mt-2 text-sm text-gray-400">
                      Life expectancy in {selectedCountry.name}:{' '}
                      <span className="text-orange-500 font-medium">
                        {selectedCountry.lifeExpectancy} years
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview of selected date */}
              {birthdate && (
                <div className="bg-gray-800 p-4 rounded-md mt-6">
                  <p className="text-gray-300 text-sm mb-1">Selected date:</p>
                  <p className="text-lg font-medium text-white">
                    {new Date(birthdate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!birthdate || !selectedCountry}
                className={`w-full font-medium py-2.5 px-4 rounded-md transition duration-150 ease-in-out ${
                  birthdate && selectedCountry
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Visualize My Life
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-10">
            {timeAlive && (
              <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-2">You have been alive for</h2>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="bg-gray-800 p-6 rounded-md flex-1 min-w-[120px]">
                    <span className="block text-4xl font-bold text-orange-500">
                      {timeAlive.years}
                    </span>
                    <span className="text-gray-400">Years</span>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-md flex-1 min-w-[120px]">
                    <span className="block text-4xl font-bold text-orange-500">
                      {timeAlive.months}
                    </span>
                    <span className="text-gray-400">Months</span>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-md flex-1 min-w-[120px]">
                    <span className="block text-4xl font-bold text-orange-500">
                      {timeAlive.days}
                    </span>
                    <span className="text-gray-400">Days</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold">Your life in years</h2>
                {selectedCountry && (
                  <div className="flex items-center mt-2 md:mt-0">
                    <img
                      src={selectedCountry.flag}
                      alt={`${selectedCountry.name} flag`}
                      className="w-6 h-4 mr-2 object-cover"
                    />
                    <span className="text-gray-300">
                      {selectedCountry.name}:{' '}
                      <span className="text-orange-500 font-medium">
                        {selectedCountry.lifeExpectancy} years
                      </span>{' '}
                      life expectancy
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 mb-8">
                Each block represents one year of a 100-year lifespan
              </p>
              <div className="grid gap-1">{renderLifeGrid()}</div>
              <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                  <span className="text-sm text-gray-400">Lived years</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-300 rounded-sm"></div>
                  <span className="text-sm text-gray-400">Current year</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
                  <span className="text-sm text-gray-400">Future years</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                  <span className="text-sm text-gray-400">
                    Beyond life expectancy
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-orange-500 hover:text-orange-400 font-medium flex items-center gap-2"
            >
              ← Enter a different birthdate
            </button>
          </div>
        )}
      </main>

      <footer className="w-full max-w-4xl px-4 py-8 text-center text-orange-500 text-sm">
        <p>LIFE VISUALIZED — A visual representation of your journey through time</p>
      </footer>
    </div>
  );
}

export default App;
