(function() {
    const styles = `
    <style>
        /* --- 1. КНОПКА МЕНЮ (Ваш дизайн, но слева и серая) --- */
        #solar-menu-trigger {
            position: fixed;
            top: 25px;
            left: 30px; /* ПЕРЕМЕСТИЛ НАЛЕВО */
            z-index: 10000;
            
            padding: 10px 25px;
            background: rgba(0, 0, 0, 0.4);
            
            /* ИЗНАЧАЛЬНО СЕРАЯ (как просили) */
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

        /* При наведении - ВОЗВРАЩАЕМ ГОЛУБОЙ НЕОН (Ваш любимый стиль) */
        #solar-menu-trigger:hover {
            border-color: var(--color-blue, #00d2ff);
            color: var(--color-blue, #00d2ff);
            box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
            transform: scale(1.05);
        }

        /* Активное состояние - Желтый */
        #solar-menu-trigger.active {
            background: var(--color-sun, #ffd700);
            color: #000;
            border-color: var(--color-sun, #ffd700);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }

        /* --- 2. ПАНЕЛЬ (Ваш дизайн) --- */
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

        /* КНОПКА 3D (Желтая, стиль "sim-highlight" из вашего кода) */
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

        /* --- ВЫПАДАЮЩИЕ СПИСКИ (DROPDOWNS) --- */
        .dropdown-wrapper { position: relative; height: 100%; display: flex; align-items: center; }

        /* Кнопки "Главная" и "Справочник" (Стиль кнопок из вашего кода) */
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

        /* Сам выпадающий блок (дизайн панели) */
        .dropdown-box {
            position: absolute; top: 60px; left: 50%; transform: translateX(-50%);
            width: 260px;
            background: rgba(10, 10, 15, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-top: 2px solid var(--color-blue, #00d2ff); /* Голубая полоска сверху */
            border-radius: 0 0 8px 8px;
            padding: 10px 0;
            opacity: 0; visibility: hidden; transition: 0.2s;
            box-shadow: 0 15px 30px rgba(0,0,0,0.8);
            display: flex; flex-direction: column;
        }
        
        .dropdown-wrapper:hover .dropdown-box { opacity: 1; visibility: visible; top: 50px; }

        /* Кнопки внутри выпадающего списка */
        .drop-item {
            background: none; border: none; text-align: left;
            padding: 12px 20px; color: #aaa;
            font-family: 'Exo 2', sans-serif; font-size: 0.9rem;
            text-decoration: none; cursor: pointer; transition: 0.2s;
            border-left: 2px solid transparent;
        }
        .drop-item:hover {
            color: #fff; background: rgba(255, 255, 255, 0.05);
            border-left-color: var(--color-sun, #ffd700); /* Желтый акцент при наведении */
            padding-left: 25px;
        }

        .divider { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
    </style>
    `;

    const html = `
    <!-- Кнопка вызова (Слева, Серая) -->
    <button id="solar-menu-trigger" onclick="toggleSolarMenu()">Меню системы</button>

    <div id="solar-top-bar">
        <ul class="solar-nav-list">
            
            <!-- 1. 3D СИМУЛЯЦИЯ (Первая, Желтая) -->
            <li>
                <button class="sim-btn" onclick="navToSim()">3D Симуляция</button>
            </li>

            <li class="divider"></li>

            <!-- 2. ГЛАВНАЯ (Выпадающий список) -->
            <li class="dropdown-wrapper">
                <button class="nav-text-btn">Главная ▼</button>
                <div class="dropdown-box">
                    <button class="drop-item" onclick="navToSection(0)">Орбитальная карта</button>
                    <button class="drop-item" onclick="navToSection(1)">Структура Вселенной</button>
                    <button class="drop-item" onclick="navToSection(2)">Временная шкала</button>
                    <button class="drop-item" onclick="navToSection(3)">Справочник (Блок)</button>
                </div>
            </li>

            <li class="divider"></li>

            <!-- 3. СПРАВОЧНИК (Выпадающий список) -->
            <li class="dropdown-wrapper">
                <button class="nav-text-btn">Справочник ▼</button>
                <div class="dropdown-box">
                    <a href="planets.html" class="drop-item">Планеты</a>
                    <a href="stars.html" class="drop-item">Звезды</a>
                    <a href="blackholes.html" class="drop-item">Черные дыры</a>
                    <a href="tech.html" class="drop-item">Космическая техника</a>
                    <a href="asteroids.html" class="drop-item">Малые тела</a>
                    <a href="sky.html" class="drop-item">Ночное небо</a>
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
  // Закрываем меню
  toggleSolarMenu && toggleSolarMenu();

  // Если глобальная функция есть — вызываем её
  if (typeof window.startJourney === 'function') {
    window.startJourney();
  } else {
    // На всякий случай, если мы НЕ на index.html или скрипт ещё не определен,
    // переходим на главную, где ты сам нажмёшь кнопку
    window.location.href = 'index.html';
  }
};


        window.navToSection = (index) => {
            // Не закрываем меню, как просили
            const sections = document.querySelectorAll('.section-block');
            if (sections.length > 0 && sections[index]) {
                const rect = sections[index].getBoundingClientRect();
                const offset = -120;
                const targetY = window.pageYOffset + rect.top + offset;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            } else {
                window.location.href = 'index.html';
            }
        };

        document.addEventListener('click', (e) => {
             if (!bar.contains(e.target) && !btn.contains(e.target) && bar.classList.contains('visible')) {
                 window.toggleSolarMenu();
             }
        });
    });
})();
