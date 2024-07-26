const { transliterate } = require('transliteration');

function formatName(arr) {
    return arr.map(part => transliterate(part.trim())).filter(part => part).join(' ');
}

module.exports = function (data, mode) {
    function currentIndex(index) {
        return index + data.custom.length + 1
    }

    // Форматування імені контакту для TYT MD9600 або Retevis RT90
    function getNameMD9600RT90(item) {    
        return formatName([ item.callsign, getK2CS(item.id), item.fname, item.city ]) // формуємо назву контакту зараз це: оф. позивний + |К2 позивний| + ім'я + місто
    }
    
    // Форматування імені контакту для ANYTONE
    function getNameANYTONE(item) {
        return formatName([ getK2CS(item.id), item.fname, item.surname ]) // формуємо назву контакту зараз це: |К2 позивний| + ім'я + фамілія
    }
    
    function getK2CS(dmrID) {
        const callsign = data.k2[dmrID]

        const format = [
            '[', callsign, ']' // тут можно оформити як буде виділятися позивний К2 зараз це квадратні скобки [...]
        ]
    
        return callsign ? format.join('') : '';
    }

    switch (mode) {
        // Тут формування данних, якщо колонок більше ніж у заголовків (custom_contacts.scv) вони не будуть враховані!
        // доступні поля в item: id (дмр ід), callsign (оф. позивний), city (місто), country (країна), fname (ім'я), surname (фамілія), remarks (хз), state (хз)
        // отримати позивний к2 для цього item можна так: getK2CS(item.id)
        // отримати порядковий номер можна так: currentIndex(index)

        case "ANYTONE":
            return [
                // формуємо хедерси (рядок із назвами колонок)
                ['No.', 'TG/DMR ID', 'Call Alert', 'Name', 'City', 'Call Type', 'Callsign', 'State/Prov', 'Country', 'Remarks'],
        
                ...data.custom.map(
                    // підтягуємо кастомні данні із ANYTONE.csv
                    item => Object.keys(item).map(key => item[key]) 
                ),
        
                ...data.api.map((item, index) =>
                //  No.,                    TG/DMR ID,      Call Alert,   Name,                     City,         Call Type,    Callsign,         State/Prov,     Country,        Remarks
                //  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    [ currentIndex(index),  item.id,        'None',       getNameANYTONE(item),     item.city,    '',           item.callsign,    item.state,     item.country,   item.remarks ]
                )
        
            ]

        case "MD9600-RT90":
            return [
                // формуємо хедерси (рядок із назвами колонок)
                ['Contact Name', 'Call Type', 'Call ID', 'Call Receive Tone'],
        
                ...data.custom.map(
                    // підтягуємо кастомні данні із MD9600-RT90.csv
                    item => Object.keys(item).map(key => item[key])
                ),
        
                ...data.api.map(item =>
                //  Contact Name,               Call Type,  Call ID,            Call Receive Tone
                //  -------------------------------------------------------------------------
                   [ getNameMD9600RT90(item),   '2',        String(item.id),    '0' ]
                )
        
            ]
    }
}
