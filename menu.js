// menu.js
(function () {
  const SITE_FOLDER = 'solaris'; // твоя "главная папка" сайта

  // ROOT будет:
  // - локально: /solaris
  // - GitHub project pages: /<repo-name>/solaris
  const ROOT = (() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const i = parts.indexOf(SITE_FOLDER);
    return i >= 0 ? '/' + parts.slice(0, i + 1).join('/') : '';
  })();

  // Путь внутри /solaris (нужен, чтобы понять "главная это или нет")
  const REL = (() => {
    if (!ROOT) return location.pathname;
    return location.pathname.startsWith(ROOT)
      ? (location.pathname.slice(ROOT.length) || '/')
      : location.pathname;
  })();

  const isIndex = (REL === '/' || REL === '/index.html' || REL.endsWith('/index.html'));

  const styles = `
  <style>
    #solar-menu-trigger {
      position: fixed;
      top: 25px;
      left: 30px;
      z-index: 10000;
      padding: 10px 25px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.6);
      border-radius: 50px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.4s ease;
      backdrop-filter: blur(5px);
      outline: none;
    }

    #solar-menu-trigger:hover {
      border-color: var(--color-blue, #00d2ff);
      color: var(--color-blue, #00d2ff);
      box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
      transform: scale(1.05);
    }

    #solar-menu-trigger.active {
      background: var(--color-sun, #ffd700);
      color: #000;
      border-color: var(--color-sun, #ffd700);
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
    }

    #solar-top-bar {
      position: fixed; top: 0; left: 0; width: 100%; height: 100px;
      background: rgba(5, 5, 8, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px); z-index: 9999;
      transform: translateY(-100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    #solar-top-bar.visible { transform: translateY(0); }

    .solar-nav-list {
      display: flex; gap: 40px; list-style: none; padding: 0; margin: 0; align-items: center;
    }

    .sim-btn {
      background: transparent; border: none;
      color: var(--color-sun, #ffd700);
      border: 1px solid rgba(255, 215, 0, 0.3);
      padding: 8px 20px; border-radius: 20px;
      font-family: 'Exo 2', sans-serif; font-size: 1rem;
      text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: 0.3s;
    }
    .sim-btn:hover {
      background: rgba(255, 215, 0, 0.1);
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
      color: #fff;
    }

    .dropdown-wrapper { position: relative; height: 100%; display: flex; align-items: center; }

    .nav-text-btn {
      background: transparent; border: none; color: #fff;
      font-family: 'Exo 2', sans-serif; font-size: 1rem;
      text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
      padding: 10px 0; position: relative; transition: 0.3s;
    }
    .nav-text-btn::after {
      content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
      background: var(--color-blue, #00d2ff); transition: width 0.3s;
    }
    .nav-text-btn:hover { color: var(--color-blue, #00d2ff); text-shadow: 0 0 10px rgba(0, 210, 255, 0.5); }
    .nav-text-btn:hover::after { width: 100%; }

    .dropdown-box {
      position: absolute; top: 60px; left: 50%; transform: translateX(-50%);
      width: 260px;
      background: rgba(10, 10, 15, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 2px solid var(--color-blue, #00d2ff);
      border-radius: 0 0 8px 8px;
      padding: 10px 0;
      opacity: 0; visibility: hidden; transition: 0.2s;
      box-shadow: 0 15px 30px rgba(0,0,0,0.8);
      display: flex; flex-direction: column;
    }
    .dropdown-wrapper:hover .dropdown-box { opacity: 1; visibility: visible; top: 50px; }

    .drop-item {
      background: none; border: none; text-align: left;
      padding: 12px 20px; color: #aaa;
      font-family: 'Exo 2', sans-serif; font-size: 0.9rem;
      text-decoration: none; cursor: pointer; transition: 0.2s;
      border-left: 2px solid transparent;
      display: block;
      width: 100%;
    }
    .drop-item:hover {
      color: #fff; background: rgba(255, 255, 255, 0.05);
      border-left-color: var(--color-sun, #ffd700);
      padding-left: 25px;
    }

    .divider { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
  </style>
  `;

  const buildHtml = () => `
<button id="solar-menu-trigger" type="button">Меню системы</button>

<div id="solar-top-bar">
  <ul class="solar-nav-list">
    <li>
      <button class="sim-btn" type="button" id="btn-sim">3D Симуляция</button>
    </li>

    <li class="divider"></li>

    <!-- ГЛАВНАЯ -->
    <li class="dropdown-wrapper">
      <button class="nav-text-btn" type="button" id="btn-main">
        Главная ▼
      </button>
      <div class="dropdown-box">
        <button class="drop-item" type="button" data-root-section="0">Орбитальная карта</button>
        <button class="drop-item" type="button" data-root-section="1">Структура Вселенной</button>
        <button class="drop-item" type="button" data-root-section="2">Временная шкала</button>
        <button class="drop-item" type="button" data-root-section="3">Справочник (Блок)</button>
      </div>
    </li>

    <li class="divider"></li>

    <!-- СПРАВОЧНИК -->
    <li class="dropdown-wrapper">
      <button class="nav-text-btn" type="button" id="btn-atlas">
        Справочник ▼
      </button>
      <div class="dropdown-box">
        <a href="${ROOT}/planets/" class="drop-item">Планеты</a>
        <a href="${ROOT}/stars/" class="drop-item">Звезды</a>
        <a href="${ROOT}/blackholes/" class="drop-item">Черные дыры</a>
        <a href="${ROOT}/tech/" class="drop-item">Космическая техника</a>
        <a href="${ROOT}/small-bodies/" class="drop-item">Малые тела</a>
        <a href="${ROOT}/night-sky/" class="drop-item">Ночное небо</a>
      </div>
    </li>
  </ul>
</div>
`;

  document.addEventListener('DOMContentLoaded', () => {
    // Вставляем стили и HTML
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('afterbegin', buildHtml());

    const bar = document.getElementById('solar-top-bar');
    const btn = document.getElementById('solar-menu-trigger');

    const setButtonState = (open) => {
      if (open) {
        btn.classList.add('active');
        btn.textContent = 'ЗАКРЫТЬ';
      } else {
        btn.classList.remove('active');
        btn.textContent = 'МЕНЮ СИСТЕМЫ';
      }
    };

    const setMenuOpen = (open) => {
      if (open) bar.classList.add('visible');
      else bar.classList.remove('visible');
      setButtonState(open);
    };

    // По умолчанию: на страницах справочника меню открыто
    if (!isIndex) setMenuOpen(true);
    else setMenuOpen(false);

    // Глобальная функция (если где-то ещё зовёшь)
    window.toggleSolarMenu = () => setMenuOpen(!bar.classList.contains('visible'));

    // Кнопка меню
    btn.addEventListener('click', () => window.toggleSolarMenu());

    // 3D симуляция
    document.getElementById('btn-sim').addEventListener('click', () => {
      // закрыть меню (по желанию)
      setMenuOpen(false);

      // На главной можешь запускать локальную функцию
      if (isIndex && typeof window.startJourney === 'function') {
        window.startJourney();
      } else {
        window.location.href = `${ROOT}/?start=true`;
      }
    });

    // "Главная ▼" кликом: на главную /solaris/
    document.getElementById('btn-main').addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isIndex) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = `${ROOT}/`;
      }
    });

    // "Справочник ▼" кликом: на главной скролл к 4-му блоку, иначе на /planets/
    document.getElementById('btn-atlas').addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isIndex) {
        const sections = document.querySelectorAll('.section-block');
        const target = sections[3];
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.location.href = `${ROOT}/planets/`;
      }
    });

    // Клик по пунктам "Главной" (Орбитальная карта / ...)
    document.querySelectorAll('[data-root-section]').forEach((el) => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-root-section'), 10);
        if (Number.isNaN(index)) return;

        if (isIndex) {
          const sections = document.querySelectorAll('.section-block');
          const target = sections[index];
          if (target) {
            const y = target.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else {
          // переходим на главную и говорим, к какой секции скроллить
          window.location.href = `${ROOT}/?section=${index}`;
        }
      });
    });

    // Автоскролл на главной по параметру ?section=
    if (isIndex) {
      const params = new URLSearchParams(window.location.search);
      const idx = params.get('section');
      if (idx !== null) {
        const i = parseInt(idx, 10);
        const sections = document.querySelectorAll('.section-block');
        const target = sections[i];
        if (!Number.isNaN(i) && target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 120;
          // небольшой таймаут, если блоки ещё дорисовываются
          setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 50);
        }
      }
    }
  });
})();
