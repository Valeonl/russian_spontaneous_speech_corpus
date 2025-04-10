// Импорт внешних библиотек
document.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>');
document.write('<script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>');
document.write('<script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>');
document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"></script>');

// Инициализация интерактивного фона
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
                value: 0.5,
                random: false,
                animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
            lineLinked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                outMode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detectOn: 'canvas',
            events: {
                onHover: { enable: true, mode: 'grab' },
                onClick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, lineLinked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
});

// Глобальная переменная для хранения текущего аудио
let currentAudio = null;

// Функция воспроизведения аудио
function playAudio(src, button) {
    const icon = button.querySelector('i');
    
    // Если есть текущее аудио и это другой файл
    if (currentAudio && currentAudio.src !== src) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const prevButton = document.querySelector('.fa-pause').parentElement;
        prevButton.querySelector('i').classList.remove('fa-pause');
        prevButton.querySelector('i').classList.add('fa-play');
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

// Инициализация DataTables
$(document).ready(function() {
    const table = $('#datasetTable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/ru.json'
        },
        pageLength: 10,
        dom: 'rtip',
        order: [[0, 'asc']]
    });

    // Поиск по фразам
    $('#phraseSearch').on('keyup', function() {
        table.search(this.value).draw();
    });

    // Фильтрация по роли
    $('#roleFilter').on('change', function() {
        table.column(2).search(this.value).draw();
    });

    // Фильтрация по диалогу
    $('#dialogFilter').on('change', function() {
        table.column(1).search(this.value).draw();
    });
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