import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {api} from '../lib/api.js';
const AuthContext=createContext(null);
export function AuthProvider({children}) {
  const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);
  const refreshUser=async()=>{try{const data=await api.get('/auth/me');setUser(data.user);return data.user;}catch{setUser(null);return null;}};
  useEffect(()=>{refreshUser().finally(()=>setLoading(false));},[]);
  const signIn=async credentials=>{const data=await api.post('/auth/login',credentials);setUser(data.user);return data.user;};
  const register=async details=>{const data=await api.post('/auth/register',details);setUser(data.user);return data.user;};
  const signOut=async()=>{try{await api.post('/auth/logout');}finally{setUser(null);}};
  const value=useMemo(()=>({user,loading,signIn,register,signOut,refreshUser}),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const context=useContext(AuthContext);if(!context)throw new Error('useAuth must be used inside AuthProvider.');return context;}