// Конфигурация для доступа к Google Sheets
const spreadsheetId = '1YTBwaZFoQ_w3uJ4Br-YjyraD-cZFXZ2NQhIJDZHKf3c';
const range = 'A1:Z1000';
const apiKey = 'AIzaSyB8eMVab-8cvE997P-gbWlArrWmw4QjtwE';

// Функция для создания кнопки воспроизведения
function createPlayButton(audioPath) {
    if (!audioPath || audioPath.trim() === '') {
        return `<button class="play-button disabled" disabled>
            <i class="fas fa-volume-mute"></i>
        </button>`;
    }
    return `<button class="play-button" onclick="playAudio('${audioPath}', this)">
        <i class="fas fa-play"></i>
    </button>`;
}

// Функция для создания ячейки с текстом и кнопкой раскрытия
function createTextCell(text) {
    const cellContent = `
        <div class="text-cell">
            ${text}
            <button class="expand-button" style="display: none;">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;
    return cellContent;
}

// Функция для загрузки данных из Google Sheets
async function fetchData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }
        const data = await response.json();
        if (!data.values || data.values.length === 0) {
            throw new Error('Данные отсутствуют');
        }
        return data.values;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return null;
    }
}

// Функция для обновления таблицы данными
function updateTable(data) {
    if (!data || data.length === 0) return;

    const table = window.dataTable;
    if (!table) return;

    try {
        table.clear();

        // Пропускаем заголовки и обрабатываем данные
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row && row.length >= 5) {
                table.row.add([
                    row[0] || '', // row_index
                    row[1] || '', // conversation_index
                    row[2] || '', // speaker_role
                    createTextCell(row[3] || ''), // spontaneous_speech_text
                    createTextCell(row[4] || ''), // speech_transcription
                    createPlayButton(row[5]) // Создаем кнопку в зависимости от наличия аудио
                ]);
            }
        }

        table.draw(false);

        // После отрисовки таблицы проверяем все ячейки на переполнение
        setTimeout(() => {
            $('.text-cell').each(function() {
                const $cell = $(this);
                const $button = $cell.find('.expand-button');
                
                // Проверяем, есть ли переполнение
                if (this.scrollHeight > this.clientHeight) {
                    $cell.addClass('has-more');
                    $button.show();
                }
            });
        }, 100);
    } catch (error) {
        console.error('Ошибка при обновлении таблицы:', error);
    }
}

// Функция для инициализации данных
async function initializeData() {
    const data = await fetchData();
    if (data) {
        updateTable(data);
    }
}

// Экспортируем функции для использования в других файлах
window.initializeData = initializeData;
window.createTextCell = createTextCell;
window.createPlayButton = createPlayButton; 