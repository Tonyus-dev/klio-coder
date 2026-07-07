import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedGuardianRoute({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? 'in' : 'out');
    });
  }, []);

  if (state === 'loading') return null;
  if (state === 'out') return <Navigate to="/app/login" replace />;
  return children;
}
