document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (selector, file) => {
    const target = document.querySelector(selector);
    if (!target) return;

    const type = target.id;

    fetch(file)
      .then(response => {
        if (!response.ok) throw new Error(`Erro ao carregar ${selector}`);
        return response.text();
      })
      .then(data => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data;

        const selected = tempDiv.querySelector(`#${type}`);
        if (selected) {
          target.innerHTML = selected.innerHTML;
          // Notifica que o componente foi inserido
          document.dispatchEvent(new CustomEvent('componentLoaded', { detail: { selector: selector, target } }));
        }
      })
      .catch(error => console.error(error));
  };


  loadComponent("header[id^='header-']", "/src/components/footer-header.html");
  loadComponent("footer[id^='footer-']", "/src/components/footer-header.html");

  // Carregar e aplicar máscaras globais (se ainda não carregado)
  if (!window._masksInjected) {
    const s = document.createElement('script');
    s.src = '/src/js/masks.js';
    s.defer = true;
    document.head.appendChild(s);
    window._masksInjected = true;
  }
});

document.addEventListener("click", (ev) => {
    const id = ev.target.id;

    // LANDING
    if (id === "menu-landing-btn") {
      const menuLanding = document.getElementById("menu-landing");
      const menuLandingExtra = document.getElementById("menu-landing-extra");
      menuLanding?.classList.toggle("show");
      menuLandingExtra?.classList.toggle("show");
      return;
    }

    // ENTRADA
    if (id === "menu-entrada-btn") {
      const menuEntrada = document.getElementById("menu-entrada");
      menuEntrada?.classList.toggle("show");
      return;
    }

    // DASHBOARD
    if (id === "menu-dash-btn") {
      const navDash = document.getElementById("nav-dash");
      navDash?.classList.toggle("show");
      return;
    }

    // Fechar dropdown de perfil ao clicar fora (se usar)
    const dropdown = document.getElementById("dropdown-menu");
    const profileBtn = document.getElementById("profile-btn");
    if (dropdown && !dropdown.contains(ev.target) && ev.target !== profileBtn) {
      dropdown.classList.remove("show");
    }
    if (ev.target === profileBtn) {
      dropdown?.classList.toggle("show");
    }
  });

