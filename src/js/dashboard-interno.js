document.addEventListener('DOMContentLoaded', () => {

  function hideAllScreens() {
    document.querySelectorAll('[id$="-screen"]').forEach(screen => {
      screen.style.display = "none";
    });
  }

  function showScreenByButtonId(btnId) {
    const base = btnId.replace("-btn", "");
    const screenId = `${base}-screen`;

    hideAllScreens();

    const screen = document.getElementById(screenId);
    if (screen) {
      screen.style.display = "block";
    } else {
      console.warn("Tela não encontrada:", screenId);
    }
  }

  // Tela inicial: Dashboard
  hideAllScreens();
  if (document.getElementById("dashboard-screen")) {
    document.getElementById("dashboard-screen").style.display = "block";
  }


  const observer = new MutationObserver(() => {
    const navLinks = document.querySelectorAll("#header-dash-intcolab .navitem, #header-dash-intcolab .active");

    if (!navLinks.length) return;

    const dashboardBtns = document.querySelectorAll('button[id$="-btn"]');

    // trocar active
    function setActive(id) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (!link.classList.contains("navitem")) link.classList.add("navitem");
      });

      const selected = document.getElementById(id);
      if (selected) {
        selected.classList.add("active");
        selected.classList.remove("navitem");
      }
    }

    // trocar tela
    function openScreen(id) {
      if (id === "dashboard-btn") {
        hideAllScreens();
        document.getElementById("dashboard-screen").style.display = "block";
        return;
      }
      showScreenByButtonId(id);
    }

    // clique navbar
    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const id = link.id;
        if (!id) return;
        setActive(id);
        openScreen(id);
      });
    });

    // clique nos cards da dashboard
    dashboardBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.id;
        setActive(id);
        openScreen(id);
      });
    });

    observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });

});
