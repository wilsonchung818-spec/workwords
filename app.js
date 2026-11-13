(() => {
  'use strict';
  const STORE = 'workwords:v1';
  const result = document.querySelector('#result');
  const form = document.querySelector('#search-form');
  const query = document.querySelector('#query');
  const savedList = document.querySelector('#saved-list');
  const count = document.querySelector('#word-count');
  const exportButton = document.querySelector('#export');
  let words = loadWords();
  let current = null;
  let installPrompt = null;
  let suggestionTimer = null;
  let suggestionRequest = 0;
  let selectedSuggestion = -1;
  const reviewIntervals = [1, 2, 4, 7, 15, 30];
  const simpleMeanings = {
    alignment: 'Agreement. People understand the goal in the same way.',
    scope: 'The work a project includes.',
    stakeholder: 'A person or group affected by a project.',
    mitigate: 'To make a risk or problem smaller.',
    blocker: 'A problem that stops work from moving forward.',
    deliverable: 'A piece of work the project must finish.',
    dependency: 'Work that must happen before other work can continue.',
    estimate: 'A best guess about time, cost, or effort.',
    requirement: 'Something a product or service must do.',
    backlog: 'A list of work the team may do.',
    facilitate: 'To help a group talk and work together.',
    clarify: 'To make something easier to understand.',
    resolve: 'To find an answer to a problem.',
    escalate: 'To tell a person with more authority about a problem.',
    impact: 'A change or result caused by something.',
    capacity: 'How much work a person or team can do.',
    priority: 'How important something is.',
    outcome: 'The result of an action or plan.',
    approval: 'Permission to do something.',
    feedback: 'Ideas or comments that can help improve something.',
    decision: 'A choice made after thinking about options.',
    evidence: 'Facts that show something is true.',
    assumption: 'An idea people accept as true before they check it.'
  };
  const examplesByWord = {
    alignment: ['Let’s get alignment on the launch plan.', 'We need alignment across product and operations.'],
    scope: ['Let’s confirm the scope before we estimate the work.', 'That request is outside the agreed scope.'],
    stakeholder: ['We shared the update with every key stakeholder.', 'The stakeholder asked for a clear delivery date.'],
    mitigate: ['We added a second check to mitigate the risk.', 'This step will mitigate the impact of the delay.'],
    blocker: ['The vendor delay is our main blocker.', 'Can you help us remove this blocker today?'],
    requirement: ['This requirement needs approval from the business.', 'We tested the requirement with users.'],
    dependency: ['The team is tracking a dependency on the data group.', 'This dependency may affect the release date.']
  };
  const collocations = {
    alignment: [['alignment on', 'agreement about a topic'], ['alignment with', 'agreement with a goal or strategy'], ['get / reach alignment', 'come to a shared understanding']],
    scope: [['project scope', 'the work included in a project'], ['in scope / out of scope', 'included / not included in the agreed work'], ['scope of work', 'the work and services agreed']],
    stakeholder: [['key stakeholder', 'a person or group with strong interest or influence'], ['stakeholder engagement', 'working with people affected by a project'], ['stakeholder expectations', 'what stakeholders believe will happen']],
    mitigate: [['mitigate a risk', 'reduce the chance or impact of a risk'], ['mitigate the impact', 'make the effect less harmful'], ['risk mitigation', 'actions that reduce risk']],
    blocker: [['remove / resolve a blocker', 'take away an issue stopping progress'], ['blocker to progress', 'something that prevents work from moving forward'], ['blocked by', 'unable to proceed because of something']],
    deliverable: [['key deliverable', 'an important output of a project'], ['deliverable for', 'an output prepared for a person or purpose'], ['meet a deliverable', 'complete an agreed output']],
    dependency: [['dependency on', 'something required from another task or team'], ['manage dependencies', 'coordinate work that relies on other work'], ['cross-team dependency', 'a dependency between teams']],
    estimate: [['rough estimate', 'an early estimate with limited detail'], ['estimate for', 'a predicted amount of time or cost for work'], ['provide an estimate', 'give a predicted time or cost']],
    requirement: [['business requirement', 'a need the business wants to meet'], ['functional requirement', 'what a system must do'], ['meet a requirement', 'satisfy a stated need']],
    backlog: [['product backlog', 'the ordered list of product work'], ['backlog item', 'one piece of work in the backlog'], ['refine the backlog', 'clarify and prepare upcoming work']],
    facilitate: [['facilitate a meeting', 'help a group work through a meeting'], ['facilitate a discussion', 'guide a discussion without deciding for the group'], ['facilitate change', 'help a change happen smoothly']],
    align: [['align on', 'agree about a topic'], ['align with', 'match or agree with a goal'], ['align expectations', 'make sure people expect the same thing']],
    assess: [['assess the impact', 'judge the likely effect'], ['assess a risk', 'consider how likely and serious a risk is'], ['assess against', 'judge using a standard']],
    clarify: [['clarify a requirement', 'make a requirement easier to understand'], ['clarify ownership', 'make clear who is responsible'], ['clarify expectations', 'make clear what people expect']],
    resolve: [['resolve an issue', 'find a solution to a problem'], ['resolve a conflict', 'settle a disagreement'], ['resolve by', 'find a solution using a method']],
    escalate: [['escalate an issue', 'raise an issue to someone with more authority'], ['escalate to', 'refer something to a higher level'], ['escalate a risk', 'make decision-makers aware of a risk']],
    impact: [['impact on', 'an effect on something'], ['business impact', 'an effect on business results or work'], ['impact assessment', 'a review of likely effects']],
    capacity: [['team capacity', 'the amount of work a team can take on'], ['capacity for', 'available ability or time for something'], ['plan capacity', 'work out how much work can be done']],
    priority: [['high priority', 'more important than other work'], ['prioritize work', 'decide what should be done first'], ['priority over', 'more important than something else']],
    implement: [['implement a change', 'put a change into use'], ['implement a solution', 'make a solution work in practice'], ['implementation plan', 'a plan for putting something into use']],
    outcome: [['business outcome', 'a result that matters to the business'], ['desired outcome', 'the result people want'], ['outcome of', 'the result of an action or event']],
    approval: [['seek approval', 'ask for formal agreement'], ['approval from', 'agreement given by someone'], ['final approval', 'the last required agreement']],
    action: [['action item', 'a task agreed in a meeting'], ['take action', 'do something to address a situation'], ['action owner', 'the person responsible for a task']],
    issue: [['raise an issue', 'bring a problem to attention'], ['resolve an issue', 'find a solution to a problem'], ['issue with', 'a problem related to something']],
    risk: [['mitigate a risk', 'reduce the chance or impact of a risk'], ['at risk', 'in danger of a problem or loss'], ['risk of', 'the possibility of something harmful']],
    release: [['release date', 'the planned date software becomes available'], ['release plan', 'a plan for making a product available'], ['release to production', 'make software available to real users']],
    feedback: [['provide feedback', 'give comments or advice'], ['feedback on', 'comments about something'], ['act on feedback', 'make changes based on comments']],
    decision: [['make a decision', 'choose after considering options'], ['decision on', 'a choice about a topic'], ['decision owner', 'the person accountable for a choice']],
    evidence: [['supporting evidence', 'information that backs up a claim'], ['evidence of', 'information showing that something is true'], ['evidence-based', 'guided by facts or research']],
    comply: [['comply with', 'act according to a rule or request'], ['comply with policy', 'follow an organization’s policy'], ['compliance requirement', 'a rule that must be followed']],
    strategy: [['business strategy', 'a plan for reaching business goals'], ['align with the strategy', 'support the agreed plan'], ['strategy for', 'a plan for doing something']],
    resource: [['allocate resources', 'assign people or tools to work'], ['resource constraint', 'a limit on available people or tools'], ['human resources', 'people available to do work']],
    assumption: [['make an assumption', 'accept something as true without proof'], ['based on the assumption', 'using an unverified idea as a starting point'], ['validate an assumption', 'check whether an idea is true']],
    transparent: [['be transparent about', 'be open and clear about something'], ['transparent process', 'a process people can understand'], ['fully transparent', 'open about all relevant information']],
    collaborate: [['collaborate with', 'work together with someone'], ['collaborate on', 'work together on a task'], ['cross-functional collaboration', 'cooperation across different teams']],
    negotiate: [['negotiate with', 'discuss to reach an agreement'], ['negotiate a deadline', 'discuss and agree on a date'], ['negotiate terms', 'discuss and agree on conditions']],
    validate: [['validate a requirement', 'check whether a requirement is correct'], ['validate with users', 'check with the people who will use it'], ['validate an assumption', 'test whether an idea is true']],
    coordinate: [['coordinate with', 'organize work together with someone'], ['coordinate across teams', 'organize work among several teams'], ['coordinate delivery', 'organize the work needed to deliver']],
    efficient: [['efficient process', 'a process that uses little time or effort'], ['work efficiently', 'work well without wasting time'], ['cost-efficient', 'giving good value for the cost']],
    sufficient: [['sufficient for', 'enough for a purpose'], ['sufficient evidence', 'enough information to support a conclusion'], ['sufficient time', 'enough time to do something']],
    accountable: [['accountable for', 'responsible for the result of something'], ['hold someone accountable', 'expect someone to take responsibility'], ['accountable to', 'responsible to a person or group']]
  };
  function loadWords() { try { const data = JSON.parse(localStorage.getItem(STORE) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; } }
  function persist() { localStorage.setItem(STORE, JSON.stringify(words)); renderSaved(); }
  function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]); }
  function cleanWord(value) { return value.trim().toLowerCase().replace(/[^a-z -]/g, '').trim(); }
  function phraseList(word) { const hit = collocations[word.toLowerCase()]; return hit || []; }
  function renderResult(entry) {
    current = entry;
    const saved = words.some(item => item.word.toLowerCase() === entry.word.toLowerCase());
    const pronunciations=(entry.pronunciations?.length?entry.pronunciations:[{region:'US',ipa:entry.phonetic,audio:entry.audioUrl}]).filter((item,index,list)=>item.ipa||item.audio).filter((item,index,list)=>list.findIndex(other=>other.region===item.region)===index);
    for(const region of ['US','UK'])if(!pronunciations.some(item=>item.region===region))pronunciations.push({region,ipa:'',audio:''});
    const audio=pronunciations.map((item,index)=>item.audio?`<audio id="pron-audio-${index}" preload="none" src="${escapeHtml(item.audio)}"></audio>`:'').join('');
    const senses=(entry.meanings||[]).map(group=>{
      const definitions=group.senses||group.definitions||[];
      const rendered=definitions.map((sense,index)=>{
        const definition=typeof sense==='string'?sense:sense.definition;
        const examples=typeof sense==='string'?[]:(sense.examples||[]);
        const synonyms=typeof sense==='string'?[]:(sense.synonyms||[]);
        return `<li class="sense-item"><p>${escapeHtml(definition)}</p>${examples.length?`<ul class="sense-examples">${examples.slice(0,3).map(example=>`<li>${escapeHtml(example)}</li>`).join('')}</ul>${examples.length>3?`<details class="more-examples"><summary>Show ${examples.length-3} more examples</summary><ul class="sense-examples">${examples.slice(3).map(example=>`<li>${escapeHtml(example)}</li>`).join('')}</ul></details>`:''}`:''}${synonyms.length?`<div class="sense-related"><span>Related:</span> ${synonyms.slice(0,6).map(word=>`<button type="button" data-related="${escapeHtml(word)}">${escapeHtml(word)}</button>`).join('')}</div>`:''}</li>`;
      }).join('');
      return `<section class="sense-group"><h3>${escapeHtml(group.pos)}</h3><ol>${rendered}</ol></section>`;
    }).join('');
    const related=[...new Set((entry.meanings||[]).flatMap(group=>(group.senses||[]).flatMap(sense=>typeof sense==='string'?[]:(sense.synonyms||[]))))].slice(0,12);
    result.innerHTML = `<div class="word-head"><div><h2 class="word-title">${escapeHtml(entry.word)}</h2><span class="pos">${escapeHtml((entry.partsOfSpeech||[entry.pos||'word']).join(' · '))}</span></div><div class="word-actions"><button class="listen-button" id="listen-word" aria-label="Listen to ${escapeHtml(entry.word)}">🔊 <span>Listen</span></button><button class="save-button ${saved?'saved':''}" id="save-word">${saved?'✓ Saved':'＋ Save word'}</button></div></div><div class="pronunciation-list" aria-label="Pronunciation">${pronunciations.map((item,index)=>`<div class="pronunciation-item"><span class="pronunciation-region">${escapeHtml(item.region==='UK'?'UK':'US')}</span><span class="pronunciation-ipa">${escapeHtml(item.ipa||'IPA unavailable')}</span><button type="button" class="pronunciation-play" data-pronounce="${index}" aria-label="Play ${escapeHtml(item.region==='UK'?'UK':'US')} pronunciation">🔊 <span>Play</span></button></div>`).join('')}</div>${audio}<section class="content-section simple-definition"><h3>Simple English</h3><p class="definition">${escapeHtml(entry.definition)}</p><div class="language-row"><span>Meaning</span><div class="language-toggle"><button class="active" data-language="en">English</button><button data-language="zh">中文</button></div></div><div id="translation" class="translation" hidden></div></section><section class="content-section meanings-section"><h3>Meanings & examples</h3>${senses||`<p class="message">${escapeHtml(entry.definition)}</p>`}</section>${related.length?`<section class="content-section"><h3>Related words</h3><div class="related-words">${related.map(word=>`<button type="button" data-related="${escapeHtml(word)}">${escapeHtml(word)} <span>→</span></button>`).join('')}</div></section>`:''}<section class="content-section"><h3>Common phrases & usage</h3>${entry.phrases.length?`<ul class="phrases">${entry.phrases.map(([phrase,note])=>`<li><strong>${escapeHtml(phrase)}</strong><small>${escapeHtml(note)}</small></li>`).join('')}</ul>`:'<p class="message">No common phrases or example sentences are available for this word yet.</p>'}</section>`;
    document.querySelector('#save-word').addEventListener('click', saveCurrent);
    document.querySelector('#listen-word').addEventListener('click',()=>speakEntry(entry));
    result.querySelectorAll('[data-pronounce]').forEach(button=>button.addEventListener('click',()=>playPronunciation(entry,pronunciations[Number(button.dataset.pronounce)],Number(button.dataset.pronounce))));
    result.querySelectorAll('[data-related]').forEach(button=>button.addEventListener('click',()=>lookup(button.dataset.related)));
    result.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>toggleLanguage(button.dataset.language,entry)));
  }
  function playPronunciation(entry,pronunciation,index){
    const audio=document.querySelector(`#pron-audio-${index}`);
    if(audio){audio.currentTime=0;audio.play().catch(()=>speakWithDeviceVoice(entry,null,pronunciation.region));return;}
    speakWithDeviceVoice(entry,null,pronunciation.region);
  }
  function speakEntry(entry){
    const femaleVoice=('speechSynthesis'in window?speechSynthesis.getVoices():[]).find(voice=>/^en([-_]|$)/i.test(voice.lang)&&/(female|aria|jenny|samantha|zira|susan|hazel|libby|sonia|ava|karen|sara|michelle|june|google us english)/i.test(voice.name));
    if(femaleVoice){speakWithDeviceVoice(entry,femaleVoice);return;}
    const audio=document.querySelector('#word-audio');
    if(audio){audio.currentTime=0;audio.play().catch(()=>speakWithDeviceVoice(entry));return;}
    speakWithDeviceVoice(entry);
  }
  function speakWithDeviceVoice(entry,preferredVoice=null,region='US'){
    if(!('speechSynthesis'in window)){showToast('Audio playback is not available on this device.');return;}
    const utterance=new SpeechSynthesisUtterance(entry.word);
    const voices=speechSynthesis.getVoices();
    const female=voices.find(voice=>/^en([-_]|$)/i.test(voice.lang)&&/(female|aria|jenny|samantha|zira|susan|hazel|libby|sonia|ava|karen|sara|michelle|june)/i.test(voice.name));
    const regional=voices.find(voice=>region==='UK'?/^en-GB/i.test(voice.lang):/^en-US/i.test(voice.lang));
    utterance.voice=preferredVoice||regional||female||voices.find(voice=>/^en/i.test(voice.lang))||null;
    utterance.lang=utterance.voice?.lang||(region==='UK'?'en-GB':'en-US');
    utterance.rate=.88;utterance.pitch=1.08;speechSynthesis.cancel();speechSynthesis.speak(utterance);
  }
  function showToast(message){let toast=document.querySelector('#toast');if(!toast){toast=document.createElement('div');toast.id='toast';toast.className='toast';document.body.append(toast);}toast.textContent=message;toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),2200);}
  function plainDefinition(definition=''){
    return definition.replace(/\([^)]*\)/g,'').replace(/\bthe act of\b/gi,'to').replace(/\bthe process of\b/gi,'when people').replace(/\bpertaining to\b/gi,'about').replace(/\brelating to\b/gi,'about').replace(/\bin order to\b/gi,'to').replace(/\butilize\b/gi,'use').replace(/\bcommence\b/gi,'start').replace(/\bendeavor\b/gi,'try').replace(/\bfacilitate\b/gi,'help').replace(/\bapproximately\b/gi,'about').replace(/\bobtain\b/gi,'get').replace(/\bsufficient\b/gi,'enough').replace(/\bsubsequent\b/gi,'next').replace(/\bprior to\b/gi,'before').replace(/\bregarding\b/gi,'about').replace(/\bindividuals\b/gi,'people').replace(/\bcharacterized by\b/gi,'that has').trim();
  }
  async function toggleLanguage(language, entry) {
    result.querySelectorAll('[data-language]').forEach(button=>button.classList.toggle('active',button.dataset.language===language));
    const box = document.querySelector('#translation');
    if(language==='en'){box.hidden=true;return;}
    box.hidden=false;box.textContent='Loading Chinese meaning…';
    try { const response=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(entry.definition)}&langpair=en|zh-CN`); const data=await response.json(); const translated=data?.responseData?.translatedText; box.textContent=translated && data.responseStatus===200 ? translated : '暂时无法获取中文释义，请稍后重试。'; }
    catch { box.textContent='当前无法连接翻译服务，请检查网络后重试。'; }
  }
  async function lookup(word) {
    const clean=cleanWord(word); if(!clean)return;
    query.value=clean; result.innerHTML='<p class="message">Looking up the word…</p>';
    const local=words.find(item=>item.word.toLowerCase()===clean);
    if(!navigator.onLine && local){renderResult(local);return;}
    try {
      const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`);
      if(!response.ok)throw new Error('No dictionary entry found. Check the spelling or try another word.');
      const [raw]=await response.json(); const meanings=raw.meanings||[];
      const definitions=meanings.flatMap(item=>(item.definitions||[]).map(def=>({pos:item.partOfSpeech,definition:def.definition,example:def.example}))).filter(item=>item.definition);
      const prior=local||{};
      const simple=[...definitions].sort((a,b)=>a.definition.length-b.definition.length)[0]?.definition||'Definition unavailable.';
      const audio=raw.phonetics?.find(item=>item.audio&&/^https?:/.test(item.audio))?.audio||'';
      const pronunciations=(raw.phonetics||[]).filter(item=>item.text||item.audio).map(item=>{const source=item.audio||'';const region=/[_-](uk|gb)(?:[_\-.]|$)/i.test(source)?'UK':'US';return{ipa:item.text||'',audio:/^https?:/.test(source)?source:'',region};}).reduce((list,item)=>{const existing=list.find(pronunciation=>pronunciation.region===item.region);if(existing){existing.ipa||=item.ipa;existing.audio||=item.audio;}else list.push(item);return list;},[]);
      for(const region of ['US','UK'])if(!pronunciations.some(item=>item.region===region))pronunciations.push({region,ipa:'',audio:''});
      const simpleEntry={word:raw.word||clean,phonetic:raw.phonetic||raw.phonetics?.find(item=>item.text)?.text||'',pos:definitions[0]?.pos||meanings[0]?.partOfSpeech||'word',partsOfSpeech:[...new Set(meanings.map(item=>item.partOfSpeech).filter(Boolean))],meanings:meanings.map(item=>({pos:item.partOfSpeech||'word',definitions:(item.definitions||[]).map(def=>def.definition).filter(Boolean),senses:(item.definitions||[]).filter(def=>def.definition).map(def=>({definition:def.definition,examples:def.example?[def.example]:[],synonyms:def.synonyms||[]}))})).filter(item=>item.senses.length),definition:simpleMeanings[clean]||plainDefinition(simple),examples:[...new Set(definitions.map(item=>item.example).filter(Boolean))].slice(0,3),phrases:phraseList(clean),audioUrl:audio,pronunciations,savedAt:prior.savedAt||'',reviewStage:prior.reviewStage??0,nextReviewAt:prior.nextReviewAt||'',reviewCount:prior.reviewCount||0,lastReviewedAt:prior.lastReviewedAt||''};
      if(simpleEntry.examples.length<2){const curated=examplesByWord[clean]||[];simpleEntry.examples=[...new Set([...simpleEntry.examples,...curated])].slice(0,3);}
      const firstSense=simpleEntry.meanings[0]?.senses[0];
      if(firstSense&&simpleEntry.examples.length)firstSense.examples=[...new Set([...firstSense.examples,...simpleEntry.examples])].slice(0,5);
      if(!simpleEntry.phrases.length&&simpleEntry.examples.length)simpleEntry.phrases=simpleEntry.examples.map(example=>[example,'Dictionary example']);
      const entry=simpleEntry;
      if(!entry.phrases.length && prior.phrases?.length)entry.phrases=prior.phrases;
      renderResult(entry);
    } catch(error) {
      if(local){renderResult(local);return;}
      result.innerHTML=`<p class="message error">${escapeHtml(error.message||'Could not find that word. Please try again.')}</p>`;
    }
  }
  function saveCurrent(){if(!current)return;const index=words.findIndex(item=>item.word.toLowerCase()===current.word.toLowerCase());if(index>=0)words[index]={...words[index],...current};else words.unshift({...current,savedAt:new Date().toISOString(),reviewStage:0,nextReviewAt:addDays(new Date(),1).toISOString().slice(0,10),reviewCount:0});persist();renderResult(current);showToast('Saved. First review is due tomorrow.');}
  function addDays(date,days){const next=new Date(date);next.setDate(next.getDate()+days);return next;}
  function dateKey(date){const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);return local.toISOString().slice(0,10);}
  function renderSaved(){count.textContent=words.length;exportButton.disabled=!words.length;if(!words.length){savedList.innerHTML='<p class="empty">You have not saved any words yet. Use Search to add one.</p>';return;}savedList.innerHTML=words.map((item,index)=>`<div class="saved-row"><button class="saved-word-button" data-open="${index}"><span class="saved-word">${escapeHtml(item.word)}</span><span class="saved-pos">${escapeHtml((item.partsOfSpeech||[item.pos||'word']).join(' · '))}</span></button><span class="saved-def">${escapeHtml(item.definition)}<small>${item.nextReviewAt?`Next review ${escapeHtml(item.nextReviewAt)}`:'Review due tomorrow'} · <button class="schedule-now" data-schedule="${index}">Review today</button></small></span><button aria-label="Remove ${escapeHtml(item.word)}" data-remove="${index}">×</button></div>`).join('');savedList.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{words.splice(Number(button.dataset.remove),1);persist();}));savedList.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const item=words[Number(button.dataset.open)];switchView('search');renderResult(item);query.value=item.word;}));savedList.querySelectorAll('[data-schedule]').forEach(button=>button.addEventListener('click',()=>{words[Number(button.dataset.schedule)].nextReviewAt=dateKey(new Date());persist();showToast('Added to today’s review.');}));renderReview();}
  function renderReview(){
    const today=dateKey(new Date());
    const due=words.filter(item=>!item.nextReviewAt||item.nextReviewAt<=today).sort((a,b)=>(a.nextReviewAt||'').localeCompare(b.nextReviewAt||''));
    document.querySelector('#due-count').textContent=due.length;
    const list=document.querySelector('#review-list');
    if(!due.length){const next=words.filter(item=>item.nextReviewAt).sort((a,b)=>a.nextReviewAt.localeCompare(b.nextReviewAt)).slice(0,5);list.innerHTML=`<p class="empty">You are all caught up for today.</p>${next.length?`<h3>Coming up</h3>${next.map(item=>`<div class="upcoming-row"><b>${escapeHtml(item.word)}</b><span>${escapeHtml(item.nextReviewAt)}</span></div>`).join('')}`:''}`;return;}
    list.innerHTML=due.map(item=>`<article class="review-word"><div class="review-word-head"><div><h2>${escapeHtml(item.word)}</h2></div><button class="listen-button" data-review-audio="${escapeHtml(item.word)}" aria-label="Listen to ${escapeHtml(item.word)}">🔊</button></div><div class="review-answer" hidden><span>${escapeHtml((item.partsOfSpeech||[item.pos||'word']).join(' · '))}</span><p class="review-definition">${escapeHtml(item.definition)}</p><p>${escapeHtml(item.examples?.[0]||'')}</p><div class="review-actions"><button data-review-hard="${escapeHtml(item.word)}">Hard · tomorrow</button><button data-review-good="${escapeHtml(item.word)}">I remembered</button></div></div><button class="reveal-button" data-reveal="${escapeHtml(item.word)}">Show answer</button></article>`).join('');
    list.querySelectorAll('[data-reveal]').forEach(button=>button.addEventListener('click',()=>{button.hidden=true;button.closest('.review-word').querySelector('.review-answer').hidden=false;}));
    list.querySelectorAll('[data-review-hard],[data-review-good]').forEach(button=>button.addEventListener('click',()=>reviewWord(button.dataset.reviewGood||button.dataset.reviewHard,button.hasAttribute('data-review-good'))));
    list.querySelectorAll('[data-review-audio]').forEach(button=>button.addEventListener('click',()=>{const item=words.find(word=>word.word===button.dataset.reviewAudio);if(item)speakEntry(item);}));
  }
  function reviewWord(word,remembered){const item=words.find(entry=>entry.word===word);if(!item)return;const stage=Number(item.reviewStage||0);const days=remembered?reviewIntervals[Math.min(stage+1,reviewIntervals.length-1)]:1;if(remembered)item.reviewStage=Math.min(stage+1,reviewIntervals.length-1);item.reviewCount=Number(item.reviewCount||0)+1;item.lastReviewedAt=dateKey(new Date());item.nextReviewAt=dateKey(addDays(new Date(),days));persist();showToast(remembered?`Next review in ${days} day${days===1?'':'s'}.`:'Added back for tomorrow.');}
  async function updateSuggestions(){
    const typed=cleanWord(query.value);const box=document.querySelector('#suggestions');selectedSuggestion=-1;
    if(typed.length<2){box.hidden=true;box.innerHTML='';return;}
    const request=++suggestionRequest;box.innerHTML='<li class="suggestion-status">Finding similar words…</li>';box.hidden=false;
    try{const response=await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(typed+'*')}&max=7&md=d`);if(!response.ok)throw new Error('suggestions unavailable');let matches=await response.json();if(!matches.length){const near=await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(typed)}&max=5&md=d`);matches=near.ok?await near.json():[];}if(request!==suggestionRequest)return;const unique=[...new Set(matches.map(item=>item.word).filter(word=>word&&/^[a-z -]+$/i.test(word)))].slice(0,7);box.innerHTML=unique.length?unique.map((word,index)=>`<li><button type="button" role="option" aria-selected="false" data-suggestion="${escapeHtml(word)}"><b>${escapeHtml(word)}</b><span>${escapeHtml(matches.find(match=>match.word===word)?.tags?.find(tag=>['n','v','adj','adv'].includes(tag))||'English word')}</span></button></li>`).join(''):'<li class="suggestion-status">No close matches. Press Search to look it up.</li>';box.hidden=!unique.length;box.querySelectorAll('[data-suggestion]').forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.suggestion;box.hidden=true;lookup(selected);}));}
    catch{if(request===suggestionRequest){box.innerHTML='<li class="suggestion-status">Suggestions need an internet connection.</li>';box.hidden=false;}}
  }
  function moveSuggestion(direction){const options=[...document.querySelectorAll('#suggestions [data-suggestion]')];if(!options.length)return;selectedSuggestion=Math.max(0,Math.min(options.length-1,selectedSuggestion+direction));options.forEach((option,index)=>option.setAttribute('aria-selected',String(index===selectedSuggestion)));}
  function chooseSuggestion(){const options=[...document.querySelectorAll('#suggestions [data-suggestion]')];if(selectedSuggestion<0||!options[selectedSuggestion])return false;const selected=options[selectedSuggestion].dataset.suggestion;document.querySelector('#suggestions').hidden=true;lookup(selected);return true;}
  function switchView(view){document.querySelectorAll('.app-view').forEach(section=>section.classList.toggle('active-view',section.id===`${view}-view`));document.querySelectorAll('.bottom-nav [data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));if(view==='saved')renderSaved();if(view==='review')renderReview();}
  function wordbookMarkdown(){const date=new Date().toISOString().slice(0,10);return `# WorkWords — Personal Business English Wordbook\n\nExported: ${date}\nWords: ${words.length}\n\n${words.map(item=>`## ${item.word}\n\n- Parts of speech: ${(item.partsOfSpeech||[item.pos||'Not specified']).join(', ')}\n- Pronunciation: ${item.phonetic||'Not available'}\n- Simple English: ${item.definition}\n- Next review: ${item.nextReviewAt||'Not scheduled'}\n\n### Meanings\n${(item.meanings||[]).map(group=>`#### ${group.pos}\n${group.definitions.map(def=>`- ${def}`).join('\n')}`).join('\n\n')||'- No additional meanings saved.'}\n\n### Natural examples\n${(item.examples||[]).map(line=>`- ${line}`).join('\n')||'- No examples saved.'}\n\n### Common prepositions and phrases\n${(item.phrases||[]).map(([phrase,note])=>`- **${phrase}** — ${note}`).join('\n')||'- No curated collocations saved.'}\n`).join('\n---\n\n')}`;}
  function exportMarkdown(){const blob=new Blob([wordbookMarkdown()],{type:'text/markdown;charset=utf-8'});download(blob,`workwords-${new Date().toISOString().slice(0,10)}.md`);}
  function download(blob,name){const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
  function exportPdf(){const sheet=document.querySelector('#print-sheet');sheet.innerHTML=`<h1>WorkWords · Personal Business English Wordbook</h1><p>Exported ${new Date().toLocaleDateString()} · ${words.length} words</p>${words.map(item=>`<article><h2>${escapeHtml(item.word)} <small>${escapeHtml((item.partsOfSpeech||[item.pos||'word']).join(', '))} ${escapeHtml(item.phonetic||'')}</small></h2><p><b>Simple English:</b> ${escapeHtml(item.definition)}</p>${(item.meanings||[]).map(group=>`<h3>${escapeHtml(group.pos)}</h3><ul>${group.definitions.map(def=>`<li>${escapeHtml(def)}</li>`).join('')}</ul>`).join('')}<h3>Natural examples</h3><ul>${(item.examples||[]).map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul><h3>Common prepositions and phrases</h3><ul>${(item.phrases||[]).map(([phrase,note])=>`<li><b>${escapeHtml(phrase)}</b> — ${escapeHtml(note)}</li>`).join('')||'<li>No curated collocations saved.</li>'}</ul><p><b>Next review:</b> ${escapeHtml(item.nextReviewAt||'Not scheduled')}</p></article>`).join('')}`;window.print();}
  exportButton.addEventListener('click',()=>document.querySelector('#export-dialog').showModal());
  document.querySelector('#export-md').addEventListener('click',()=>exportMarkdown());
  document.querySelector('#export-pdf').addEventListener('click',()=>exportPdf());
  form.addEventListener('submit',event=>{event.preventDefault();if(!chooseSuggestion())lookup(query.value);});
  query.addEventListener('input',()=>{clearTimeout(suggestionTimer);suggestionTimer=setTimeout(updateSuggestions,220);});
  query.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();moveSuggestion(1);}else if(event.key==='ArrowUp'){event.preventDefault();moveSuggestion(-1);}else if(event.key==='Enter'&&!document.querySelector('#suggestions').hidden&&selectedSuggestion>=0){event.preventDefault();chooseSuggestion();}else if(event.key==='Escape'){document.querySelector('#suggestions').hidden=true;}});
  document.addEventListener('click',event=>{if(!form.contains(event.target))document.querySelector('#suggestions').hidden=true;});
  document.querySelectorAll('.bottom-nav [data-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.querySelector('#install').hidden=false;});
  document.querySelector('#install').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.querySelector('#install').hidden=true;});
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  renderSaved();
  renderReview();
})();
