import { useEffect, useReducer } from 'react';
import axios from 'axios';

const initialState = { data: [], loading: true, error: null };

// Lógica compleja de estados
function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT': 
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': 
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE': 
      return { ...state, loading: false, error: action.payload };
    default: 
      return state;
  }
}

export function useFetch(url) {
  // Inicializamos el useReducer
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await axios.get(url, { signal: controller.signal });
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        if (error.name !== 'CanceledError') {
          dispatch({ type: 'FETCH_FAILURE', payload: 'Error de conexión' });
        }
      }
    };

    fetchData();

    // Cleanup
    return () => controller.abort();
  }, [url]);

  return state;
}