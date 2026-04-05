jQuery(document).ready(function($) {
    // Handle form submission
    $("#pancha-pakshi-form").submit(function(event) {
        event.preventDefault();

        var personName = $("#person_name").val();
        var birthDate = $("#birth_date").val();
        var birthTime = $("#birth_time").val();
        var birthPlace = $("#birth_place").val();
        // var autoLocation = $("#auto_location").is(":checked"); // Removed auto_location checkbox

        // Show loading spinner
        $("#loading-spinner").show();
        $("#pancha-pakshi-results").hide();
        $("#daily-pancha-pakshi-table").hide();
        $("#pancha-pakshi-debug").empty().hide(); // Clear and hide debug messages

        // Send AJAX request
        $.ajax({
            type: "POST",
            url: panchaPakshiAjax.ajaxurl,
            data: {
                action: "pancha_pakshi_calculate",
                nonce: panchaPakshiAjax.nonce,
                person_name: personName,
                birth_date: birthDate,
                birth_time: birthTime,
                birth_place: birthPlace,
                // auto_location: autoLocation ? 1 : 0 // Removed auto_location from data
            },
            success: function(response) {
                $("#loading-spinner").hide();
                
                if (response.success) {
                    var data = response.data;
                    displayResults(data);
                    displayDailyTable(data);
                } else {
                    // Display specific error message from PHP
                    $("#pancha-pakshi-debug").html("Error: " + response.data.message).show();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $("#loading-spinner").hide();
                $("#pancha-pakshi-debug").html("AJAX Error: " + textStatus + " - " + errorThrown + ". Check browser console for more details.").show();
                console.error("AJAX Error details:", jqXHR.responseText);
            }
        });
    });

    // Function to display Pancha Pakshi results
    function displayResults(data) {
        var html = `
            <div class="result-card">
                <h3>பஞ்ச பட்சி பலன் / Pancha Pakshi Results</h3>
                <table class="result-table">
                    <tr>
                        <td class="label">பெயர் / Name:</td>
                        <td class="value">${data.person_name}</td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த தேதி / Birth Date:</td>
                        <td class="value">${data.birth_date}</td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த நேரம் / Birth Time:</td>
                        <td class="value">${data.birth_time}</td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த ஊர் / Birth Place:</td>
                        <td class="value">${data.birth_place}</td>
                    </tr>
                    <tr>
                        <td class="label">நட்சத்திரம் / Nakshatra:</td>
                        <td class="value highlight">${data.nakshatra}</td>
                    </tr>
                    <tr>
                        <td class="label">பக்ஷம் / Paksha:</td>
                        <td class="value">${data.paksha === 'shukla' ? 'வளர்பிறை / Waxing' : 'தேய்பிறை / Waning'}</td>
                    </tr>
                    <tr>
                        <td class="label">ஜென்ம பட்சி / Janma Pakshi:</td>
                        <td class="value highlight pakshi-${data.janma_pakshi.toLowerCase()}">${data.janma_pakshi}</td>
                    </tr>
                </table>
            </div>
        `;
        
        $("#pancha-pakshi-results").html(html).show();
    }

    // Function to display daily Pancha Pakshi table
    function displayDailyTable(data) {
        var html = `
            <div class="daily-table-card">
                <h3>அன்றைய நாளின் பஞ்ச பட்சி / Today's Pancha Pakshi</h3>
                <p class="info-text">பகல் நேரம் (Daytime) - சூரிய உதயம் முதல் சூரிய அஸ்தமனம் வரை</p>
                <table class="daily-table">
                    <thead>
                        <tr>
                            <th>பட்சி / Pakshi</th>
                            <th>ஊண் / Eating</th>
                            <th>நடை / Walking</th>
                            <th>அரசு / Ruling</th>
                            <th>துயில் / Sleeping</th>
                            <th>சாவு / Death</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>வல்லூறு / Vulture</td>
                            <td>06:51-07:27</td>
                            <td>07:27-08:15</td>
                            <td>08:15-08:33</td>
                            <td>08:33-08:45</td>
                            <td>08:45-11:09</td>
                        </tr>
                        <tr>
                            <td>ஆந்தை / Owl</td>
                            <td>06:57-07:45</td>
                            <td>07:45-08:03</td>
                            <td>08:03-08:15</td>
                            <td>08:15-08:45</td>
                            <td>08:45-11:09</td>
                        </tr>
                        <tr>
                            <td>காகம் / Crow</td>
                            <td>07:09-07:27</td>
                            <td>07:27-07:39</td>
                            <td>07:39-08:09</td>
                            <td>08:09-08:45</td>
                            <td>08:45-11:09</td>
                        </tr>
                        <tr>
                            <td>கோழி / Cock</td>
                            <td>06:39-06:51</td>
                            <td>06:51-07:21</td>
                            <td>07:21-07:57</td>
                            <td>07:57-08:45</td>
                            <td>08:45-11:09</td>
                        </tr>
                        <tr>
                            <td>மயில் / Peacock</td>
                            <td>06:33-07:03</td>
                            <td>07:03-07:39</td>
                            <td>07:39-08:27</td>
                            <td>08:27-08:45</td>
                            <td>08:45-11:09</td>
                        </tr>
                    </tbody>
                </table>
                
                <p class="info-text" style="margin-top: 20px;">இரவு நேரம் (Nighttime) - சூரிய அஸ்தமனம் முதல் சூரிய உதயம் வரை</p>
                <table class="daily-table">
                    <thead>
                        <tr>
                            <th>பட்சி / Pakshi</th>
                            <th>ஊண் / Eating</th>
                            <th>நடை / Walking</th>
                            <th>அரசு / Ruling</th>
                            <th>துயில் / Sleeping</th>
                            <th>சாவு / Death</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>வல்லூறு / Vulture</td>
                            <td>18:57-19:27</td>
                            <td>19:27-20:15</td>
                            <td>20:15-20:21</td>
                            <td>20:21-20:45</td>
                            <td>20:45-23:09</td>
                        </tr>
                        <tr>
                            <td>ஆந்தை / Owl</td>
                            <td>18:45-19:21</td>
                            <td>19:21-20:15</td>
                            <td>20:15-20:45</td>
                            <td>20:45-21:09</td>
                            <td>21:09-23:09</td>
                        </tr>
                        <tr>
                            <td>காகம் / Crow</td>
                            <td>18:51-19:15</td>
                            <td>19:15-20:15</td>
                            <td>20:15-20:45</td>
                            <td>20:45-21:09</td>
                            <td>21:09-23:09</td>
                        </tr>
                        <tr>
                            <td>கோழி / Cock</td>
                            <td>18:45-19:15</td>
                            <td>19:15-19:39</td>
                            <td>19:39-20:45</td>
                            <td>20:45-21:09</td>
                            <td>21:09-23:09</td>
                        </tr>
                        <tr>
                            <td>மயில் / Peacock</td>
                            <td>18:51-19:15</td>
                            <td>19:15-19:45</td>
                            <td>19:45-20:09</td>
                            <td>20:09-20:45</td>
                            <td>20:45-23:09</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        $("#daily-pancha-pakshi-table").html(html).show();
    }

    // Removed auto location and autocomplete for birth place
    // $("#auto_location").change(function() { ... });
    // $("#birth_place").on("input", function() { ... });
    // $(document).on("click", ".suggestion-item", function() { ... });
    // $(document).on("click", function(e) { ... });
});
