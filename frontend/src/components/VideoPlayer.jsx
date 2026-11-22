import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';
import {Maximize,Volume2} from 'lucide-react';
export default function VideoPlayer({movie}){
 const videoRef=useRef(null);const hlsRef=useRef(null);const [levels,setLevels]=useState([]);const [quality,setQuality]=useState('auto');
 const isHls=/\.m3u8($|\?)/i.test(movie.streamUrl||'');
 useEffect(()=>{
  const video=videoRef.current;if(!video||!movie.streamUrl)return undefined;
  if(isHls&&Hls.isSupported()){
   const hls=new Hls({enableWorker:true,capLevelToPlayerSize:true});hlsRef.current=hls;hls.loadSource(movie.streamUrl);hls.attachMedia(video);
   hls.on(Hls.Events.MANIFEST_PARSED,(_event,data)=>setLevels(data.levels||[]));
   return ()=>{hls.destroy();hlsRef.current=null;};
  }
  video.src=movie.streamUrl;return ()=>{video.removeAttribute('src');video.load();};
 },[movie.streamUrl,isHls]);
 useEffect(()=>{
  const video=videoRef.current;if(!video)return undefined;
  const saveProgress=()=>{
   if(!video.duration||!Number.isFinite(video.duration))return;
   try{const history=JSON.parse(localStorage.getItem('dhanu-history')||'{}');history[movie.slug||movie._id]={slug:movie.slug||movie._id,title:movie.title,posterUrl:movie.posterUrl,backdropUrl:movie.backdropUrl,time:video.currentTime,duration:video.duration,updatedAt:Date.now()};localStorage.setItem('dhanu-history',JSON.stringify(history));}catch{}
  };
  video.addEventListener('timeupdate',saveProgress);return ()=>video.removeEventListener('timeupdate',saveProgress);
 },[movie]);
 const changeQuality=value=>{setQuality(value);if(hlsRef.current)hlsRef.current.currentLevel=value==='auto'?-1:Number(value);};
 const fullscreen=()=>{const video=videoRef.current;if(video?.requestFullscreen)video.requestFullscreen();else if(video?.webkitEnterFullscreen)video.webkitEnterFullscreen();};
 return <div className="video-frame"><video ref={videoRef} controls playsInline preload="metadata" poster={movie.backdropUrl||movie.posterUrl}>
  {(movie.subtitles||[]).map((track,index)=><track key={index} kind="subtitles" src={track.url} srcLang={track.language||'en'} label={track.label||track.language||'Subtitle'} default={index===0}/>)}Your browser does not support HTML5 video.
 </video><div className="player-toolbar"><span><Volume2 size={14}/> Original media source</span><div className="player-tools">
  {levels.length>1&&<label>Quality <select value={quality} onChange={e=>changeQuality(e.target.value)}><option value="auto">Auto</option>{levels.map((level,index)=><option key={index} value={index}>{level.height?level.height+'p':Math.round(level.bitrate/1000)+' kbps'}</option>)}</select></label>}
  <button onClick={fullscreen} aria-label="Fullscreen"><Maximize size={16}/></button>
 </div></div></div>;
}