import React, { createContext, useContext, useState, useEffect } from 'react';
import CountryService from '../services/CountryService';

const CountryContext = createContext();

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar países desde Firebase
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const result = await CountryService.getAllCountries();
      
      if (result.success) {
        // Filtrar solo países activos
        const activeCountries = result.countries.filter(country => country.isActive);
        setCountries(activeCountries);
        
        // Establecer Colombia como país por defecto si existe
        const colombia = activeCountries.find(country => country.code === 'CO');
        if (colombia) {
          setSelectedCountry(colombia);
        } else if (activeCountries.length > 0) {
          // Si no hay Colombia, usar el primer país disponible
          setSelectedCountry(activeCountries[0]);
        }
        
        setError(null);
      } else {
        setError(result.error);
        // Fallback a país local si falla Firebase
        const fallbackCountry = {
          id: 'local-co',
          name: 'Colombia',
          code: 'CO',
          phoneCode: '+57',
          flag: '🇨🇴',
          isActive: true
        };
        setCountries([fallbackCountry]);
        setSelectedCountry(fallbackCountry);
      }
    } catch (err) {
      console.error('Error loading countries:', err);
      setError(err.message);
      // Fallback a país local
      const fallbackCountry = {
        id: 'local-co',
        name: 'Colombia',
        code: 'CO',
        phoneCode: '+57',
        flag: '🇨🇴',
        isActive: true
      };
      setCountries([fallbackCountry]);
      setSelectedCountry(fallbackCountry);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
  };

  const refreshCountries = () => {
    loadCountries();
  };

  const value = {
    selectedCountry,
    selectCountry,
    countries,
    loading,
    error,
    refreshCountries,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

export default CountryContext;
