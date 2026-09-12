import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicUrl, publicAddress, limitedText, extractMetadata } from '../lib/link-metadata.ts';
test('accepts public HTTPS links', () => {
  for(const url of ['https://www.tiktok.com/@a/video/123','https://instagram.com/p/abc','https://example.com/article']) assert.equal(publicUrl(url).protocol,'https:');
});
test('rejects private, disguised, credentialed and non-HTTPS destinations', () => {
  for(const url of ['http://example.com','https://localhost','https://a.local','https://127.0.0.1','https://2130706433','https://0x7f000001','https://[::1]','https://[::ffff:127.0.0.1]','https://10.0.0.1','https://user:pass@example.com','https://example.com:8443']) assert.throws(()=>publicUrl(url));
});
test('DNS addresses reject private, reserved, and transition networks', () => {
  for(const ip of ['127.0.0.1','10.0.0.1','172.16.0.1','192.168.1.1','169.254.169.254','100.64.0.1','0.0.0.0','224.0.0.1','198.18.0.1','::1','fc00::1','fe80::1','::ffff:10.0.0.1','2002:a00::1']) assert.equal(publicAddress(ip),false,ip);
  assert.equal(publicAddress('8.8.8.8'),true);assert.equal(publicAddress('2606:4700:4700::1111'),true);
});
test('enforces response limits with and without content-length', async () => {
  for(const response of [new Response('x',{headers:{'content-length':'1048577'}}),new Response('x'.repeat(1048577))]) await assert.rejects(limitedText(response,new AbortController().signal),/too large/);
  assert.equal(await limitedText(new Response('hello'),new AbortController().signal),'hello');
});
test('aborted responses stop reading',async()=>{const c=new AbortController();c.abort();await assert.rejects(limitedText(new Response('x'),c.signal));});
test('private redirect rejected before fetching destination',async()=>{
 const original=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url)=>{calls.push(String(url));if(String(url).includes('dns-query'))return Response.json({Status:0,Answer:[{type:1,data:'8.8.8.8'}]});return new Response(null,{status:302,headers:{location:'https://127.0.0.1'}})};
 try{await assert.rejects(extractMetadata('https://example.com'),/private-network/);assert.equal(calls.some(x=>x.startsWith('https://127')),false)}finally{globalThis.fetch=original}
});
test('TikTok uses official oEmbed text and discards HTML',async()=>{
 const original=globalThis.fetch;const calls=[];globalThis.fetch=async(url)=>{calls.push(String(url));if(String(url).includes('dns-query'))return Response.json({Status:0,Answer:[{type:1,data:'8.8.8.8'}]});return Response.json({title:'Dinner',author_name:'Chef',thumbnail_url:'https://example.com/image.jpg',html:'<script>bad()</script>'})};
 try{const data=await extractMetadata('https://www.tiktok.com/@chef/video/123');assert.equal(data.title,'Dinner');assert.equal(data.author,'Chef');assert.equal(data.image,'https://example.com/image.jpg');assert.equal('html' in data,false);assert.ok(calls.some(x=>x.startsWith('https://www.tiktok.com/oembed?url=')))}finally{globalThis.fetch=original}
});
test('blocked Instagram returns screenshot fallback',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async(url)=>String(url).includes('dns-query')?Response.json({Status:0,Answer:[{type:1,data:'8.8.8.8'}]}):new Response(null,{status:403});
 try{await assert.rejects(extractMetadata('https://www.instagram.com/p/abc'),{message:'We couldn’t access this post. Upload a screenshot instead.'})}finally{globalThis.fetch=original}
});
test('DNS resolving to private space prevents page fetch',async()=>{
 const original=globalThis.fetch;let pageFetched=false;globalThis.fetch=async(url)=>{if(String(url).includes('dns-query'))return Response.json({Status:0,Answer:[{type:1,data:'10.0.0.1'}]});pageFetched=true;return new Response('unexpected')};
 try{await assert.rejects(extractMetadata('https://example.com'),/private-network/);assert.equal(pageFetched,false)}finally{globalThis.fetch=original}
});
test('DNS uses edge-compatible manual redirects and falls back safely',async()=>{
 const original=globalThis.fetch;let fallback=false;
 globalThis.fetch=async(url,options)=>{
  if(String(url).includes('cloudflare-dns.com')){assert.equal(options.redirect,'manual');return new Response(null,{status:503})}
  if(String(url).includes('dns.google')){fallback=true;assert.equal(options.redirect,'manual');return Response.json({Status:0,Answer:[{type:1,data:'8.8.8.8'}]})}
  return Response.json({title:'Recipe',author_name:'Chef'});
 };
 try{const result=await extractMetadata('https://www.tiktok.com/@chef/video/123');assert.equal(result.title,'Recipe');assert.equal(fallback,true)}finally{globalThis.fetch=original}
});
