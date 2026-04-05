## Pancha Pakshi Calculator WordPress Plugin - Installation Guide (Version 2.1 - Final Fix)

This guide provides detailed instructions for installing and configuring the Pancha Pakshi Calculator WordPress plugin. This version includes significant changes to ensure compatibility with page builders like Divi and robust frontend display.

### 1. Plugin Overview

This plugin calculates the Janma Pakshi (birth bird) based on birth details and displays the daily Pancha Pakshi activities. It features:
-   Janma Pakshi calculation based on Nakshatra and Paksha.
-   Daily Pancha Pakshi activity table.
-   Admin menu for easy access.
-   **Enhanced compatibility with page builders (like Divi) by inlining all CSS and JavaScript.**
-   **Simplified location input: Currently supports a predefined list of major Indian cities only (e.g., Chennai, Madurai, Mumbai, Delhi, Kolkata, Bangalore, Hyderabad).**

### 2. Server Requirements

To ensure the plugin functions correctly, your hosting environment must meet the following requirements:
-   **WordPress:** Version 5.0 or higher.
-   **PHP:** Version 7.4 or higher.
-   **Python 3:** Python 3.6 or higher must be installed on your server.
-   **PyEphem Library:** The `ephem` Python library is required for astrological calculations. You must install it on your server using the command:
    ```bash
    sudo pip3 install ephem
    ```
    *If you do not have SSH access or are unsure how to do this, please contact your hosting provider's support.* 

### 3. Installation Steps

Follow these steps to install the plugin:

1.  **Download the Plugin:** Download the latest `pancha-pakshi-final-fix.zip` file provided by Manus AI.

2.  **Upload via WordPress Admin:**
    -   Log in to your WordPress admin dashboard (`yourdomain.com/wp-admin`).
    -   Navigate to **Plugins > Add New**.
    -   Click the **"Upload Plugin"** button at the top of the page.
    -   Click **"Choose File"**, select the `pancha-pakshi-final-fix.zip` file you downloaded, and click **"Install Now"**.

3.  **Activate the Plugin:**
    -   After installation, click the **"Activate Plugin"** button.
    -   If activation fails, please check your server's PHP error logs or contact your hosting provider.

4.  **Verify Admin Menu:**
    -   Once activated, you should see a new menu item named **"Pancha Pakshi"** in your WordPress admin sidebar.
    -   Clicking this menu item will take you to the calculator page within the admin area.

### 4. Usage (Frontend - Shortcode)

To display the Pancha Pakshi Calculator on any page or post on your website:

1.  **Create/Edit a Page/Post:** Go to **Pages > Add New** or **Posts > Add New**, or edit an existing one.

2.  **Insert the Shortcode:**
    -   In the WordPress editor (Gutenberg, Classic Editor, or page builders like Divi/Elementor), insert the following shortcode:
        ```
        [pancha_pakshi_calculator]
        ```
    -   **For Divi Builder users:** Use a **"Code Module"** or **"Text Module"** and paste the shortcode directly. The plugin is now designed to ensure the shortcode renders correctly.

3.  **Publish/Update:** Save or publish your page/post.

4.  **View on Frontend:** Visit the page on your website to see the Pancha Pakshi Calculator in action.

### 5. Troubleshooting

If you encounter issues, please check the following:

-   **Shortcode Not Displaying:**
    -   Ensure the plugin is activated.
    -   Verify you are using the correct shortcode: `[pancha_pakshi_calculator]` (single brackets).
    -   If using a page builder, ensure you are using a "Code" or "Text" module to insert the shortcode.

-   **"AJAX Error: Unable to calculate Pancha Pakshi" or "Python 3 not found" / "ephem not found":**
    -   This indicates a server-side issue with Python or the `ephem` library.
    -   **Crucially, ensure Python 3 is installed and the `ephem` library is installed for Python 3 on your server.** Contact your hosting provider if you need assistance with `sudo pip3 install ephem`.
    -   The plugin now includes enhanced error reporting. Check the debug area below the calculator for specific messages.

-   **"Calculation failed" Error:**
    -   Verify date/time format (YYYY-MM-DD, HH:MM).
    -   **City name must be from the supported list:** Chennai, Madurai, Mumbai, Delhi, Kolkata, Bangalore, Hyderabad.

-   **Form Not Displaying:**
    -   Check your browser console (F12 -> Console) for JavaScript errors.

### 6. Support

If you continue to experience problems, please provide the following information to Manus AI for assistance:
-   A screenshot of the error message (if any).
-   Your WordPress version.
-   Your PHP version.
-   Details of your hosting environment.
-   Any specific error messages from your server's error logs.
