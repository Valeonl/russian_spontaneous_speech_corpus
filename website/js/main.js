// Импорт внешних библиотек
document.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>');
document.write('<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>');
document.write('<script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>');
document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"></script>');

// Глобальная переменная для хранения текущего аудио
let currentAudio = null;

// Функция для проверки загрузки particles.js
function waitForParticles(callback) {
    if (window.particlesJS) {
        callback();
    } else {
        setTimeout(() => waitForParticles(callback), 50);
    }
}

// Функция инициализации particles.js
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#4a90e2' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#4a90e2', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Функция воспроизведения аудио
function playAudio(src, button) {
    const icon = button.querySelector('i');
    
    // Если есть текущее аудио и это другой файл
    if (currentAudio && currentAudio.src !== src) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const prevButton = document.querySelector('.fa-pause')?.parentElement;
        if (prevButton) {
            prevButton.querySelector('i').classList.remove('fa-pause');
            prevButton.querySelector('i').classList.add('fa-play');
        }
    }

    // Если это первое воспроизведение или новый файл
    if (!currentAudio || currentAudio.src !== src) {
        currentAudio = new Audio(src);
        currentAudio.addEventListener('ended', () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
    }

    // Воспроизведение/пауза
    if (currentAudio.paused) {
        currentAudio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        currentAudio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    waitForParticles(initParticles);
});

// Экспортируем функции
window.playAudio = playAudio;
window.playDemo = playDemo;

// Инициализация DataTables
$(document).ready(function() {
    // Инициализация таблицы
    window.dataTable = $('#datasetTable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/ru.json'
        },
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        responsive: true,
        dom: '<"top"lf>rt<"bottom"ip><"clear">',
        order: [[0, 'asc']],
        columns: [
            { title: "ID" },
            { title: "Диалог ID" },
            { title: "Роль" },
            { title: "Исходная фраза" },
            { title: "Интерпретация" },
            { 
                title: "Действия",
                orderable: false,
                searchable: false,
                width: "80px"
            }
        ]
    });

    // Поиск по фразам
    $('#phraseSearch').on('keyup', function() {
        window.dataTable.search(this.value).draw();
    });

    // Фильтрация по роли
    $('#roleFilter').on('change', function() {
        window.dataTable.column(2).search(this.value).draw();
    });

    // Фильтрация по диалогу
    $('#dialogFilter').on('change', function() {
        window.dataTable.column(1).search(this.value).draw();
    });

    // Обработчик клика на кнопку раскрытия
    $(document).on('click', '.expand-button', function(e) {
        e.preventDefault();
        const $button = $(this);
        const $cell = $button.closest('.text-cell');
        
        $cell.toggleClass('expanded');
        $button.toggleClass('expanded');
        
        // Перерисовываем таблицу для корректного отображения
        window.dataTable.draw(false);
    });

    // Загружаем данные
    initializeData();

    // Обновляем данные каждые 30 секунд
    setInterval(initializeData, 10000);
});

// Функция для демонстрационного плеера
function playDemo() {
    const container = document.querySelector('.dialog-container');
    const messages = [
        {
            type: 'interviewer',
            text: 'Что Вы первым делом зачикинили, когда попали в ИТМО?',
            audio: '/speech_examples/conversation_1_role_I_1.mp3'
        },
        {
            type: 'respondent',
            text: 'Поступление в ИТМО было для меня зашкваром',
            interpretation: 'Поступление было для меня крайне тяжёлым и непонятным процессом',
            audio: '/speech_examples/conversation_1_role_R_2.mp3'
        }
    ];

    // Очищаем контейнер
    container.innerHTML = '';
    
    // Останавливаем текущее аудио если есть
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Показываем сообщения с анимацией
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${msg.type}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = msg.type === 'interviewer' ? 'И' : 'Р';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = msg.text;
            
            if (msg.interpretation) {
                const interpretation = document.createElement('div');
                interpretation.className = 'message-interpretation';
                interpretation.textContent = msg.interpretation;
                content.appendChild(interpretation);
            }
            
            messageEl.appendChild(avatar);
            messageEl.appendChild(content);
            container.appendChild(messageEl);
            
            // Анимация появления
            setTimeout(() => messageEl.classList.add('show'), 100);
            
            // Воспроизведение аудио
            if (msg.audio) {
                const audio = new Audio(msg.audio);
                audio.play();
            }
        }, index * 2000); // Задержка между сообщениями
    });
} 