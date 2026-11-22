const API_BASE=(import.meta.env.VITE_API_URL||'/api').replace(/\/$/,'');
async function request(path,options={}) {
  const headers=new Headers(options.headers||{});
  if(options.body&&!(options.body instanceof FormData))headers.set('Content-Type','application/json');
  const response=await fetch(API_BASE+path,{credentials:'include',...options,headers});
  const data=response.status===204?{}:await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.message||'Request failed. Please try again.');
  return data;
}
export const api={
  get:path=>request(path),
  post:(path,body)=>request(path,{method:'POST',body:body instanceof FormData?body:JSON.stringify(body||{})}),
  patch:(path,body)=>request(path,{method:'PATCH',body:JSON.stringify(body||{})}),
  delete:path=>request(path,{method:'DELETE'})
};