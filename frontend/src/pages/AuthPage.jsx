import {useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {Clapperboard,Eye,EyeOff} from 'lucide-react';
import {useAuth} from '../context/AuthContext.jsx';
export default function AuthPage(){
 const [params]=useSearchParams();const [mode,setMode]=useState(params.get('mode')==='register'?'register':'login');
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [showPassword,setShowPassword]=useState(false);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const {signIn,register}=useAuth();const navigate=useNavigate();
 const submit=async event=>{event.preventDefault();setError('');setBusy(true);try{if(mode==='register')await register({name,email,password});else await signIn({email,password});navigate('/');}catch(err){setError(err.message);}finally{setBusy(false);}};
 return <main className="auth-page"><div className="auth-art"/><section className="auth-card">
  <Link className="brand auth-brand" to="/"><span className="brand-mark"><Clapperboard size={19}/></span><span className="brand-copy"><strong>DHANU <em>MOVIE ADDA</em></strong><small>STREAM.IN</small></span></Link>
  <span className="eyebrow">WELCOME TO YOUR CINEMA</span><h1>{mode==='login'?'Sign in to continue.':'Create your account.'}</h1><p>Discover stories selected for your next movie night.</p>
  <form onSubmit={submit} className="auth-form">
   {mode==='register'&&<label>Full name<input required minLength="2" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}
   <label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
   <label>Password<span className="password-field"><input type={showPassword?'text':'password'} required minLength="8" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode==='login'?'current-password':'new-password'}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label="Toggle password visibility">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label>
   {error&&<div className="form-error">{error}</div>}
   <button className="button button-primary auth-submit" disabled={busy}>{busy?'Please wait...':mode==='login'?'Sign in':'Create account'}</button>
  </form>
  <div className="auth-switch">{mode==='login'?'New to DHANU MOVIE ADDA?':'Already have an account?'} <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('');}}>{mode==='login'?'Create an account':'Sign in'}</button></div>
  <small className="auth-legal">By continuing, you agree to use only content you are authorized to access.</small>
 </section></main>;
}