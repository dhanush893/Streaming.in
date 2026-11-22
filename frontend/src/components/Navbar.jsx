import {useState} from 'react';
import {Link,NavLink,useNavigate} from 'react-router-dom';
import {Search,Menu,X,UserRound,ChevronDown,Clapperboard} from 'lucide-react';
import {useAuth} from '../context/AuthContext.jsx';
export default function Navbar(){
 const [menuOpen,setMenuOpen]=useState(false);const [profileOpen,setProfileOpen]=useState(false);const [query,setQuery]=useState('');
 const navigate=useNavigate();const {user,signOut}=useAuth();
 const submitSearch=event=>{event.preventDefault();const term=query.trim();if(term)navigate('/search?q='+encodeURIComponent(term));setMenuOpen(false);};
 const items=[['Home','/'],['Movies','/movies'],['Series','/series'],['Categories','/categories'],['My List','/my-list']];
 return <header className="site-header"><div className="nav-shell">
  <Link className="brand" to="/" onClick={()=>setMenuOpen(false)}><span className="brand-mark"><Clapperboard size={19}/></span><span className="brand-copy"><strong>DHANU <em>MOVIE ADDA</em></strong><small>STREAM.IN</small></span></Link>
  <nav className={'desktop-nav '+(menuOpen?'mobile-open':'')} aria-label="Main navigation">
   {items.map(([label,path])=><NavLink key={path} to={path} end={path==='/'} onClick={()=>setMenuOpen(false)}>{label}</NavLink>)}
   <form className="mobile-search" onSubmit={submitSearch}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search titles..." aria-label="Search titles"/></form>
  </nav>
  <div className="nav-actions"><form className="nav-search" onSubmit={submitSearch}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" aria-label="Search titles"/></form>
   <div className="profile-wrap"><button className="profile-button" onClick={()=>setProfileOpen(v=>!v)} aria-expanded={profileOpen} aria-label="Open profile menu"><span className="avatar"><UserRound size={16}/></span><ChevronDown size={14}/></button>
    {profileOpen&&<div className="profile-menu">{user?<><div className="profile-meta"><strong>{user.name}</strong><small>{user.email}</small></div>{user.role==='admin'&&<Link to="/admin" onClick={()=>setProfileOpen(false)}>Admin dashboard</Link>}<Link to="/my-list" onClick={()=>setProfileOpen(false)}>My List</Link><button onClick={async()=>{await signOut();setProfileOpen(false);navigate('/');}}>Sign out</button></>:<><Link to="/signin" onClick={()=>setProfileOpen(false)}>Sign in</Link><Link to="/signin?mode=register" onClick={()=>setProfileOpen(false)}>Create account</Link></>}</div>}
   </div><button className="menu-toggle" onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?'Close navigation':'Open navigation'}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
  </div>
 </div></header>;
}