import {records,STORAGE_KEY,filterRecords,parseSaved,toggleSaved,formatDate} from './archive-model.mjs';
const $=id=>document.getElementById(id);
const state={query:'',topic:'Todos',collection:false,saved:[],record:null};
const icons={bookmark:'<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M3 2h10v16l-5-3-5 3Z"/></svg>'};
let toastTimer, opener, scrollPosition=0;
function storageWarning(message){$('storage-warning').textContent=message;$('storage-warning').hidden=false;}
try {state.saved=parseSaved(localStorage.getItem(STORAGE_KEY));}
catch {storageWarning('Não foi possível recuperar a coleção neste dispositivo. Pode continuar a ler e tentar guardar novamente.');}
function announce(message){
  clearTimeout(toastTimer);const toast=$('toast');toast.textContent=message;toast.hidden=false;
  if($('record-dialog').open){toast.classList.add('in-dialog');$('record-dialog').append(toast);}else{toast.classList.remove('in-dialog');document.body.append(toast);}
  toastTimer=setTimeout(()=>toast.hidden=true,4000);
}
function updateRecordSave(){if(!state.record)return;const saved=state.saved.includes(state.record.id);$('record-save').textContent=saved?'Remover da coleção':'Guardar na minha coleção';$('record-save').setAttribute('aria-pressed',String(saved));}
function save(id){
  state.saved=toggleSaved(state.saved,id);const added=state.saved.includes(id);let persisted=true;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.saved));$('storage-warning').hidden=true;}
  catch{persisted=false;storageWarning('O navegador não permitiu guardar a coleção. As alterações ficam apenas nesta página e perdem-se ao recarregar.');}
  render();updateRecordSave();
  announce(persisted?(added?'História guardada na coleção.':'História removida da coleção.'):'Coleção alterada apenas nesta página. Não foi possível guardar neste dispositivo.');
}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function render(){
  const current=document.activeElement?.dataset;
  const focusKey=current?.action&&current?.id?{action:current.action,id:current.id}:null;
  const found=filterRecords(state);$('stories').replaceChildren();
  $('collection-count').textContent=state.saved.length;
  $('archive-view').classList.toggle('active',!state.collection);$('collection-view').classList.toggle('active',state.collection);
  [[$('archive-view'),!state.collection],[$('collection-view'),state.collection]].forEach(([el,active])=>active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current'));
  $('results-title').textContent=state.collection?'A minha coleção':state.topic==='Todos'?'Todas as histórias':`Histórias de ${state.topic.toLocaleLowerCase('pt-PT')}`;
  $('collection-hint').hidden=!state.collection;
  $('result-count').textContent=`${found.length} ${found.length===1?'história':'histórias'}`;
  $('clear-search').hidden=!state.query;
  document.querySelectorAll('[data-topic]').forEach(button=>{const selected=button.dataset.topic===state.topic;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));const amount=filterRecords({topic:button.dataset.topic,collection:state.collection,saved:state.saved}).length;button.querySelector('.topic-count').textContent=amount;});
  const active=[];if(state.query.trim())active.push(`Pesquisa: “${state.query.trim()}”`);if(state.topic!=='Todos')active.push(`Tema: ${state.topic}`);
  $('active-filters').textContent=active.join(' · ');$('active-filters').hidden=!active.length;
  $('stories').hidden=!found.length;$('empty-state').hidden=!!found.length;
  if(!found.length){const emptyCollection=state.collection&&!state.saved.length;
    $('empty-title').textContent=emptyCollection?'A sua coleção começa aqui.':'Nenhuma história encontrada.';
    $('empty-description').textContent=emptyCollection?'Guarde as histórias que quer voltar a ler. Ficam reunidas aqui, neste dispositivo.':'Experimente uma palavra mais simples, como “rio” ou “café”, ou retire os filtros para ver mais histórias.';
    $('empty-action').textContent=emptyCollection?'Explorar o arquivo':'Limpar pesquisa e filtros';
    $('empty-action').dataset.action=emptyCollection?'archive':'reset';
  }
  for(const record of found){
    const story=element('article','story');story.setAttribute('aria-labelledby',`title-${record.id}`);
    story.append(element('div','story-number',record.id));const body=element('div','story-body');const top=element('div','story-top');const summary=element('div');
    const heading=element('h3','story-title');heading.id=`title-${record.id}`;const title=element('button','title-button',record.title);title.type='button';title.dataset.action='open';title.dataset.id=record.id;title.setAttribute('aria-haspopup','dialog');heading.append(title);summary.append(heading,element('p','story-speaker',record.speaker));
    const isSaved=state.saved.includes(record.id);const saver=element('button','save-button');saver.type='button';saver.dataset.action='save';saver.dataset.id=record.id;saver.setAttribute('aria-pressed',String(isSaved));saver.setAttribute('aria-label',`${isSaved?'Remover da coleção':'Guardar na coleção'}: ${record.title}`);saver.title=isSaved?'Remover da coleção':'Guardar na coleção';saver.innerHTML=icons.bookmark;saver.append(element('span','save-label',isSaved?'Guardado':'Guardar'));top.append(summary,saver);
    const firstSentences=record.transcript.match(/^.*?[.!?](?:\s+.*?[.!?])?/)[0];const excerpt=element('p','story-excerpt',`“${firstSentences}${firstSentences.length<record.transcript.length?' […]':''}”`);
    const bottom=element('div','story-bottom');const meta=element('div','story-metadata');const date=element('time','',formatDate(record.recorded,true));date.dateTime=record.recorded;meta.append(element('span','topic-tag',record.topic),date);
    const read=element('button','read-button','Ler transcrição');read.type='button';read.dataset.action='open';read.dataset.id=record.id;read.setAttribute('aria-label',`Ler transcrição: ${record.title}`);read.setAttribute('aria-haspopup','dialog');const arrow=element('span','','→');arrow.setAttribute('aria-hidden','true');read.append(arrow);bottom.append(meta,read);body.append(top,excerpt,bottom);story.append(body);$('stories').append(story);
  }
  if(focusKey){const replacement=document.querySelector(`[data-action="${focusKey.action}"][data-id="${focusKey.id}"]`);if(replacement)replacement.focus({preventScroll:true});else if(!state.record)$('collection-view').focus({preventScroll:true});}
}
function openRecord(id,trigger){
  const record=records.find(item=>item.id===id);if(!record)return;state.record=record;opener=trigger;
  $('record-id').textContent=`Registo ${record.id}`;$('record-title').textContent=record.title;$('record-speaker').textContent=record.speaker;$('record-topic').textContent=record.topic;$('record-date').textContent=formatDate(record.recorded);$('record-transcript').textContent=record.transcript;updateRecordSave();
  scrollPosition=window.scrollY;document.body.style.overflow='hidden';$('record-dialog').showModal();$('record-dialog').scrollTop=0;$('close-record').focus({preventScroll:true});
}
function changeView(collection){state.collection=collection;state.query='';state.topic='Todos';$('search').value='';render();}
$('search-form').addEventListener('submit',event=>event.preventDefault());
$('search').addEventListener('input',event=>{state.query=event.target.value;render();});
$('clear-search').addEventListener('click',()=>{state.query='';$('search').value='';render();$('search').focus();});
$('topic-controls').addEventListener('click',event=>{const button=event.target.closest('[data-topic]');if(!button)return;state.topic=button.dataset.topic;render();});
$('archive-view').addEventListener('click',()=>changeView(false));$('collection-view').addEventListener('click',()=>changeView(true));
$('stories').addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;if(button.dataset.action==='open')openRecord(button.dataset.id,button);else save(button.dataset.id);});
$('empty-action').addEventListener('click',()=>{if($('empty-action').dataset.action==='archive')changeView(false);else{state.query='';state.topic='Todos';$('search').value='';render();}$('search').focus();});
$('record-save').addEventListener('click',()=>save(state.record.id));$('close-record').addEventListener('click',()=>$('record-dialog').close());
$('record-dialog').addEventListener('click',event=>{if(event.target!==$('record-dialog'))return;const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();});
$('record-dialog').addEventListener('close',()=>{const recordId=state.record?.id;state.record=null;document.body.style.overflow='';window.scrollTo({top:scrollPosition,behavior:'instant'});$('toast').hidden=true;$('toast').classList.remove('in-dialog');document.body.append($('toast'));const target=opener?.isConnected?opener:document.querySelector(`[data-action="open"][data-id="${recordId}"]`)||$('collection-view');target.focus({preventScroll:true});});
window.addEventListener('storage',event=>{if(event.key!==STORAGE_KEY&&event.key!==null)return;try{state.saved=parseSaved(localStorage.getItem(STORAGE_KEY));render();updateRecordSave();}catch{storageWarning('Não foi possível atualizar a coleção a partir deste dispositivo.');}});
render();
