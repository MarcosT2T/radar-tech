'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const dateLabel=value=>value?new Date(value+'T12:00:00').toLocaleDateString('pt-BR'):'Não informado';
const state={items:[],view:'table',sort:'nome',direction:1,group:''};
const options=(id,values)=>{for(const value of [...new Set(values)].sort((a,b)=>a.localeCompare(b,'pt-BR')))$(id).add(new Option(value,value));};
function pill(status){return '<span class="pill '+(status==='Vigente'?'ok':status==='A confirmar'?'pending':'')+'">'+escapeHTML(status)+'</span>';}
function filtered(){
 const q=$('search').value.trim().toLocaleLowerCase('pt-BR');
 const category=$('category').value,vendor=$('vendor').value,status=$('status').value;
 return state.items.filter(x=>(!state.group||x.grupo===state.group)&&(!category||x.categoria===category)&&(!vendor||x.fabricante===vendor)&&(!status||x.status===status)&&(!q||[x.nome,x.fabricante,x.categoria,x.descricao,x.tipo].join(' ').toLocaleLowerCase('pt-BR').includes(q)))
 .sort((a,b)=>String(a[state.sort]??(state.sort.includes('_ate')?'9999':'')).localeCompare(String(b[state.sort]??(state.sort.includes('_ate')?'9999':'')),'pt-BR')*state.direction);
}
function render(){
 const rows=filtered();$('count').textContent=rows.length+' de '+state.items.length+' registros';
 $('tableBody').innerHTML=rows.map(x=>'<tr><td><div class="primary">'+escapeHTML(x.nome)+'</div><div class="secondary">'+escapeHTML(x.resumo||x.descricao)+'</div><div class="secondary">ID: '+escapeHTML(x.id)+'</div></td><td><span class="pill">'+escapeHTML(x.grupo)+'</span></td><td>'+escapeHTML(x.categoria)+'</td><td>'+escapeHTML(x.fabricante)+'</td><td>'+pill(x.status)+'</td><td>'+dateLabel(x.inscricao_ate)+'</td><td><a href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">Fonte ↗</a></td></tr>').join('')||'<tr><td colspan="7" class="empty">Nenhum registro corresponde aos filtros.</td></tr>';
 const groups=[...new Set(rows.map(x=>x.grupo))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 $('cardsView').innerHTML=groups.map(group=>'<section class="cardgroup"><h3>'+escapeHTML(group)+' <span class="groupcount">'+rows.filter(x=>x.grupo===group).length+'</span></h3><div class="cards">'+rows.filter(x=>x.grupo===group).map(x=>'<article class="card"><div class="cardtop"><span class="pill">'+escapeHTML(x.id)+'</span>'+pill(x.status)+'</div><h3>'+escapeHTML(x.nome)+'</h3><div class="meta">'+escapeHTML(x.categoria)+' · '+escapeHTML(x.fabricante)+'</div><p>'+escapeHTML(x.resumo||x.descricao)+'</p><div class="meta">Tipo: '+escapeHTML(x.grupo)+'</div><div class="meta">Inscrição: '+dateLabel(x.inscricao_ate)+' · Voucher: '+dateLabel(x.voucher_ate)+'</div><div class="meta">Certificado do curso: '+escapeHTML(x.certificado_curso||'Não se aplica / não confirmado')+'</div><a href="'+escapeHTML(x.url)+'" target="_blank" rel="noopener noreferrer">Consultar fonte ↗</a></article>').join('')+'</div></section>').join('')||'<p class="empty">Nenhum registro corresponde aos filtros.</p>';
 document.querySelectorAll('[data-group]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.group===state.group));});
}
function groupButtons(){const groups=[...new Set(state.items.map(x=>x.grupo))].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('groupFilters').innerHTML=['',...groups].map(group=>'<button type="button" data-group="'+escapeHTML(group)+'" aria-pressed="false">'+(group?escapeHTML(group):'Todos')+' <span>'+ (group?state.items.filter(x=>x.grupo===group).length:state.items.length)+'</span></button>').join('');$('groupFilters').addEventListener('click',event=>{const b=event.target.closest('button[data-group]');if(!b)return;state.group=b.dataset.group;render();});}
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
  groupButtons();options('category',state.items.map(x=>x.categoria));options('vendor',state.items.map(x=>x.fabricante));render();
 }catch(error){$('count').textContent='Catálogo indisponível';$('tableBody').innerHTML='<tr><td colspan="7" class="empty">Falha ao carregar os dados. Confira a publicação do arquivo data/opportunities.json.</td></tr>';$('notice').textContent='Não foi possível carregar o catálogo: '+error.message;}
}
document.addEventListener('DOMContentLoaded',init);
