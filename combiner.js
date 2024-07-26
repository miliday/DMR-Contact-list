const { transliterate } = require('transliteration');

function formatName(arr) {
    return arr.map(part => part.trim()).filter(part => part).join(' ');
}

module.exports = function (data, mode) {
    let result = []

    function currentIndex(index) {
        return index + result.length
    }

    if (mode === "ANYTONE") {
        data.api.sort(
            item => data.k2[item.id] ? 1 : -1
        )
    }

    if (mode === "MD9600-RT90") {
        data.api.sort(
            item => data.k2[item.id] ? 1 : -1
        )
    }

    // Форматування імені контакту для TYT MD9600 або Retevis RT90
    function getNameMD9600RT90(item) {    
        return formatName([ item.callsign, getK2CS(item.id) || item.fname ]) // формуємо назву контакту зараз це: оф. позивний + |К2 позивний| + ім'я + місто
    }
    
    // Форматування імені контакту для ANYTONE
    function getNameANYTONE(item) {
        return formatName([ getK2CS(item.id) || item.fname ]) // формуємо назву контакту зараз це: |К2 позивний| + ім'я + фамілія
    }
    
    function getK2CS(dmrID) {
        const callsign = data.k2[dmrID]

        const format = [
            '[', callsign, ']' // тут можно оформити як буде виділятися позивний К2 зараз це:  [...]
        ]
    
        return callsign ? format.join('') : '';
    }

    switch (mode) {
        // Тут формування данних, якщо колонок більше ніж у хедерсах вони не будуть враховані!
        // доступні поля в item: id (дмр ід), callsign (оф. позивний), city (місто), country (країна), fname (ім'я), surname (фамілія), remarks (хз), state (хз)
        // отримати порядковий номер можна так: index + 1 або currentIndex(index) - ця функція повертає індекс з урахуванням кастомних контактів із конфігів
        // отримати позивний к2 для цього item можна так: getK2CS(item.id)

        case "ANYTONE":
            result = [
                // формуємо хедерси (рядок із назвами колонок)
                ['No.', 'TG/DMR ID', 'Call Alert', 'Name', 'City', 'Call Type', 'Callsign', 'State/Prov', 'Country', 'Remarks'],
            ];
        
            result = [
                ...result,
                ...data.custom.map(
                    // підтягуємо додаткові кастомні контакти із ANYTONE.csv
                    item => Object.keys(item).map(key => item[key]) ,
                ),
            ];
            
            result = [
                ...result,
                ...data.api.map((item, index) =>
                //  No.,                    TG/DMR ID,      Call Alert,   Name,                     City,         Call Type,    Callsign,         State/Prov,     Country,        Remarks
                //  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    [ currentIndex(index),  item.id,        'None',       getNameANYTONE(item),     item.city,    '',           item.callsign,    item.state,     item.country,   item.remarks ].map(
                        item => transliterate(item)
                    ),
                ),
            ];

            break;

        case "MD9600-RT90":
            result = [
                // формуємо хедерси (рядок із назвами колонок)
                ['Contact Name', 'Call Type', 'Call ID', 'Call Receive Tone'],
            ];
            
            result = [
                ...result,
                ...data.custom.map(
                    // підтягуємо додаткові кастомні контакти із MD9600-RT90.csv
                    item => Object.keys(item).map(key => item[key]),
                ),
            ];

            result = [
                ...result,
                ...data.api.map(item =>
                //  Contact Name,                Call Type,  Call ID,            Call Receive Tone
                //  -------------------------------------------------------------------------
                    [ getNameMD9600RT90(item),   '2',        String(item.id),    '0' ].map(
                        item => transliterate(item)
                    ),
                ),
            ];

            break;
        };

    return result;
}
