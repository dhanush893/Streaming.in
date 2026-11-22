import {Link} from 'react-router-dom';
import {Play,Plus,Check} from 'lucide-react';
export default function MovieCard({movie,saved=false,onToggleList}){
 const slug=movie.slug||movie._id;const playable=Boolean(movie.authorizedMedia&&movie.streamUrl);
 return <article className="movie-card"><Link className="poster-wrap" to={'/movie/'+slug} aria-label={'View '+movie.title}>
  <img src={movie.posterUrl} alt={movie.title+' poster'} loading="lazy"/><span className="poster-shade"/><span className="poster-badge">{movie.contentType==='series'?'SERIES':'FILM'}</span>
  <span className="poster-hover"><span className="play-bubble"><Play size={18} fill="currentColor"/></span><strong>View details</strong></span>
 </Link><div className="card-info"><div className="card-title-line"><Link to={'/movie/'+slug} className="card-title">{movie.title}</Link>
  <button className={'save-button '+(saved?'is-saved':'')} onClick={()=>onToggleList?.(movie)} aria-label={saved?'Remove from My List':'Add to My List'} title={saved?'Remove from My List':'Add to My List'}>{saved?<Check size={16}/>:<Plus size={16}/>}</button>
 </div><div className="card-meta"><span>{movie.year||'—'}</span><i/><span>{(movie.genres||[]).slice(0,2).join(' · ')||'Featured'}</span><i/><span>{movie.maturityRating||'U'}</span></div>
 {playable&&<Link className="card-watch" to={'/watch/'+slug}><Play size={12} fill="currentColor"/> Watch sample</Link>}</div></article>;
}