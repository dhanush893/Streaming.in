import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Play,Sparkles} from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx';
function MovieRow({title,eyebrow,movies,savedIds,onToggleList,to='/movies'}){
 if(!movies.length)return null;
 return <section className="content-section"><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><Link to={to} className="see-all">Explore all <ArrowRight size={15}/></Link></div>
 <div className="movie-row">{movies.map(movie=><MovieCard key={movie._id||movie.slug} movie={movie} saved={savedIds.includes(movie._id)} onToggleList={onToggleList}/>)}</div></section>;
}
export default function HomePage({movies,savedIds,onToggleList}){
 const [history,setHistory]=useState([]);
 useEffect(()=>{try{const items=Object.values(JSON.parse(localStorage.getItem('dhanu-history')||'{}'));setHistory(items.sort((a,b)=>b.updatedAt-a.updatedAt));}catch{}},[]);
 const featured=movies.find(movie=>movie.isFeatured)||movies[0];
 const trending=movies.slice(0,7);const newest=[...movies].sort((a,b)=>(b.year||0)-(a.year||0)).slice(0,7);
 const series=movies.filter(movie=>movie.contentType==='series');
 const historyItems=history.map(item=>movies.find(movie=>(movie.slug||movie._id)===item.slug)).filter(Boolean).slice(0,7);
 const collections=[
  {label:'Stories beyond the ordinary',title:'Worlds to get lost in',image:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85',tag:'ADVENTURE'},
  {label:'Discover the natural world',title:'The beauty of Earth',image:'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',tag:'DOCUMENTARY'}
 ];
 return <>{featured&&<section className="hero" style={{backgroundImage:'linear-gradient(90deg,rgba(5,6,8,.98) 0%,rgba(5,6,8,.76) 42%,rgba(5,6,8,.12) 100%),linear-gradient(0deg,#08090b 0%,transparent 46%),url('+(featured.backdropUrl||featured.posterUrl)+')'}}>
  <div className="hero-content"><span className="hero-kicker"><Sparkles size={14}/> THE DHANU ORIGINAL EXPERIENCE</span><div className="hero-brand-line">DHANU <span>MOVIE ADDA</span></div>
   <h1>{featured.title}</h1><p className="hero-description">{featured.description}</p>
   <div className="hero-meta"><span>{featured.year}</span><i/><span>{(featured.genres||[]).slice(0,2).join(' / ')}</span><i/><span>{featured.maturityRating||'U'}</span>{featured.runtime&&<><i/><span>{featured.runtime} min</span></>}</div>
   <div className="hero-actions"><Link className="button button-primary" to={'/movie/'+featured.slug}><Play size={17} fill="currentColor"/> Explore title</Link><Link className="button button-quiet" to="/movies">Browse library <ArrowRight size={16}/></Link></div>
   <span className="hero-footnote">A NEW WAY TO EXPERIENCE STORIES</span>
  </div><div className="hero-index"><span>01</span><i/> FEATURED</div>
 </section>}
 <div className="page-content">
  <MovieRow title="Trending now" eyebrow="WHAT EVERYONE IS EXPLORING" movies={trending} savedIds={savedIds} onToggleList={onToggleList}/>
  <section className="collection-section"><div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Featured collections</h2></div></div><div className="collection-grid">
   {collections.map(item=><Link to="/categories" className="collection-card" key={item.tag} style={{backgroundImage:'linear-gradient(90deg,rgba(7,8,10,.88),rgba(7,8,10,.12)),url('+item.image+')'}}><span>{item.tag}</span><div><small>{item.label}</small><h3>{item.title}</h3></div><ArrowRight size={18}/></Link>)}
  </div></section>
  <MovieRow title="Popular movies" eyebrow="THE CROWD FAVOURITES" movies={movies.filter(m=>m.contentType!=='series').slice(1,8)} savedIds={savedIds} onToggleList={onToggleList}/>
  <MovieRow title="Recently added" eyebrow="FRESH FROM THE LIBRARY" movies={newest} savedIds={savedIds} onToggleList={onToggleList}/>
  <MovieRow title="Continue watching" eyebrow="PICK UP WHERE YOU LEFT OFF" movies={historyItems} savedIds={savedIds} onToggleList={onToggleList}/>
  <MovieRow title="Series worth your time" eyebrow="YOUR NEXT BINGE STARTS HERE" movies={series} savedIds={savedIds} onToggleList={onToggleList} to="/series"/>
  <section className="continue-banner"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Your next favourite story is waiting.</h2><p>Save titles to My List and keep your personal cinema close.</p></div><Link className="button button-outline" to="/my-list">Open My List <ArrowRight size={16}/></Link></section>
 </div></>;
}