import {Link} from 'react-router-dom';
import {ArrowLeft,ShieldCheck} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer.jsx';
export default function WatchPage({movie}){
 if(!movie)return <div className="empty-state"><h2>Title not found</h2><Link to="/movies">Browse movies</Link></div>;
 const playable=Boolean(movie.authorizedMedia&&movie.streamUrl);
 return <main className="watch-page"><Link to={'/movie/'+movie.slug} className="back-link"><ArrowLeft size={15}/> Back to title</Link>
  <div className="watch-heading"><span className="eyebrow">NOW PLAYING</span><h1>{movie.title}</h1><p><ShieldCheck size={15}/> Authorized media playback</p></div>
  {playable?<VideoPlayer movie={movie}/>:<div className="player-unavailable"><h2>Playback unavailable</h2><p>A verified, authorized media source has not been added for this title yet.</p><Link to={'/movie/'+movie.slug} className="button button-outline">Return to details</Link></div>}
 </main>;
}