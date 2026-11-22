import {useEffect,useState} from 'react';
import {BarChart3,Film,ImagePlus,LoaderCircle,Plus,RefreshCw,Trash2,Users} from 'lucide-react';
import {api} from '../lib/api.js';
import {useAuth} from '../context/AuthContext.jsx';
const blank={title:'',description:'',year:new Date().getFullYear(),genres:'',languages:'English',runtime:'',maturityRating:'U',contentType:'movie',posterUrl:'',backdropUrl:'',trailerUrl:'',streamUrl:'',authorizedMedia:false,isFeatured:false,director:'',cast:'',status:'published'};
export default function AdminPage(){
 const {user}=useAuth();const [movies,setMovies]=useState([]);const [users,setUsers]=useState([]);const [analytics,setAnalytics]=useState(null);
 const [form,setForm]=useState(blank);const [editing,setEditing]=useState(null);const [message,setMessage]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [loading,setLoading]=useState(true);
 const load=async()=>{setLoading(true);setError('');try{const [movieData,userData,stats]=await Promise.all([api.get('/admin/movies'),api.get('/admin/users'),api.get('/admin/analytics')]);setMovies(movieData.movies||[]);setUsers(userData.users||[]);setAnalytics(stats.analytics);}catch(err){setError(err.message);}finally{setLoading(false);}};
 useEffect(()=>{load();},[]);
 const setField=(key,value)=>setForm(current=>({...current,[key]:value}));
 const editMovie=movie=>{setEditing(movie._id);setForm({...blank,...movie,genres:(movie.genres||[]).join(', '),languages:(movie.languages||[]).join(', '),cast:(movie.cast||[]).join(', '),streamUrl:movie.streamUrl||''});setMessage('');};
 const uploadImage=async(event,field)=>{
  const file=event.target.files?.[0];if(!file)return;const data=new FormData();data.append('file',file);setError('');setMessage('Uploading image...');
  try{const result=await api.post('/admin/upload',data);setField(field,result.url);setMessage('Image uploaded. Save the title to keep the change.');}catch(err){setError(err.message);}event.target.value='';
 };
 const saveMovie=async event=>{
  event.preventDefault();setBusy(true);setError('');setMessage('');
  try{const payload={...form,year:Number(form.year),runtime:Number(form.runtime),genres:form.genres.split(',').map(s=>s.trim()).filter(Boolean),languages:form.languages.split(',').map(s=>s.trim()).filter(Boolean),cast:form.cast.split(',').map(s=>s.trim()).filter(Boolean)};
   if(editing)await api.patch('/admin/movies/'+editing,payload);else await api.post('/admin/movies',payload);
   setForm(blank);setEditing(null);setMessage('Title saved successfully.');await load();
  }catch(err){setError(err.message);}finally{setBusy(false);}
 };
 const deleteMovie=async movie=>{if(!window.confirm('Delete '+movie.title+'? This also removes it from users’ lists.'))return;try{await api.delete('/admin/movies/'+movie._id);setMessage('Title deleted.');await load();}catch(err){setError(err.message);}};
 if(user?.role!=='admin')return <main className="page-content"><div className="empty-state"><h2>Administrator access required</h2><p>Sign in with an administrator account to manage the library.</p></div></main>;
 return <main className="admin-page page-content">
  <div className="admin-heading"><div><span className="eyebrow">CONTROL CENTRE</span><h1>Admin dashboard</h1><p>Manage titles, authorized sources and platform activity.</p></div><button className="button button-outline" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
  {error&&<div className="form-error admin-alert">{error}</div>}{message&&<div className="form-success admin-alert">{message}</div>}
  <section className="stats-grid"><div className="stat-card"><Film/><small>TOTAL TITLES</small><strong>{analytics?.titles??'—'}</strong></div><div className="stat-card"><BarChart3/><small>PUBLISHED TITLES</small><strong>{analytics?.published??'—'}</strong></div><div className="stat-card"><Users/><small>REGISTERED USERS</small><strong>{analytics?.users??'—'}</strong></div></section>
  <div className="admin-grid">
   <section className="admin-panel"><div className="panel-heading"><div><span className="eyebrow">{editing?'UPDATE LIBRARY ENTRY':'CONTENT MANAGEMENT'}</span><h2>{editing?'Edit title':'Add a title'}</h2></div><Film size={20}/></div>
    <form className="admin-form" onSubmit={saveMovie}>
     <label>Title<input required value={form.title} onChange={e=>setField('title',e.target.value)}/></label>
     <label>Description<textarea required rows="3" value={form.description} onChange={e=>setField('description',e.target.value)}/></label>
     <div className="form-two"><label>Release year<input type="number" min="1888" max="2100" value={form.year} onChange={e=>setField('year',e.target.value)}/></label><label>Runtime (minutes)<input type="number" min="1" value={form.runtime} onChange={e=>setField('runtime',e.target.value)}/></label></div>
     <div className="form-two"><label>Genres (comma separated)<input value={form.genres} onChange={e=>setField('genres',e.target.value)}/></label><label>Languages (comma separated)<input value={form.languages} onChange={e=>setField('languages',e.target.value)}/></label></div>
     <div className="form-two"><label>Content type<select value={form.contentType} onChange={e=>setField('contentType',e.target.value)}><option value="movie">Movie</option><option value="series">Series</option></select></label><label>Rating<input value={form.maturityRating} onChange={e=>setField('maturityRating',e.target.value)}/></label></div>
     <label>Poster image URL<input value={form.posterUrl} onChange={e=>setField('posterUrl',e.target.value)} placeholder="https://..."/></label>
     <label className="upload-label"><ImagePlus size={16}/> Upload poster<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>uploadImage(e,'posterUrl')}/></label>
     <label>Backdrop image URL<input value={form.backdropUrl} onChange={e=>setField('backdropUrl',e.target.value)} placeholder="https://..."/></label>
     <label className="upload-label"><ImagePlus size={16}/> Upload backdrop<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>uploadImage(e,'backdropUrl')}/></label>
     <label>Official trailer URL<input value={form.trailerUrl} onChange={e=>setField('trailerUrl',e.target.value)} placeholder="https://..."/></label>
     <label>Authorized video URL<input value={form.streamUrl} onChange={e=>setField('streamUrl',e.target.value)} placeholder="HTTPS MP4 or HLS URL"/></label>
     <div className="form-two"><label>Director<input value={form.director} onChange={e=>setField('director',e.target.value)}/></label><label>Cast (comma separated)<input value={form.cast} onChange={e=>setField('cast',e.target.value)}/></label></div>
     <label className="check-label"><input type="checkbox" checked={Boolean(form.authorizedMedia)} onChange={e=>setField('authorizedMedia',e.target.checked)}/> I confirm this media source is authorized for streaming</label>
     <label className="check-label"><input type="checkbox" checked={Boolean(form.isFeatured)} onChange={e=>setField('isFeatured',e.target.checked)}/> Feature this title on the homepage</label>
     <label>Status<select value={form.status} onChange={e=>setField('status',e.target.value)}><option value="published">Published</option><option value="draft">Draft</option></select></label>
     <div className="form-actions"><button className="button button-primary" disabled={busy}>{busy?<LoaderCircle className="spin" size={16}/>:<Plus size={16}/ >}{editing?'Save changes':'Add title'}</button>{editing&&<button type="button" className="button button-quiet" onClick={()=>{setEditing(null);setForm(blank);}}>Cancel edit</button>}</div>
    </form>
   </section>
   <section className="admin-panel admin-library"><div className="panel-heading"><div><span className="eyebrow">YOUR CATALOGUE</span><h2>Library <small>{movies.length}</small></h2></div></div>
    {loading?<div className="loading-state"><LoaderCircle className="spin"/> Loading library...</div>:movies.length?<div className="admin-movie-list">{movies.map(movie=><div className="admin-movie" key={movie._id}><img src={movie.posterUrl} alt=""/><div className="admin-movie-info"><strong>{movie.title}</strong><small>{movie.year} · {movie.status} · {movie.authorizedMedia?'Authorized source':'No stream source'}</small></div><button onClick={()=>editMovie(movie)} className="mini-action">Edit</button><button onClick={()=>deleteMovie(movie)} className="mini-action danger" aria-label={'Delete '+movie.title}><Trash2 size={15}/></button></div>)}</div>:<div className="empty-inline">No titles yet. Add the first title using the form.</div>}
    <div className="users-summary"><div className="panel-heading"><h2>Recent accounts <small>{users.length}</small></h2><Users size={18}/></div>{users.slice(0,8).map(account=><div className="user-row" key={account._id}><span className="avatar">{account.name?.slice(0,1).toUpperCase()}</span><div><strong>{account.name}</strong><small>{account.email}</small></div><span className="role-pill">{account.role}</span></div>)}</div>
   </section>
  </div>
 </main>;
}