import {Link} from 'react-router-dom';
import {Clapperboard,Instagram,Youtube} from 'lucide-react';
export default function Footer(){return <footer className="site-footer"><div className="footer-main">
 <div className="footer-brand"><Link className="brand" to="/"><span className="brand-mark"><Clapperboard size={19}/></span><span className="brand-copy"><strong>DHANU <em>MOVIE ADDA</em></strong><small>STREAM.IN</small></span></Link><p>Your cinematic world, all in one place.</p></div>
 <div className="footer-links"><strong>Explore</strong><Link to="/movies">Movies</Link><Link to="/series">Series</Link><Link to="/categories">Categories</Link><Link to="/my-list">My List</Link></div>
 <div className="footer-links"><strong>Information</strong><a href="#content-rights">Content rights</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
 <div className="footer-social"><strong>Stay connected</strong><span><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={19}/></a></span></div>
 </div><div className="footer-bottom"><span>© {new Date().getFullYear()} DHANU MOVIE ADDA STREAM.IN</span><span>Only stream content you are authorized to access.</span></div></footer>;}