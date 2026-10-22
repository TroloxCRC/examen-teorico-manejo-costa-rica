/* Visual sign catalogue and independent practice sessions. */
(() => {
  'use strict';
  const STORAGE_KEY = 'ruta-cr-signals-v1';
  let search = '', selectedCategory = 'Todas', quiz = null, canSave = true;
  const emptyProgress = () => ({ attempts: 0, correct: 0, seen: [], wrong: [] });
  let progress = emptyProgress();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored && typeof stored === 'object') {
      progress = {
        attempts: Number.isFinite(stored.attempts) && stored.attempts >= 0 ? stored.attempts : 0,
        correct: Number.isFinite(stored.correct) && stored.correct >= 0 ? stored.correct : 0,
        seen: Array.isArray(stored.seen) ? [...new Set(stored.seen.filter(id => typeof id === 'string'))] : [],
        wrong: Array.isArray(stored.wrong) ? [...new Set(stored.wrong.filter(id => typeof id === 'string'))] : []
      };
      progress.correct = Math.min(progress.correct, progress.attempts);
    }
  } catch { canSave = false; }
  const allSigns = () => Array.isArray(window.TRAFFIC_SIGNS) ? window.TRAFFIC_SIGNS : [];
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const randomOrder = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch { canSave = false; }
  };
  const filteredSigns = () => {
    const term = normalize(search.trim());
    return allSigns().filter(sign =>
      (selectedCategory === 'Todas' || sign.category === selectedCategory) &&
      (!term || normalize(`${sign.name} ${sign.meaning} ${sign.category}`).includes(term))
    );
  };
  const sourceLink = sign => `<a class="fine" href="${esc(sign.detailUrl)}" target="_blank" rel="noopener noreferrer">Consultar fuente de terceros ↗</a>`;
  const sourceNotice = `<p class="fine signals-source-note">Catálogo incorporado desde <a href="https://licenciadeconducircr.com/senales-de-transito/" target="_blank" rel="noopener noreferrer">Licencia de Conducir CR</a>, un sitio de terceros. Los significados se resumen con fines de estudio. Esta práctica no es un examen oficial.</p>`;
  const active = () => !!document.querySelector('.signals-feature');
  const leave = () => { quiz = null; };
  window.hasActiveSignalPractice = () => !!quiz && active();
  window.leaveSignals = leave;

  function renderCatalogue() {
    quiz = null;
    const signs = allSigns();
    const ids = new Set(signs.map(sign => sign.id));
    const errors = progress.wrong.filter(id => ids.has(id));
    const explored = progress.seen.filter(id => ids.has(id)).length;
    const categories = [...new Set(signs.map(sign => sign.category))];
    if (!categories.includes(selectedCategory)) selectedCategory = 'Todas';
    page(`<section class="signals-feature"><div class="eyebrow">Observá · Reconocé · Comprendé</div><div class="section-head"><div><h1 class="signals-title">Las señales hablan.<br>Aprendé a leerlas.</h1><p class="muted">Explorá las ${signs.length} señales del catálogo y practicá cómo reconocerlas.</p></div><span class="signals-icon" aria-hidden="true">△</span></div><div class="stats" aria-label="Tu progreso en señales"><div class="stat"><strong>${explored}<span> / ${signs.length}</span></strong><span>Señales practicadas</span></div><div class="stat"><strong>${progress.attempts ? Math.round(progress.correct / progress.attempts * 100) : 0}%</strong><span>Aciertos en señales</span></div><div class="stat"><strong>${errors.length}</strong><span>Señales para repasar</span></div></div><div class="signals-toolbar"><div class="signals-field"><label for="signals-search">Buscá una señal</label><input id="signals-search" type="search" placeholder="Por nombre o significado…" value="${esc(search)}" autocomplete="off"></div><div class="signals-field"><label for="signals-category">Tipo de señal</label><select id="signals-category"><option value="Todas">Todas las categorías</option>${categories.map(category => `<option value="${esc(category)}" ${selectedCategory === category ? 'selected' : ''}>${esc(category)}</option>`).join('')}</select></div><button class="btn" id="signals-start">Practicar señales →</button><button class="btn secondary" id="signals-review" ${errors.length ? '' : 'disabled'}>Repasar errores (${errors.length})</button></div><p class="fine">La práctica toma hasta 10 señales del filtro actual. El repaso toma hasta 10 errores de todo el catálogo. Sin límite de tiempo.</p><p class="fine" id="signals-count" role="status" aria-live="polite"></p><div class="signals-grid" id="signals-grid"></div><div class="actions"><span class="fine">El progreso de señales es independiente del examen teórico.</span><button class="btn ghost" id="signals-reset">Borrar progreso de señales</button></div>${sourceNotice}${!canSave ? '<p class="notice">El navegador bloqueó el guardado. Podés seguir practicando, pero el progreso podría perderse al cerrar esta página.</p>' : ''}</section>`, 'signals');
    document.querySelector('#signals-search').oninput = event => { search = event.target.value; updateGrid(); };
    document.querySelector('#signals-category').onchange = event => { selectedCategory = event.target.value; updateGrid(); };
    document.querySelector('#signals-start').onclick = () => startPractice(false);
    document.querySelector('#signals-review').onclick = () => startPractice(true);
    document.querySelector('#signals-reset').onclick = () => ask('¿Borrar el progreso de señales?', 'Se eliminarán los aciertos y errores de señales guardados en este navegador. El historial del examen teórico se conserva.', () => { progress = emptyProgress(); save(); renderCatalogue(); });
    updateGrid();
  }

  function updateGrid() {
    const visible = filteredSigns();
    document.querySelector('#signals-count').textContent = `${visible.length} de ${allSigns().length} señales`;
    document.querySelector('#signals-start').disabled = visible.length === 0;
    document.querySelector('#signals-grid').innerHTML = visible.length
      ? visible.map(sign => `<article class="signals-card"><div class="signals-card-image"><img src="${esc(sign.image)}" alt="${esc(sign.name)}" loading="lazy" decoding="async"></div><div class="signals-card-content"><span class="badge">${esc(sign.category)}</span><h2>${esc(sign.name)}</h2><p>${esc(sign.meaning)}</p>${sourceLink(sign)}</div></article>`).join('')
      : '<div class="signals-empty"><h2>No encontramos esa señal</h2><p class="muted">Probá otro nombre o elegí una categoría diferente.</p></div>';
  }

  function startPractice(review) {
    const pool = review ? allSigns().filter(sign => progress.wrong.includes(sign.id)) : filteredSigns();
    if (!pool.length) return;
    const questions = randomOrder(pool).slice(0, 10).map(sign => {
      const otherNames = new Set();
      const distractors = randomOrder(allSigns().filter(other => other.id !== sign.id && other.name !== sign.name))
        .filter(other => { if (otherNames.has(other.name)) return false; otherNames.add(other.name); return true; })
        .slice(0, 2);
      return { sign, options: randomOrder([sign, ...distractors]), chosen: null, checked: false };
    });
    quiz = { questions, index: 0, review };
    renderQuestion();
  }

  function renderQuestion(focusTitle = false) {
    const current = quiz.questions[quiz.index];
    const correct = current.chosen === current.sign.id;
    page(`<section class="signals-feature quiz"><div class="quiz-top"><button class="btn ghost" id="signals-exit">← Catálogo</button><span class="fine">${quiz.review ? 'Repaso de errores' : 'Práctica visual'} · Sin tiempo límite</span></div><div class="progress" role="progressbar" aria-label="Progreso de práctica de señales" aria-valuemin="0" aria-valuemax="${quiz.questions.length}" aria-valuenow="${quiz.index + 1}"><span style="width:${(quiz.index + 1) / quiz.questions.length * 100}%"></span></div><div class="eyebrow">Señal ${quiz.index + 1} de ${quiz.questions.length}</div><h1 class="question" id="signals-question-title" tabindex="-1">¿Qué indica esta señal?</h1><div class="signals-quiz-image"><img src="${esc(current.sign.image)}" alt="Señal de tránsito para identificar"></div><div role="group" aria-label="Significados posibles">${current.options.map((option, index) => `<button class="option ${current.chosen === option.id ? 'chosen' : ''} ${current.checked && option.id === current.sign.id ? 'correct' : ''} ${current.checked && current.chosen === option.id && !correct ? 'wrong' : ''}" data-signal-answer="${esc(option.id)}" aria-pressed="${current.chosen === option.id}" ${current.checked ? 'disabled' : ''}><span class="letter">${'ABC'[index]}</span><span>${esc(option.name)}</span></button>`).join('')}</div>${current.checked ? `<div class="explanation" role="status"><strong>${correct ? '¡Bien hecho!' : 'Una señal más para aprender.'} ${esc(current.sign.name)}</strong><p>${esc(current.sign.meaning)}</p>${sourceLink(current.sign)}</div>` : ''}<div class="actions"><span class="fine">Tu progreso de señales se guarda al comprobar cada respuesta.</span>${current.checked ? `<button class="btn" id="signals-next">${quiz.index === quiz.questions.length - 1 ? 'Ver resultado' : 'Siguiente señal →'}</button>` : `<button class="btn" id="signals-check" ${current.chosen === null ? 'disabled' : ''}>Comprobar respuesta</button>`}</div>${!canSave ? '<p class="fine">El navegador no permite guardar el progreso de forma permanente.</p>' : ''}</section>`, 'signals');
    document.querySelectorAll('[data-signal-answer]').forEach(button => {
      button.onclick = () => {
        if (current.checked) return;
        current.chosen = button.dataset.signalAnswer;
        renderQuestion();
        document.querySelector(`[data-signal-answer="${current.chosen}"]`).focus();
      };
    });
    document.querySelector('#signals-exit').onclick = () => ask('¿Volver al catálogo?', 'Las respuestas ya comprobadas se conservan. Esta sesión quedará incompleta.', renderCatalogue);
    const check = document.querySelector('#signals-check');
    if (check) check.onclick = () => {
      if (current.checked || current.chosen === null) return;
      current.checked = true;
      progress.attempts++;
      if (!progress.seen.includes(current.sign.id)) progress.seen.push(current.sign.id);
      if (current.chosen === current.sign.id) {
        progress.correct++;
        progress.wrong = progress.wrong.filter(id => id !== current.sign.id);
      } else if (!progress.wrong.includes(current.sign.id)) progress.wrong.push(current.sign.id);
      save();
      renderQuestion();
    };
    const next = document.querySelector('#signals-next');
    if (next) next.onclick = () => {
      if (quiz.index === quiz.questions.length - 1) renderResult();
      else { quiz.index++; renderQuestion(true); }
    };
    if (focusTitle) document.querySelector('#signals-question-title').focus();
  }

  function renderResult() {
    const finished = quiz;
    quiz = null;
    const right = finished.questions.filter(question => question.chosen === question.sign.id).length;
    page(`<section class="signals-feature quiz"><div class="result"><div class="eyebrow">Práctica de señales completada</div><div class="score">${right}<span> / ${finished.questions.length}</span></div><h1 class="signals-result-title">${right === finished.questions.length ? '¡Reconocés el camino!' : 'Cada señal cuenta.'}</h1><p class="muted">Revisá los significados y reforzá las señales que todavía te cuestan.</p><div class="actions signals-result-actions"><button class="btn" id="signals-back">Volver al catálogo</button><button class="btn secondary" id="signals-again">Otra práctica</button></div></div><h2>Repasá tu sesión</h2>${finished.questions.map(question => `<article class="review-item signals-review-item"><img src="${esc(question.sign.image)}" alt="${esc(question.sign.name)}" loading="lazy"><div><span class="badge">${question.chosen === question.sign.id ? '✓ Correcta' : '↺ Para repasar'}</span><h3>${esc(question.sign.name)}</h3>${question.chosen !== question.sign.id ? `<p><strong>Tu respuesta:</strong> ${esc(question.options.find(option => option.id === question.chosen)?.name || 'Sin responder')}</p>` : ''}<p>${esc(question.sign.meaning)}</p>${sourceLink(question.sign)}</div></article>`).join('')}${sourceNotice}</section>`, 'signals');
    document.querySelector('#signals-back').onclick = renderCatalogue;
    document.querySelector('#signals-again').onclick = () => startPractice(false);
  }

  window.renderSignals = renderCatalogue;
  window.addEventListener('beforeunload', event => {
    if (window.hasActiveSignalPractice()) { event.preventDefault(); event.returnValue = ''; }
  });
})();
