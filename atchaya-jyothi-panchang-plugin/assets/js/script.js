jQuery(document).ready(function($) {
    console.log('Atchaya Jyothi Panchang JS Loaded');

    // Handle date change
    $('.atchaya-panchang').on('change', '.date-picker', function() {
        triggerUpdate();
    });

    // Handle language change
    $('.atchaya-panchang').on('change', '.lang-selector', function() {
        triggerUpdate();
    });

    function triggerUpdate() {
        var date = $('#date-picker').val();
        var place = $('#current-place').text();
        var lang = $('#lang-selector').val();
        updatePanchang(date, place, lang);
    }

    function updatePanchang(date, place, lang) {
        $('.atchaya-panchang-dynamic-content').css('opacity', '0.5');
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
                    $('.atchaya-panchang-dynamic-content').html($(response.data.html).find('.atchaya-panchang-dynamic-content').html());
                }
                $('.atchaya-panchang-dynamic-content').css('opacity', '1');
            }
        });
    }

    // City Search Logic
    let timeout = null;
    $('#cityInput').on('input', function() {
        const query = $(this).val();
        if (query.length < 3) {
            $('#results').hide();
            return;
        }

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                const data = await response.json();
                const resultsDiv = $('#results');
                resultsDiv.empty().show();

                data.forEach(item => {
                    const div = $('<div class="search-item"></div>')
                        .css({ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' })
                        .text(item.display_name)
                        .on('click', function() {
                            $('#cityInput').val(item.display_name);
                            $('#current-place').text(item.display_name);
                            $('#latVal').text(parseFloat(item.lat).toFixed(4));
                            $('#lonVal').text(parseFloat(item.lon).toFixed(4));
                            resultsDiv.hide();
                            triggerUpdate();
                        });
                    resultsDiv.append(div);
                });
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 500);
    });

    // Close search results on click outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.panchangam-container').length) {
            $('#results').hide();
        }
    });
});
