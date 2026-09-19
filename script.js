/* Simple site JS: header/footer injection, UI interactions */
(function(){
	'use strict';

	// Inject header and footer if empty
	function injectShell(){
		const header = document.getElementById('site-header');
		if(header && header.innerHTML.trim()===''){
			header.innerHTML = `
				<div class="container nav">
					<div class="brand"><span class="logo-icon"><i class="fa-solid fa-code"></i></span> Sulaiman</div>
					<nav class="nav-links" aria-label="Primary">
						<a href="index.html">Home</a>
						<a href="projects.html">Projects</a>
						<a href="skills.html">Skills</a>
						<a href="about.html">About</a>
						<a href="contact.html">Contact</a>
					</nav>
					<button class="nav-toggle" aria-expanded="false" aria-label="Toggle navigation"><i class="fas fa-bars"></i></button>
				</div>`;
		}

		const footer = document.getElementById('site-footer');
		if(footer && footer.innerHTML.trim()===''){
			footer.innerHTML = `<div class="container"><small>© ${new Date().getFullYear()} Sulaiman — Built with ❤️</small></div>`;
		}
	}

	// Mobile nav toggle
	function initNavToggle(){
		const btn = document.querySelector('.nav-toggle');
		const links = document.querySelector('.nav-links');
		if(!btn || !links) return;
		btn.addEventListener('click', ()=>{
			const expanded = btn.getAttribute('aria-expanded') === 'true';
			btn.setAttribute('aria-expanded', String(!expanded));
			links.classList.toggle('is-open', !expanded);
		});
	}

	// Smooth scroll for same-page anchors
	function initSmoothScroll(){
		document.addEventListener('click', function(e){
			const a = e.target.closest('a');
			if(!a) return;
			const href = a.getAttribute('href')||'';
			if(href.startsWith('#') && href.length>1){
				const el = document.querySelector(href);
				if(el){
					e.preventDefault();
					el.scrollIntoView({behavior:'smooth',block:'start'});
				}
			}
		});
	}

	// Reveal on scroll
	function initReveal(){
		const obs = new IntersectionObserver(entries=>{
			entries.forEach(e=>{
				if(e.isIntersecting) e.target.classList.add('in-view');
			});
		},{threshold:0.15});
		document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
	}

	// Back-to-top
	function initBackToTop(){
		const btn = document.getElementById('back-to-top');
		if(!btn) return;
		window.addEventListener('scroll', ()=>{
			if(window.scrollY>400) btn.classList.add('show'); else btn.classList.remove('show');
		});
		btn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
	}

	// Project modal handler
	function initProjectModal(){
		const modal = document.getElementById('project-modal');
		if(!modal) return;
		const modalClose = modal.querySelector('.modal-close');
		function openModal(card){
			const title = card.querySelector('h3')?.textContent || card.dataset.title || 'Project';
			const desc = card.querySelector('p')?.textContent || '';
			const tech = card.dataset.tech || '';
			modal.querySelector('#modal-title').textContent = title;
			modal.querySelector('#modal-desc').textContent = desc;
			modal.querySelector('#modal-tech').textContent = tech;
			modal.setAttribute('aria-hidden','false');
		}
		function closeModal(){ modal.setAttribute('aria-hidden','true'); }

		document.querySelectorAll('.project-card').forEach(card=>{
			card.addEventListener('click', ()=>openModal(card));
			card.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') openModal(card); });
		});
		modalClose.addEventListener('click', closeModal);
		modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
		document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
	}

	// Contact form basic validation and UX
	function initContactForm(){
		const form = document.getElementById('contact-form');
		if(!form) return;
		const status = document.getElementById('form-status');
		form.addEventListener('submit', function(e){
			e.preventDefault();
			// simple validation
			const name = form.querySelector('#name');
			const email = form.querySelector('#email');
			const message = form.querySelector('#message');
			let ok = true;
			[name,email,message].forEach(input=>{
				const err = form.querySelector(`.field-error[data-for="${input.id}"]`);
				if(!input.value.trim()){ ok=false; err.textContent = 'This field is required'; } else { err.textContent=''; }
			});
			if(!ok){ status.textContent = 'Please fix the errors above.'; return; }
			status.textContent = 'Sending…';
			// mimic async submit
			setTimeout(()=>{ status.textContent = 'Message sent! Thank you.'; form.reset(); }, 900);
		});
	}

	// Convert unstyled anchor links that function as buttons into .btn elements
	function styleUnstyledLinks(){
		const selectors = ['.read-more',' .view-all',' .project-body a',' .projects-row a','.about-top a','.final-cta a'];
		selectors.forEach(sel=>{
			document.querySelectorAll(sel).forEach(a=>{
				if(!(a instanceof HTMLAnchorElement)) return;
				if(a.classList.contains('btn')) return;
				// skip nav links
				if(a.closest('.nav-links')) return;
				// prefer primary for final calls-to-action
				if(a.closest('.final-cta')){ a.classList.add('btn','btn-primary'); return; }
				a.classList.add('btn','btn-secondary');
			});
		});
	}

	// Highlight active nav link based on current pathname
	function setActiveNav(){
		const links = document.querySelectorAll('.nav-links a');
		if(!links.length) return;
		const current = (location.pathname.split('/').pop() || 'index.html');
		links.forEach(a=>{
			try{
				const href = a.getAttribute('href')||'';
				const hrefPath = new URL(href, location.origin).pathname.split('/').pop();
				if(hrefPath === current || (current === '' && (href === '/' || href === 'index.html'))){
					a.classList.add('active'); a.setAttribute('aria-current','page');
				} else {
					a.classList.remove('active'); a.removeAttribute('aria-current');
				}

			}catch(err){/* ignore malformed href */}
		});
	}

	// Hide header on scroll down, show on scroll up
	function initHeaderScroll(){
		const header = document.getElementById('site-header');
		if(!header) return;
		let lastY = window.scrollY;
		let ticking = false;
		function update(){
			const currentY = window.scrollY;
			const delta = currentY - lastY;
			if(Math.abs(delta) < 8){ lastY = currentY; ticking = false; return; }
			if(currentY > lastY && currentY > 80){
				header.classList.add('header-hidden');
			} else {
				header.classList.remove('header-hidden');
			}
			lastY = currentY;
			ticking = false;
		}
		window.addEventListener('scroll', ()=>{
			if(!ticking){
				ticking = true;
				requestAnimationFrame(update);
			}
		}, {passive:true});
	}

	// Init all
	function init(){
		injectShell();
		initNavToggle();
		initSmoothScroll();
		initReveal();
		initBackToTop();
		initProjectModal();
		initContactForm();
		styleUnstyledLinks();
		setActiveNav();
		initHeaderScroll();
	}

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

})();

