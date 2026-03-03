let dataStore = null;

// Load JSON data
async function loadData() {
  try {
    const res = await fetch('data/core-data.json');
    dataStore = await res.json();
    renderConcepts();
    renderTheories();
    renderPowers();
    renderConflicts();
    renderQuiz();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Page navigation
function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Render functions
function renderConcepts() {
  const ul = document.getElementById('concept-list');
  ul.innerHTML = '';
  dataStore.concepts.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.term}:</strong> ${c.definition}`;
    ul.appendChild(li);
  });
}

function renderTheories() {
  const container = document.getElementById('theory-cards');
  container.innerHTML = '';
  dataStore.theories.forEach(t => {
    const div = document.createElement('div');
    div.className = 'theory-card';
    div.innerHTML = `<h3>${t.name}</h3><p>${t.summary}</p>`;
    container.appendChild(div);
  });
}

function renderPowers() {
  const tbody = document.querySelector('#powers-table tbody');
  tbody.innerHTML = '';
  dataStore.powers.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.actor}</strong></td>
      <td>${p.gdpRank}</td>
      <td>${p.militarySpending}</td>
      <td>${p.note}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderConflicts() {
  const ul = document.getElementById('conflict-list');
  ul.innerHTML = '';
  dataStore.conflicts.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.name}</strong> – <em>${c.type}</em><br>${c.note}`;
    ul.appendChild(li);
  });
}

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  dataStore.quiz.forEach((q, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${idx + 1}. ${q.question}</p>
      ${q.options.map(opt => `
        <label>
          <input type="radio" name="q${idx}" value="${opt}">
          ${opt}
        </label>
      `).join('')}
    `;
    container.appendChild(div);
  });
}

function checkQuiz() {
  let correct = 0;
  dataStore.quiz.forEach((q, idx) => {
    const chosen = document.querySelector(`input[name="q${idx}"]:checked`);
    if (chosen && chosen.value === q.answer) correct++;
  });
  const result = document.getElementById('quiz-result');
  const percentage = Math.round((correct / dataStore.quiz.length) * 100);
  
  let message = '';
  if (percentage === 100) {
    message = `🎉 Perfect! ${correct}/${dataStore.quiz.length} correct!`;
  } else if (percentage >= 80) {
    message = `✅ Great job! ${correct}/${dataStore.quiz.length} correct (${percentage}%)`;
  } else if (percentage >= 60) {
    message = `📖 Good effort! ${correct}/${dataStore.quiz.length} correct (${percentage}%). Review the concepts.`;
  } else {
    message = `📚 Keep studying! ${correct}/${dataStore.quiz.length} correct (${percentage}%). Review all sections.`;
  }
  
  result.textContent = message;
  result.classList.add('show');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Navigation buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.section));
  });
  
  // Quiz check button
  document.getElementById('check-answers').addEventListener('click', checkQuiz);
  
  // Load data
  loadData();
});