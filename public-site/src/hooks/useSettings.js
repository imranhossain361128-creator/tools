import { useEffect, useState } from 'react';
import api from '../api/client';

let cache = null;
let inFlight = null;

export default function useSettings() {
  const [settings, setSettings] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    if (!inFlight) {
      inFlight = api.get('/settings').then((res) => {
        cache = res.data;
        return res.data;
      });
    }
    inFlight.then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
