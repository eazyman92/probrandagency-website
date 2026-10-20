const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});

// Content stays visible without JavaScript. Reduced motion disables decorative movement.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reducedMotion.matches && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target);}}},{threshold:0.08});
  document.querySelectorAll('.reveal').forEach((element,index)=>{element.style.setProperty('--delay',`${Math.min(index%3*70,140)}ms`);element.classList.add('reveal-pending');observer.observe(element);});
  reducedMotion.addEventListener('change',()=>{document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending'));observer.disconnect();},{once:true});
}
const form=document.querySelector('#inquiry-form');
if(form){
 const topic=new URLSearchParams(location.search).get('service');
 const interest=form.elements.interest;
 if([...interest.options].some(option=>option.value===topic))interest.value=topic;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const selected=interest.selectedOptions[0].textContent;
  const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${selected}\n\n${data.get('message')}`;
  document.querySelector('#email-draft').value=body;
  document.querySelector('#email-fallback').hidden=false;
  document.querySelector('#form-status').textContent='Email draft prepared. Send it from your email app, or copy the message below. Your inquiry has not been sent by this website.';
  location.href=`mailto:info@probrandagency.com?subject=${encodeURIComponent(`ProBrand inquiry: ${selected}`)}&body=${encodeURIComponent(body)}`;
 });
 document.querySelector('#copy-inquiry').addEventListener('click',async()=>{
  const draft=document.querySelector('#email-draft');
  try{await navigator.clipboard.writeText(draft.value);document.querySelector('#form-status').textContent='Message copied. Paste it into an email to info@probrandagency.com.';}
  catch{draft.focus();draft.select();document.querySelector('#form-status').textContent='Select and copy the prepared message, then paste it into your email app.';}
 });
}
