document.addEventListener('DOMContentLoaded', () => {
  const boutons = document.querySelectorAll('.filtre-btn');
  const projets = document.querySelectorAll('.projet-item');
  const aucunResultat = document.getElementById('aucun-resultat');

  boutons.forEach(btn => {
    btn.addEventListener('click', () => {
      boutons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const langue = btn.dataset.lang;
      let visibles = 0;

      projets.forEach(projet => {
        const correspond = langue === 'tous' || projet.dataset.lang === langue;
        projet.style.display = correspond ? 'flex' : 'none';
        if (correspond) visibles++;
      });

      if (aucunResultat) {
        aucunResultat.style.display = visibles === 0 ? 'block' : 'none';
      }
    });
  });
});