jQuery(document).ready(function($) {
    console.log('Atchaya Jyothi Panchang JS Loaded');

    // Placeholder for dynamic updates via AJAX
    // This will handle date changes and location searches in the futur    $(\\.atchaya-panchang\\').on(\'change\', \'.date-picker\', function() {
        var newDate = $(this).val();
        var currentPlace = $(\"#current-place\").text();
        var selectedLang = $(\"#lang-selector\").val();
        updatePanchang(newDate, currentPlace, selectedLang);
    });

    $(\\.atchaya-panchang\\').on(\'change\', \'.lang-selector\', function() {
        var newLang = $(this).val();
        var currentDate = $(\"#date-picker\").val();
        var currentPlace = $(\"#current-place\").text();
        updatePanchang(currentDate, currentPlace, newLang);
    });
    function updatePanchang(date, place, lang) {
        $.ajax({
            url: atchayaAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'atchaya_get_panchang',
                date: date,
                place: place,
                lang: lang,
                nonce: atchayaAjax.nonce
            },
            success: function(response) {
                if(response.success) {
                    // Replace only the content within the main panchang div, excluding the search inpu                    $(\".atchaya-panchang-dynamic-content\").html($(response.data.html).find(\".atchaya-panchang-dynamic-content\").html());
                    $(\"#current-place\").text(place);
                }
            }
        });
    }
});

let timeout = null;

function searchCity() {
    const query = document.getElementById('cityInput').value;
    if (query.length < 3) {
        document.getElementById('results').style.display = 'none';
        return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'block';

        data.forEach(item => {
            const div = document.createElement('div');
            div.style.padding = '5px';
            div.style.cursor = 'pointer';
            div.innerText = item.display_name;
            div.onclick = () => {
                document.getElementById('cityInput').value = item.display_name;
                document.getElementById('latVal').innerText = item.lat;
                document.getElementById('lonVal').innerText = item.lon;
                resultsDiv.style.display = 'none';
                // இங்கே சூரிய உதயம்/அஸ்தமனம் கணக்கிடும் function-ஐ அழைக்கலாம                // For now, let\'s update the displayed place in the header
                $(\'#current-place\').text(item.display_name);
                updatePanchang($(\'#date-picker\').val(), item.display_name, $(\'#lang-selector\').val());
            };
            resultsDiv.appendChild(div);
        });
    }, 500);
}
