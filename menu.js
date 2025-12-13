(function() {
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
        }
        .drop-item:hover {
            color: #fff; background: rgba(255, 255, 255, 0.05);
            border-left-color: var(--color-sun, #ffd700);
            padding-left: 25px;
        }

        .divider { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
    </style>
    `;

const html = `
<button id="solar-menu-trigger" onclick="toggleSolarMenu()">Меню системы</button>

<div id="solar-top-bar">
    <ul class="solar-nav-list">
        <li>
            <button class="sim-btn" onclick="navToSim()">3D Симуляция</button>
        </li>

        <li class="divider"></li>

        <!-- ГЛАВНАЯ -->
        <li class="dropdown-wrapper">
            <button class="nav-text-btn" onclick="navMainClick(event)">
                Главная ▼
            </button>
            <div class="dropdown-box">
                <button class="drop-item" onclick="navToRootSection(0)">Орбитальная карта</button>
                <button class="drop-item" onclick="navToRootSection(1)">Структура Вселенной</button>
                <button class="drop-item" onclick="navToRootSection(2)">Временная шкала</button>
                <button class="drop-item" onclick="navToRootSection(3)">Справочник (Блок)</button>
            </div>
        </li>

        <li class="divider"></li>

        <!-- СПРАВОЧНИК -->
        <li class="dropdown-wrapper">
            <button class="nav-text-btn" onclick="navAtlasClick(event)">
                Справочник ▼
            </button>
            <div class="dropdown-box">
                <a href="/planets/" class="drop-item">Планеты</a>
                <a href="/stars/" class="drop-item">Звезды</a>
                <a href="/blackholes/" class="drop-item">Черные дыры</a>
                <a href="/tech/" class="drop-item">Космическая техника</a>
                <a href="/small-bodies/" class="drop-item">Малые тела</a>
                <a href="/night-sky/" class="drop-item">Ночное небо</a>
            </div>
        </li>
    </ul>
</div>
`;


    document.addEventListener('DOMContentLoaded', () => {
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('afterbegin', html);

        const bar = document.getElementById('solar-top-bar');
        const btn = document.getElementById('solar-menu-trigger');

        // Всегда открываем меню по умолчанию на страницах справочника
        const isIndex =
          window.location.pathname === '/' ||
          window.location.pathname.endsWith('/index.html') && window.location.pathname.split('/').length <= 2;

        if (!isIndex) {
          bar.classList.add('visible');
          btn.classList.add('active');
          btn.innerText = "ЗАКРЫТЬ";
        }

        window.toggleSolarMenu = () => {
            const isOpen = bar.classList.contains('visible');
            if (isOpen) {
                bar.classList.remove('visible');
                btn.classList.remove('active');
                btn.innerText = "МЕНЮ СИСТЕМЫ";
            } else {
                bar.classList.add('visible');
                btn.classList.add('active');
                btn.innerText = "ЗАКРЫТЬ";
            }
        };

        window.navToSim = () => {
          toggleSolarMenu && toggleSolarMenu();

          if (isIndex) {
            if (typeof window.startJourney === 'function') {
              window.startJourney();
            } else {
              window.location.href = '/?start=true';
            }
          } else {
            window.location.href = '/?start=true';
          }
        };

        window.navToRootSection = (index) => {
            if (isIndex) {
                const sections = document.querySelectorAll('.section-block');
                if (sections.length > 0 && sections[index]) {
                    const rect = sections[index].getBoundingClientRect();
                    const offset = -120;
                    const targetY = window.pageYOffset + rect.top + offset;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            } else {
                window.location.href = '/';
            }
        };

window.navMainClick = (event) => {
  // не ломаем hover-дропдаун
  event.stopPropagation();
  event.preventDefault();

  const isIndex =
    window.location.pathname === '/' ||
    (window.location.pathname.endsWith('/index.html') &&
     window.location.pathname.split('/').length <= 2);

  if (isIndex) {
    // уже на главной — скроллим к самому верху
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // с любой страницы справочника ведем на главную
    window.location.href = '/';
  }
};

window.navAtlasClick = (event) => {
  event.stopPropagation();
  event.preventDefault();

  const isIndex =
    window.location.pathname === '/' ||
    (window.location.pathname.endsWith('/index.html') &&
     window.location.pathname.split('/').length <= 2);

  if (isIndex) {
    // на главной — скролл до блока "Справочник объектов" (четвёртый section-block)
    const sections = document.querySelectorAll('.section-block');
    if (sections.length > 3) {
      const rect = sections[3].getBoundingClientRect();
      const offset = -120;
      const targetY = window.pageYOffset + rect.top + offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    // на страницах справочника ведем сразу на Planets как первую запись
    window.location.href = '/planets/';
  }
};




        // ВАЖНО: убрали обработчик клика вне меню,
        // чтобы меню не закрывалось само от нажатий по странице.
    });
})();
