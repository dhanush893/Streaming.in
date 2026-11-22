import {Link} from 'react-router-dom';
import {ArrowLeft,Check,Clock3,Play,Plus,Star} from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx';
export default function DetailPage({movie,similar=[],savedIds,onToggleList}){
 if(!movie)return <div className="empty-state"><h2>Title not found</h2><p>This title may have moved or is not available.</p><Link className="button button-primary" to="/movies">Back to movies</Link></div>;
 const slug=movie.slug||movie._id;const playable=Boolean(movie.authorizedMedia&&movie.streamUrl);
 return <><section className="detail-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(7,8,10,.98),rgba(7,8,10,.7) 54%,rgba(7,8,10,.2)),linear-gradient(0deg,#08090b,transparent 45%),url('+(movie.backdropUrl||movie.posterUrl)+')'}}>
  <div className="detail-shell"><Link to="/movies" className="back-link"><ArrowLeft size={15}/> Back to browse</Link>
   <div className="detail-layout"><img className="detail-poster" src={movie.posterUrl} alt={movie.title+' poster'}/>
    <div className="detail-copy"><span className="eyebrow">DHANU MOVIE ADDA PRESENTS</span><h1>{movie.title}</h1><p className="detail-description">{movie.description}</p>
     <div className="detail-meta"><span>{movie.year}</span><i/><span>{movie.maturityRating||'U'}</span><i/><span>{movie.contentType==='series'?'Series':'Movie'}</span>{movie.runtime&&<><i/><span><Clock3 size={14}/> {movie.runtime} min</span></>}</div>
     <div className="genre-tags">{(movie.genres||[]).map(tag=><span key={tag}>{tag}</span>)}</div>
     <div className="detail-facts"><div><small>LANGUAGE</small><strong>{(movie.languages||[]).join(', ')||'Not listed'}</strong></div><div><small>DIRECTOR</small><strong>{movie.director||'Not listed'}</strong></div><div><small>CAST</small><strong>{(movie.cast||[]).join(', ')||'Not listed'}</strong></div></div>
     <div className="hero-actions">{playable?<Link className="button button-primary" to={'/watch/'+slug}><Play size={16} fill="currentColor"/> Watch now</Link>:<span className="availability-note">Streaming source not currently available</span>}
      <button className="button button-quiet" onClick={()=>onToggleList?.(movie)}>{savedIds.includes(movie._id)?<Check size={16}/>:<Plus size={16}/>} {savedIds.includes(movie._id)?'In My List':'Add to My List'}</button>
     </div>
     {movie.trailerUrl&&<a className="trailer-link" href={movie.trailerUrl} target="_blank" rel="noreferrer"><Star size={14}/> View official trailer</a>}
    </div>
   </div>
  </div>
 </section>
 {similar.length>0&&<section className="content-section page-content"><div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>You may also like</h2></div></div><div className="movie-row">{similar.slice(0,7).map(item=><MovieCard key={item._id} movie={item} saved={savedIds.includes(item._id)} onToggleList={onToggleList}/>)}</div></section>}</>;
}