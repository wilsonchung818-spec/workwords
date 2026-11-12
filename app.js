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
    result.innerHTML = `<div class="word-head"><div><h2 class="word-title">${escapeHtml(entry.word)}</h2><div class="pronunciation">${escapeHtml(entry.phonetic || '')}</div><span class="pos">${escapeHtml(entry.pos || 'word')}</span></div><button class="save-button ${saved?'saved':''}" id="save-word">${saved?'✓ Saved to My Words':'＋ Add to My Words'}</button></div><p class="definition">${escapeHtml(entry.definition)}</p><div class="language-row"><span>Explanation language</span><div class="language-toggle"><button class="active" data-language="en">English</button><button data-language="zh">中文</button></div></div><div id="translation" class="translation" hidden></div><section class="content-section"><h3>Natural examples</h3><ul class="examples">${(entry.examples.length?entry.examples:['No example sentences were supplied by the dictionary for this entry.']).map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul></section><section class="content-section"><h3>Common prepositions & phrases</h3>${entry.phrases.length?`<ul class="phrases">${entry.phrases.map(([phrase,note])=>`<li>${escapeHtml(phrase)}<small>${escapeHtml(note)}</small></li>`).join('')}</ul>`:'<p class="message">We do not have a reliable collocation entry for this word yet. The definition and examples are still available; saved words work offline.</p>'}</section>`;
    document.querySelector('#save-word').addEventListener('click', saveCurrent);
    result.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>toggleLanguage(button.dataset.language,entry)));
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
      const entry={word:raw.word||clean,phonetic:raw.phonetic||raw.phonetics?.find(item=>item.text)?.text||'',pos:definitions[0]?.pos||meanings[0]?.partOfSpeech||'word',definition:definitions[0]?.definition||'Definition unavailable.',examples:[...new Set(definitions.map(item=>item.example).filter(Boolean))].slice(0,3),phrases:phraseList(clean),savedAt:prior.savedAt||'',note:prior.note||''};
      if(entry.examples.length<2)entry.examples=exampleFallback(entry);
      if(!entry.phrases.length && prior.phrases?.length)entry.phrases=prior.phrases;
      renderResult(entry);
    } catch(error) {
      if(local){renderResult(local);return;}
      result.innerHTML=`<p class="message error">${escapeHtml(error.message||'Could not find that word. Please try again.')}</p>`;
    }
  }
  function exampleFallback(entry){const word=entry.word;const pos=entry.pos.toLowerCase();const lines=pos.includes('noun')?[`We need to discuss ${word} before the project meeting.`,`The team shared an update about ${word}.`]:pos.includes('adjective')?[`We need a more ${word} approach to this project.`,`The plan is ${word} enough to share with the team.`]:pos.includes('adverb')?[`The team handled the change ${word}.`,`Please explain the decision ${word}.`]:[`We should ${word} the plan before the review.`,`The team will ${word} this with the project owner.`];return [...new Set([...entry.examples,...lines])].slice(0,3);}
  function saveCurrent(){if(!current)return;const index=words.findIndex(item=>item.word.toLowerCase()===current.word.toLowerCase());if(index>=0)words[index]={...words[index],...current};else words.unshift({...current,savedAt:new Date().toISOString()});persist();renderResult(current);}
  function renderSaved(){count.textContent=words.length;exportButton.disabled=!words.length;if(!words.length){savedList.innerHTML='<p class="empty">Your saved words will appear here.</p>';return;}savedList.innerHTML=words.map((item,index)=>`<div class="saved-row"><div><span class="saved-word">${escapeHtml(item.word)}</span><span class="saved-pos">${escapeHtml(item.pos||'word')}</span></div><span class="saved-def">${escapeHtml(item.definition)}</span><button aria-label="Remove ${escapeHtml(item.word)}" data-remove="${index}">×</button></div>`).join('');savedList.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{words.splice(Number(button.dataset.remove),1);persist();}));savedList.querySelectorAll('.saved-word').forEach(label=>label.addEventListener('click',()=>lookup(label.textContent)));}
  function wordbookMarkdown(){const date=new Date().toISOString().slice(0,10);return `# WorkWords — Personal Business English Wordbook\n\nExported: ${date}\nWords: ${words.length}\n\n${words.map(item=>`## ${item.word}\n\n- Part of speech: ${item.pos||'Not specified'}\n- Pronunciation: ${item.phonetic||'Not available'}\n- English definition: ${item.definition}\n${item.note?`- My note: ${item.note}\n`:''}\n### Natural examples\n${(item.examples||[]).map(line=>`- ${line}`).join('\n')||'- No examples saved.'}\n\n### Common prepositions and phrases\n${(item.phrases||[]).map(([phrase,note])=>`- **${phrase}** — ${note}`).join('\n')||'- No curated collocations saved.'}\n`).join('\n---\n\n')}`;}
  function exportMarkdown(){const blob=new Blob([wordbookMarkdown()],{type:'text/markdown;charset=utf-8'});download(blob,`workwords-${new Date().toISOString().slice(0,10)}.md`);}
  function download(blob,name){const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
  function exportPdf(){const sheet=document.querySelector('#print-sheet');sheet.innerHTML=`<h1>WorkWords · Personal Business English Wordbook</h1><p>Exported ${new Date().toLocaleDateString()} · ${words.length} words</p>${words.map(item=>`<article><h2>${escapeHtml(item.word)} <small>${escapeHtml(item.pos||'word')} ${escapeHtml(item.phonetic||'')}</small></h2><p><b>English definition:</b> ${escapeHtml(item.definition)}</p><h3>Natural examples</h3><ul>${(item.examples||[]).map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul><h3>Common prepositions and phrases</h3><ul>${(item.phrases||[]).map(([phrase,note])=>`<li><b>${escapeHtml(phrase)}</b> — ${escapeHtml(note)}</li>`).join('')||'<li>No curated collocations saved.</li>'}</ul></article>`).join('')}`;window.print();}
  exportButton.addEventListener('click',()=>document.querySelector('#export-dialog').showModal());
  document.querySelector('#export-md').addEventListener('click',()=>exportMarkdown());
  document.querySelector('#export-pdf').addEventListener('click',()=>exportPdf());
  form.addEventListener('submit',event=>{event.preventDefault();lookup(query.value);});
  document.querySelector('#reminder').addEventListener('click',()=>{const dialog=document.querySelector('#reminder-dialog');document.querySelector('#reminder-day').value=localStorage.getItem(`${STORE}:reminder`)||'Sunday';dialog.showModal();});
  document.querySelector('#reminder-dialog').addEventListener('close',()=>{if(document.querySelector('#reminder-day').value)localStorage.setItem(`${STORE}:reminder`,document.querySelector('#reminder-day').value);});
  document.querySelector('#save-reminder').addEventListener('click',async event=>{if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission();}catch{}}event.preventDefault();document.querySelector('#reminder-dialog').close();});
  document.querySelectorAll('.bottom-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.bottom-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active');}));
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.querySelector('#install').hidden=false;});
  document.querySelector('#install').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.querySelector('#install').hidden=true;});
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  renderSaved();
})();
