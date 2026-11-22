import {useEffect,useMemo,useState} from 'react';
import {Link,Route,Routes,useLocation,useSearchParams} from 'react-router-dom';
import {ArrowDownUp,LoaderCircle,SearchX,SlidersHorizontal} from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MovieCard from './components/MovieCard.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import {api} from './lib/api.js';
import {demoMovies} from './data/demo.js';
import {useAuth} from './context/AuthContext.jsx';
function CataloguePage({movies,savedIds,onToggleList,initialType=''}) {
 const [params]=useSearchParams();const [genre,setGenre]=useState('');const [language,setLanguage]=useState('');const [year,setYear]=useState('');const [sort,setSort]=useState('featured');
 const query=params.get('q')||'';const location=useLocation();const isCategories=location.pathname==='/categories';
 const filtered=useMemo(()=>{
  let items=[...movies];if(initialType)items=items.filter(m=>(m.contentType||'movie')===initialType);
  if(genre)items=items.filter(m=>(m.genres||[]).some(g=>g.toLowerCase()===genre.toLowerCase()));
  if(language)items=items.filter(m=>(m.languages||[]).some(g=>g.toLowerCase()===language.toLowerCase()));
  if(year)items=items.filter(m=>String(m.year)===year);
  if(query)items=items.filter(m=>(m.title+' '+m.description+' '+(m.genres||[]).join(' ')).toLowerCase().includes(query.toLowerCase()));
  if(sort==='newest')items.sort((a,b)=>(b.year||0)-(a.year||0));if(sort==='oldest')items.sort((a,b)=>(a.year||0)-(b.year||0));if(sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title));
  return items;
 },[movies,initialType,genre,language,year,query,sort]);
 const genres=[...new Set(movies.flatMap(m=>m.genres||[]))].sort();const languages=[...new Set(movies.flatMap(m=>m.languages||[]))].sort();const years=[...new Set(movies.map(m=>m.year).filter(Boolean))].sort((a,b)=>b-a);
 return <main className="catalogue-page page-content"><div className="catalogue-heading"><div><span className="eyebrow">{query?'SEARCH RESULTS':isCategories?'FIND YOUR NEXT STORY':'EXPLORE THE LIBRARY'}</span><h1>{query?'Results for “'+query+'”':isCategories?'Browse categories':initialType==='series'?'Series':initialType==='movie'?'Movies':'All titles'}</h1><p>{filtered.length} {filtered.length===1?'title':'titles'} to explore.</p></div>
  <div className="sort-control"><ArrowDownUp size={16}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort titles"><option value="featured">Featured</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">A to Z</option></select></div>
 </div><div className="filter-bar"><div className="filter-title"><SlidersHorizontal size={16}/> Filters</div>
  <select value={genre} onChange={e=>setGenre(e.target.value)} aria-label="Filter by genre"><option value="">All genres</option>{genres.map(g=><option key={g}>{g}</option>)}</select>
  <select value={language} onChange={e=>setLanguage(e.target.value)} aria-label="Filter by language"><option value="">All languages</option>{languages.map(g=><option key={g}>{g}</option>)}</select>
  <select value={year} onChange={e=>setYear(e.target.value)} aria-label="Filter by year"><option value="">All years</option>{years.map(y=><option key={y}>{y}</option>)}</select>
  <button className="clear-filters" onClick={()=>{setGenre('');setLanguage('');setYear('');setSort('featured');}}>Clear filters</button>
 </div>
 {filtered.length?<div className="catalogue-grid">{filtered.map(movie=><MovieCard key={movie._id} movie={movie} saved={savedIds.includes(movie._id)} onToggleList={onToggleList}/>)}</div>:<div className="empty-state"><SearchX size={35}/><h2>No titles found</h2><p>Try another keyword or remove one of the filters.</p><button className="button button-outline" onClick={()=>{setGenre('');setLanguage('');setYear('');}}>Reset filters</button></div>}
 </main>;
}
function MyListPage({movies,savedIds,onToggleList}) {
 const saved=movies.filter(m=>savedIds.includes(m._id));
 return <main className="page-content list-page"><div className="catalogue-heading"><div><span className="eyebrow">YOUR PERSONAL COLLECTION</span><h1>My List</h1><p>Keep the stories you want to come back to.</p></div></div>
 {saved.length?<div className="catalogue-grid">{saved.map(movie=><MovieCard key={movie._id} movie={movie} saved onToggleList={onToggleList}/>)}</div>:<div className="empty-state"><h2>Your list is waiting.</h2><p>Save a movie or series to find it here whenever you return.</p><Link className="button button-primary" to="/movies">Explore titles</Link></div>}
 </main>;
}
function AppRoutes(){
 const [movies,setMovies]=useState(demoMovies);const [loading,setLoading]=useState(true);
 const [savedIds,setSavedIds]=useState(()=>{try{return JSON.parse(localStorage.getItem('dhanu-watchlist')||'[]');}catch{return [];}});
 const {user,refreshUser}=useAuth();const location=useLocation();
 useEffect(()=>{
  let active=true;api.get('/movies?limit=100').then(data=>{if(active&&Array.isArray(data.movies)&&data.movies.length)setMovies(data.movies);}).catch(()=>{}).finally(()=>{if(active)setLoading(false);});
  return ()=>{active=false;};
 },[]);
 useEffect(()=>{if(user?.watchlist?.length)setSavedIds(user.watchlist.map(item=>typeof item==='string'?item:item._id));},[user]);
 useEffect(()=>{localStorage.setItem('dhanu-watchlist',JSON.stringify(savedIds));},[savedIds]);
 const toggleList=async movie=>{
  if(user&&!String(movie._id).startsWith('demo-')){
   try{if(savedIds.includes(movie._id))await api.delete('/users/watchlist/'+movie._id);else await api.post('/users/watchlist/'+movie._id,{});await refreshUser();}
   catch(error){window.alert(error.message);}return;
  }
  setSavedIds(current=>current.includes(movie._id)?current.filter(id=>id!==movie._id):[...current,movie._id]);
 };
 const currentSlug=location.pathname.split('/').filter(Boolean).pop();
 const currentMovie=movies.find(movie=>movie.slug===currentSlug||movie._id===currentSlug);
 const isWatch=location.pathname.startsWith('/watch/');
 const detailMovie=location.pathname.startsWith('/movie/')?currentMovie:null;
 const similar=detailMovie?movies.filter(m=>m._id!==detailMovie._id&&(m.genres||[]).some(g=>(detailMovie.genres||[]).includes(g))):[];
 return <div className="app-shell">{!isWatch&&<Navbar/>}<Routes>
  <Route path="/" element={<HomePage movies={movies} savedIds={savedIds} onToggleList={toggleList}/>}/>
  <Route path="/movies" element={<CataloguePage movies={movies} savedIds={savedIds} onToggleList={toggleList} initialType="movie"/>}/>
  <Route path="/series" element={<CataloguePage movies={movies} savedIds={savedIds} onToggleList={toggleList} initialType="series"/>}/>
  <Route path="/categories" element={<CataloguePage movies={movies} savedIds={savedIds} onToggleList={toggleList}/>}/>
  <Route path="/search" element={<CataloguePage movies={movies} savedIds={savedIds} onToggleList={toggleList}/>}/>
  <Route path="/my-list" element={<MyListPage movies={movies} savedIds={savedIds} onToggleList={toggleList}/>}/>
  <Route path="/movie/:slug" element={<DetailPage movie={detailMovie} similar={similar} savedIds={savedIds} onToggleList={toggleList}/>}/>
  <Route path="/watch/:slug" element={<WatchPage movie={currentMovie}/>}/>
  <Route path="/signin" element={<AuthPage/>}/><Route path="/admin" element={<AdminPage/>}/>
  <Route path="*" element={<div className="empty-state page-content"><h2>Page not found</h2><Link to="/">Return home</Link></div>}/>
 </Routes>{!isWatch&&<Footer/>}{loading&&<div className="sync-indicator"><LoaderCircle className="spin" size={14}/> Connecting to library</div>}</div>;
}
export default function App(){return <AppRoutes/>;}
