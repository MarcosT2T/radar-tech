'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const dateLabel=value=>value?new Date(value+'T12:00:00').toLocaleDateString('pt-BR'):'Não informado';
const state={items:[],view:'table',sort:'nome',direction:1};
const options=(id,values)=>{for(const value of [...new Set(values)].sort((a,b)=>a.localeCompare(b,'pt-BR')))$(id).add(new Option(value,value));};
function pill(status){return '<span class="pill '+(status==='Vigente'?'ok':status==='A confirmar'?'pending':'')+'">'+escapeHTML(status)+'</span>';}
function filtered(){
 const q=$('search').value.trim().toLocaleLowerCase('pt-BR');
 const category=$('category').value,vendor=$('vendor').value,status=$('status').value;
 return state.items.filter(x=>(!category||x.categoria===category)&&(!vendor||x.fabricante===vendor)&&(!status||x.status===status)&&(!q||[x.nome,x.fabricante,x.categoria,x.descricao,x.tipo].join(' ').toLocaleLowerCase('pt-BR').includes(q)))
 .sort((a,b)=>String(a[state.sort]??(state.sort.includes('_ate')?'9999':'')).localeCompare(String(b[state.sort]??(state.sort.includes('_ate')?'9999':'')),'pt-BR')*state.direction);
}
function render(){
 const rows=filtered();$('count').textContent=rows.length+' de '+state.items.length+' registros';
 $('tableBody').innerHTML=rows.map(x=>'<tr><td><div class="primary">'+escapeHTML(x.nome)+'</div><div class="secondary">'+escapeHTML(x.descricao)+'</div></td><td>'+escapeHTML(x.categoria)+'</td><td>'+escapeHTML(x.fabricante)+'</td><td>'+escapeHTML(x.tipo)+'</td><td>'+pill(x.status)+'</td><td>'+dateLabel(x.inscricao_ate)+'</td><td><a href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">Consultar ↗</a></td></tr>').join('')||'<tr><td colspan="7" class="empty">Nenhum resultado encontrado.</td></tr>';
 $('cardsView').innerHTML=rows.map(x=>'<article class="card"><div>'+pill(x.status)+'</div><h3>'+escapeHTML(x.nome)+'</h3><div class="meta">'+escapeHTML(x.categoria)+' · '+escapeHTML(x.fabricante)+'</div><p>'+escapeHTML(x.descricao)+'</p><div class="meta">Modalidade: '+escapeHTML(x.tipo)+'</div><div class="meta">Inscrição: '+dateLabel(x.inscricao_ate)+' · Voucher: '+dateLabel(x.voucher_ate)+'</div><div class="meta">Brasil: '+escapeHTML(x.brasil)+' · Conferido: '+dateLabel(x.verificado_em)+'</div><a href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">Ver fonte oficial ↗</a></article>').join('')||'<p class="empty">Nenhum resultado encontrado.</p>';
}
function view(mode){state.view=mode;$('tableView').hidden=mode!=='table';$('cardsView').hidden=mode!=='cards';$('tableBtn').setAttribute('aria-pressed',String(mode==='table'));$('cardsBtn').setAttribute('aria-pressed',String(mode==='cards'));}
function section(name){const home=name==='home';$('homeSection').hidden=!home;$('catalogSection').hidden=home;$('homeNav').setAttribute('aria-current',home?'page':'false');$('catalogNav').setAttribute('aria-current',home?'false':'page');location.hash=home?'inicio':'oportunidades';}
async function loadHome(){
 try{const r=await fetch('./data/home.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();
 $('homeFeed').innerHTML=(data.analises||[]).slice().reverse().map(a=>'<article class="report"><div class="meta">'+dateLabel(a.data)+'</div><h3>'+escapeHTML(a.titulo)+'</h3><p>'+escapeHTML(a.resumo)+'</p><div class="reportgrid">'+(a.destaques||[]).map(d=>'<div class="reportitem"><span class="pill">'+escapeHTML(d.tipo)+'</span><h4>'+escapeHTML(d.titulo)+'</h4><p>'+escapeHTML(d.descricao)+'</p><a href="'+escapeHTML(d.url)+'" target="_blank" rel="noopener noreferrer">Fonte oficial ↗</a></div>').join('')+'</div><h4>Notas da revisão</h4><ul>'+(a.observacoes||[]).map(t=>'<li>'+escapeHTML(t)+'</li>').join('')+'</ul></article>').join('')||'<p>Nenhuma análise publicada.</p>';
 }catch(e){$('homeFeed').textContent='Não foi possível carregar as análises.';}
}
async function init(){
 $('homeNav').addEventListener('click',()=>section('home'));$('catalogNav').addEventListener('click',()=>section('catalog'));section(location.hash==='#oportunidades'?'catalog':'home');loadHome();
 $('tableBtn').addEventListener('click',()=>view('table'));$('cardsBtn').addEventListener('click',()=>view('cards'));
 for(const id of ['search','category','vendor','status'])$(id).addEventListener('input',render);
 document.querySelectorAll('th[data-key] button').forEach(button=>button.addEventListener('click',()=>{const key=button.closest('th').dataset.key;state.direction=state.sort===key?-state.direction:1;state.sort=key;render();}));
 try{
  const response=await fetch('./data/opportunities.json',{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(!Array.isArray(data.oportunidades))throw new Error('Formato de catálogo inválido');
  state.items=data.oportunidades;
  $('total').textContent=state.items.length;$('areas').textContent=new Set(state.items.map(x=>x.categoria)).size;
  $('verified').textContent=state.items.filter(x=>x.status==='Vigente'&&x.verificado_em).length;
  $('updated').textContent=dateLabel(data.atualizado_em);
  options('category',state.items.map(x=>x.categoria));options('vendor',state.items.map(x=>x.fabricante));render();
 }catch(error){$('count').textContent='Catálogo indisponível';$('tableBody').innerHTML='<tr><td colspan="7" class="empty">Falha ao carregar os dados. Confira a publicação do arquivo data/opportunities.json.</td></tr>';$('notice').textContent='Não foi possível carregar o catálogo: '+error.message;}
}
document.addEventListener('DOMContentLoaded',init);
