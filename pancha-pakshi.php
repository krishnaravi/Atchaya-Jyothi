<?php
/**
 * Plugin Name: Pancha Pakshi Calculator
 * Plugin URI: https://github.com/krishnaravi/Atchaya-Jyothi
 * Description: A self-contained Pancha Pakshi calculator for WordPress. All CSS and JS are inline to ensure compatibility with page builders like Divi and Elementor.
 * Version: 2.3
 * Author: Manus AI
 * Author URI: https://manus.im
 * License: GPL v2 or later
 * Text Domain: pancha-pakshi-calculator
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined("ABSPATH")) {
    exit;
}

// Define plugin constants
define("PANCHA_PAKSHI_PLUGIN_DIR", plugin_dir_path(__FILE__));

// Register the shortcode
add_shortcode("pancha_pakshi_calculator", "pancha_pakshi_calculator_shortcode_master");

// Force shortcode processing on content, especially for page builders
function pancha_pakshi_force_shortcode_on_content($content) {
    // Check if the content contains our shortcode
    if (strpos($content, '[pancha_pakshi_calculator]') !== false) {
        // Apply do_shortcode more aggressively
        $content = do_shortcode($content);
    }
    return $content;
}

// Apply filters with high priority to ensure they run after page builders
add_filter('the_content', 'pancha_pakshi_force_shortcode_on_content', 99999);
add_filter('widget_text', 'pancha_pakshi_force_shortcode_on_content', 99999);
add_filter('widget_text_content', 'pancha_pakshi_force_shortcode_on_content', 99999);
add_filter('et_builder_render_layout_content', 'pancha_pakshi_force_shortcode_on_content', 99999); // For Divi Builder
add_filter('elementor/widget/render_content', 'pancha_pakshi_force_shortcode_on_content', 99999); // For Elementor

// Main Shortcode Function
function pancha_pakshi_calculator_shortcode_master() {
    ob_start();
    ?>
    <style>
        /* Pancha Pakshi Plugin Styles */
        .pancha-pakshi-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 20px auto;
            padding: 30px;
            border: 2px solid #e8d4a8;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #fff9f0 0%, #fffbf5 100%);
        }

        .pancha-pakshi-container h2 {
            text-align: center;
            color: #8b4513;
            font-size: 28px;
            margin-bottom: 30px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Form Styling */
        #pancha-pakshi-form {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative; /* Added for autocomplete positioning */
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group input[type="time"] {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }

        .form-group input[type="text"]:focus,
        .form-group input[type="date"]:focus,
        .form-group input[type="time"]:focus {
            outline: none;
            border-color: #8b4513;
            box-shadow: 0 0 5px rgba(139, 69, 19, 0.2);
        }

        .form-group input[type="checkbox"] {
            margin-right: 8px;
            cursor: pointer;
        }

        .form-group label[for="auto_location"] {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            font-weight: 500;
            cursor: pointer;
        }

        /* Button Styling */
        .btn-calculate {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
        }

        .btn-calculate:hover {
            background: linear-gradient(135deg, #a0522d 0%, #8b4513 100%);
            box-shadow: 0 6px 12px rgba(139, 69, 19, 0.4);
            transform: translateY(-2px);
        }

        .btn-calculate:active {
            transform: translateY(0);
        }

        /* Loading Spinner */
        .spinner {
            text-align: center;
            padding: 20px;
        }

        .spinner::after {
            content: "";
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #8b4513;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Results Section */
        .results-section {
            margin-bottom: 30px;
        }

        .result-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-left: 5px solid #8b4513;
        }

        .result-card h3 {
            color: #8b4513;
            margin-bottom: 20px;
            font-size: 20px;
        }

        .result-table {
            width: 100%;
            border-collapse: collapse;
        }

        .result-table tr {
            border-bottom: 1px solid #eee;
        }

        .result-table tr:last-child {
            border-bottom: none;
        }

        .result-table td {
            padding: 12px 0;
        }

        .result-table .label {
            font-weight: 600;
            color: #555;
            width: 40%;
        }

        .result-table .value {
            color: #333;
        }

        .result-table .value.highlight {
            color: #8b4513;
            font-weight: 600;
            font-size: 16px;
        }

        .result-table .value.pakshi-vulture {
            background: linear-gradient(90deg, #fff0f5, #ffe4e1);
            padding: 8px 12px;
            border-radius: 4px;
        }

        .result-table .value.pakshi-owl {
            background: linear-gradient(90deg, #f0f8ff, #e6f2ff);
            padding: 8px 12px;
            border-radius: 4px;
        }

        .result-table .value.pakshi-crow {
            background: linear-gradient(90deg, #f5f5f5, #e8e8e8);
            padding: 8px 12px;
            border-radius: 4px;
        }

        .result-table .value.pakshi-cock {
            background: linear-gradient(90deg, #fff8dc, #ffe4b5);
            padding: 8px 12px;
            border-radius: 4px;
        }

        .result-table .value.pakshi-peacock {
            background: linear-gradient(90deg, #f0fff0, #e0ffe0);
            padding: 8px 12px;
            border-radius: 4px;
        }

        /* Daily Table Section */
        .table-section {
            margin-bottom: 30px;
        }

        .daily-table-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-left: 5px solid #d4a574;
        }

        .daily-table-card h3 {
            color: #8b4513;
            margin-bottom: 15px;
            font-size: 20px;
        }

        .info-text {
            color: #666;
            font-size: 13px;
            margin: 15px 0 10px 0;
            font-style: italic;
        }

        .daily-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            overflow-x: auto;
        }

        .daily-table thead {
            background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
            color: white;
            white-space: nowrap;
        }

        .daily-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }

        .daily-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
            white-space: nowrap;
        }

        .daily-table tbody tr:hover {
            background-color: #f9f9f9;
        }

        .daily-table tbody tr:nth-child(odd) {
            background-color: #fafafa;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .pancha-pakshi-container {
                padding: 20px;
                margin: 10px;
            }

            .pancha-pakshi-container h2 {
                font-size: 22px;
                margin-bottom: 20px;
            }

            #pancha-pakshi-form {
                padding: 15px;
            }

            .result-table .label {
                width: 50%;
            }

            .daily-table {
                font-size: 12px;
            }

            .daily-table th,
            .daily-table td {
                padding: 8px;
            }
        }

        @media (max-width: 480px) {
            .pancha-pakshi-container {
                padding: 15px;
                border-radius: 8px;
            }

            .pancha-pakshi-container h2 {
                font-size: 18px;
            }

            .result-table .label {
                display: block;
                width: 100%;
                margin-bottom: 5px;
            }

            .result-table .value {
                display: block;
                margin-bottom: 15px;
            }

            .daily-table {
                font-size: 11px;
            }

            .daily-table th,
            .daily-table td {
                padding: 6px;
            }
        }

        /* Error Message Styling */
        .pancha-pakshi-error {
            color: #D8000C;
            background-color: #FFBABA;
            border: 1px solid #D8000C;
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }

        .pancha-pakshi-success {
            color: #4F8A10;
            background-color: #DFF2BF;
            border: 1px solid #4F8A10;
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }

        .autocomplete-suggestions {
            border: 1px solid #ddd;
            max-height: 200px;
            overflow-y: auto;
            position: absolute;
            background-color: #fff;
            width: calc(100% - 2px); /* Adjust width to match input field */
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-radius: 4px;
            left: 0;
            right: 0;
            top: 100%; /* Position below the input */
        }

        .suggestion-item {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }

        .suggestion-item:last-child {
            border-bottom: none;
        }

        .suggestion-item:hover {
            background-color: #f0f0f0;
        }

    </style>
    <div class="pancha-pakshi-container">
        <h2>பஞ்ச பட்சி கால்குலேட்டர் / Pancha Pakshi Calculator</h2>
        <p>உங்கள் பிறந்த விவரங்களை உள்ளிட்டு பஞ்ச பட்சி மற்றும் அன்றைய தினத்திற்கான அட்டவணையைப் பெறவும்.</p>

        <form id="pancha-pakshi-form">
            <div class="form-group">
                <label for="person_name">பெயர் / Name:</label>
                <input type="text" id="person_name" name="person_name" placeholder="உதாரணம்: ரவி" required>
            </div>

            <div class="form-group">
                <label for="birth_date">பிறந்த தேதி / Birth Date:</label>
                <input type="date" id="birth_date" name="birth_date" placeholder="mm/dd/yyyy" required>
            </div>

            <div class="form-group">
                <label for="birth_time">பிறந்த நேரம் / Birth Time:</label>
                <input type="time" id="birth_time" name="birth_time" required>
            </div>

            <div class="form-group">
                <label for="birth_place">பிறந்த ஊர் / Birth Place:</label>
                <input type="text" id="birth_place" name="birth_place" placeholder="சென்னை, மதுரை, கோவை, திருச்சி" required>
                <div id="autocomplete-suggestions" class="autocomplete-suggestions"></div>
                <p class="info-text">ஆதரிக்கப்படும் முக்கிய நகரங்கள்: சென்னை, மதுரை, மும்பை, டெல்லி, கொல்கத்தா, பெங்களூரு, ஹைதராபாத். பிற நகரங்களுக்கு சென்னை கணக்கீடு பயன்படுத்தப்படும்.</p>
            </div>

            <button type="submit" class="btn-calculate">கணக்கிடு / Calculate</button>
        </form>

        <div id="pancha-pakshi-results" class="results-section" style="display: none;">
            <div class="result-card">
                <h3>பிறந்த பட்சி விவரங்கள் / Birth Pakshi Details</h3>
                <table class="result-table">
                    <tr>
                        <td class="label">பெயர்:</td>
                        <td class="value" id="display_name"></td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த தேதி:</td>
                        <td class="value" id="display_birth_date"></td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த நேரம்:</td>
                        <td class="value" id="display_birth_time"></td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த ஊர்:</td>
                        <td class="value" id="display_birth_place"></td>
                    </tr>
                    <tr>
                        <td class="label">நட்சத்திரம்:</td>
                        <td class="value" id="display_nakshatra"></td>
                    </tr>
                    <tr>
                        <td class="label">பக்ஷம்:</td>
                        <td class="value" id="display_paksha"></td>
                    </tr>
                    <tr>
                        <td class="label">பிறந்த பட்சி:</td>
                        <td class="value highlight" id="display_janma_pakshi"></td>
                    </tr>
                </table>
            </div>
        </div>

        <div id="pancha-pakshi-daily-table" class="table-section" style="display: none;">
            <div class="daily-table-card">
                <h3>அன்றைய தின பஞ்ச பட்சி அட்டவணை / Daily Pancha Pakshi Table</h3>
                <p class="info-text">சூரிய உதயம்: <span id="sunrise_time"></span>, சூரிய அஸ்தமனம்: <span id="sunset_time"></span></p>
                <div style="overflow-x:auto;">
                    <table class="daily-table">
                        <thead>
                            <tr>
                                <th>பட்சி</th>
                                <th>ஜாமம் 1</th>
                                <th>ஜாமம் 2</th>
                                <th>ஜாமம் 3</th>
                                <th>ஜாமம் 4</th>
                                <th>ஜாமம் 5</th>
                            </tr>
                        </thead>
                        <tbody id="daily_pakshi_table_body"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="pancha-pakshi-message" style="display: none;"></div>

    </div>

    <script>
        // Pancha Pakshi Plugin JavaScript
        jQuery(document).ready(function($) {
            const form = $("#pancha-pakshi-form");
            const resultsSection = $("#pancha-pakshi-results");
            const dailyTableSection = $("#pancha-pakshi-daily-table");
            const messageDiv = $("#pancha-pakshi-message");
            const birthPlaceInput = $("#birth_place");
            const autocompleteSuggestions = $("#autocomplete-suggestions");

            const supportedCities = [
                "Chennai",
                "Madurai",
                "Mumbai",
                "Delhi",
                "Kolkata",
                "Bangalore",
                "Hyderabad"
            ];

            // Autocomplete functionality
            birthPlaceInput.on("input", function() {
                const query = $(this).val().toLowerCase();
                autocompleteSuggestions.empty();

                if (query.length > 0) {
                    const filteredCities = supportedCities.filter(city => 
                        city.toLowerCase().includes(query)
                    );

                    if (filteredCities.length > 0) {
                        filteredCities.forEach(city => {
                            const suggestionItem = $("<div class=\"suggestion-item\"></div>").text(city);
                            suggestionItem.on("click", function() {
                                birthPlaceInput.val(city);
                                autocompleteSuggestions.empty();
                                autocompleteSuggestions.hide();
                            });
                            autocompleteSuggestions.append(suggestionItem);
                        });
                        autocompleteSuggestions.show();
                    } else {
                        autocompleteSuggestions.hide();
                    }
                } else {
                    autocompleteSuggestions.hide();
                }
            });

            // Hide suggestions when clicking outside
            $(document).on("click", function(e) {
                if (!$(e.target).closest(".form-group").length) {
                    autocompleteSuggestions.hide();
                }
            });

            form.on("submit", function(e) {
                e.preventDefault();
                messageDiv.hide().removeClass("pancha-pakshi-error pancha-pakshi-success").empty();
                resultsSection.hide();
                dailyTableSection.hide();

                const name = $("#person_name").val();
                const birth_date = $("#birth_date").val();
                const birth_time = $("#birth_time").val();
                const birth_place = $("#birth_place").val();

                if (!name || !birth_date || !birth_time || !birth_place) {
                    showMessage("Please fill in all required fields.", "error");
                    return;
                }

                // Show loading spinner
                form.find(".btn-calculate").html("<span class=\"spinner\"></span> Calculating...").prop("disabled", true);

                $.ajax({
                    url: "<?php echo admin_url("admin-ajax.php"); ?>",
                    type: "POST",
                    data: {
                        action: "pancha_pakshi_calculate",
                        name: name,
                        birth_date: birth_date,
                        birth_time: birth_time,
                        birth_place: birth_place,
                        security: "<?php echo wp_create_nonce("pancha_pakshi_nonce"); ?>"
                    },
                    success: function(response) {
                        form.find(".btn-calculate").html("கணக்கிடு / Calculate").prop("disabled", false);
                        if (response.success) {
                            const data = response.data;
                            
                            // Display Birth Pakshi Details
                            $("#display_name").text(data.name);
                            $("#display_birth_date").text(data.birth_date);
                            $("#display_birth_time").text(data.birth_time);
                            $("#display_birth_place").text(data.birth_place);
                            $("#display_nakshatra").text(data.nakshatra);
                            $("#display_paksha").text(data.paksha);
                            $("#display_janma_pakshi").text(data.janma_pakshi);
                            resultsSection.show();

                            // Display Daily Pancha Pakshi Table
                            $("#sunrise_time").text(data.sunrise);
                            $("#sunset_time").text(data.sunset);
                            const dailyTableBody = $("#daily_pakshi_table_body");
                            dailyTableBody.empty();

                            $.each(data.daily_pakshi_table, function(pakshi, jammam_data) {
                                const row = $("<tr></tr>");
                                row.append($("<td></td>").text(pakshi));
                                $.each(jammam_data, function(jammam_name, activity) {
                                    row.append($("<td></td>").text(activity));
                                });
                                dailyTableBody.append(row);
                            });
                            dailyTableSection.show();

                            showMessage("Calculation successful!", "success");
                        } else {
                            showMessage(response.data || "AJAX Error: Unable to calculate Pancha Pakshi. Please check server logs.", "error");
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        form.find(".btn-calculate").html("கணக்கிடு / Calculate").prop("disabled", false);
                        showMessage("Network Error: Could not connect to the server. Please try again.", "error");
                        console.error("AJAX Error: ", textStatus, errorThrown, jqXHR.responseText);
                    }
                });
            });

            function showMessage(msg, type) {
                messageDiv.text(msg).addClass("pancha-pakshi-" + type).show();
            }
        });
    </script>
    <?php
    return ob_get_clean();
}

// Admin Menu
function pancha_pakshi_add_admin_menu() {
    add_menu_page(
        "Pancha Pakshi Calculator",
        "Pancha Pakshi",
        "manage_options",
        "pancha-pakshi-calculator",
        "pancha_pakshi_admin_page_content",
        "dashicons-buddicons-activity",
        6
    );
}
add_action("admin_menu", "pancha_pakshi_add_admin_menu");

function pancha_pakshi_admin_page_content() {
    echo '<div class="wrap">';
    echo '<h1>Pancha Pakshi Calculator</h1>';
    echo pancha_pakshi_calculator_shortcode_master(); // Display the shortcode content directly
    echo '</div>';
}

// AJAX Handler
function pancha_pakshi_calculate_ajax_handler() {
    check_ajax_referer("pancha_pakshi_nonce", "security");

    $name = sanitize_text_field($_POST["name"]);
    $birth_date = sanitize_text_field($_POST["birth_date"]);
    $birth_time = sanitize_text_field($_POST["birth_time"]);
    $birth_place = sanitize_text_field($_POST["birth_place"]);

    // Validate inputs (basic validation)
    if (empty($name) || empty($birth_date) || empty($birth_time) || empty($birth_place)) {
        wp_send_json_error("All fields are required.");
    }

    // Construct the command to execute the Python script
    $python_script_path = PANCHA_PAKSHI_PLUGIN_DIR . "pancha_pakshi_calculator.py";
    
    // Ensure the Python script is executable
    if (!is_executable($python_script_path)) {
        // Attempt to make it executable if not already
        @chmod($python_script_path, 0755);
        if (!is_executable($python_script_path)) {
            wp_send_json_error("Python script is not executable. Please check file permissions (chmod 755).");
        }
    }

    // Escape arguments for shell command
    $escaped_name = escapeshellarg($name);
    $escaped_birth_date = escapeshellarg($birth_date);
    $escaped_birth_time = escapeshellarg($birth_time);
    $escaped_birth_place = escapeshellarg($birth_place);

    $command = "python3 " . $python_script_path . " " . $escaped_name . " " . $escaped_birth_date . " " . $escaped_birth_time . " " . $escaped_birth_place;

    $output = shell_exec($command . " 2>&1"); // Capture stderr as well

    $result = json_decode($output, true);

    if (json_last_error() === JSON_ERROR_NONE && isset($result["janma_pakshi"])) {
        wp_send_json_success($result);
    } else {
        // Log the raw output for debugging
        error_log("Pancha Pakshi Python Script Output: " . $output);
        wp_send_json_error("Calculation failed. Raw output: " . $output);
    }
}
add_action("wp_ajax_pancha_pakshi_calculate", "pancha_pakshi_calculate_ajax_handler");
add_action("wp_ajax_nopriv_pancha_pakshi_calculate", "pancha_pakshi_calculate_ajax_handler");

// Enqueue scripts and styles (though mostly inlined, this is for good practice or future external scripts)
function pancha_pakshi_enqueue_assets() {
    // If you decide to move some JS/CSS back to external files, enqueue them here.
    // For now, most are inlined for maximum compatibility.
}
add_action("wp_enqueue_scripts", "pancha_pakshi_enqueue_assets");
add_action("admin_enqueue_scripts", "pancha_pakshi_enqueue_assets");

?>
