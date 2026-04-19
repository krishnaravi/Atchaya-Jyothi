<?php
/**
 * Panchang Calculation Logic using Python astronomical script.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Atchaya_Panchang_Calculator {

    public function get_panchang_data($date = '', $place = 'Vellore', $lang = 'ta') {
        if (empty($date)) {
            $date = date('Y-m-d');
        }
        
        // Execute the Python script to get astronomical data
        $input = json_encode(['date' => $date]);
        $command = "python3 /home/ubuntu/panchang_calc.py " . escapeshellarg($input);
        $output = shell_exec($command);
        $astro_data = json_decode($output, true);
        
        if (!$astro_data || isset($astro_data['error'])) {
            // Fallback to mock data if script fails
            return $this->get_mock_data($date, $place, $lang);
        }

        $day_of_week = date('l', strtotime($date));
        
        $panchang_data = [
            'date' => $date,
            'place' => $place,
            'sunrise' => '06:15 AM', // Future: Calculate based on Lat/Long
            'sunset' => '06:20 PM',
            'tithi' => [
                'name' => $this->get_tithi_name($astro_data['panchang']['tithi'], $lang),
                'tamil' => $this->get_tithi_name($astro_data['panchang']['tithi'], $lang),
                'end_time' => 'Calculated'
            ],
            'nakshatra' => [
                'name' => $this->get_nakshatra_name($astro_data['panchang']['nakshatra'], $lang),
                'tamil' => $this->get_nakshatra_name($astro_data['panchang']['nakshatra'], $lang),
                'pada' => $astro_data['panchang']['pada'],
                'end_time' => 'Calculated'
            ],
            'yoga' => [
                'name' => $this->get_yoga_name($astro_data['panchang']['yoga'], $lang),
                'tamil' => $this->get_yoga_name($astro_data['panchang']['yoga'], $lang),
                'end_time' => 'Calculated'
            ],
            'karana' => [
                'name' => $this->get_karana_name($astro_data['panchang']['karana'], $lang),
                'tamil' => $this->get_karana_name($astro_data['panchang']['karana'], $lang),
                'end_time' => 'Calculated'
            ],
            'rahu_kalam' => $this->get_rahu_kalam($day_of_week),
            'gulika_kalam' => '06:00 AM - 07:30 AM',
            'yamagandam' => '10:30 AM - 12:00 PM',
            'planets' => $this->translate_planets($astro_data['planets'], $lang),
            'rasi_chart' => $this->format_rasi_chart($astro_data['rasi_chart'], $lang)
        ];
        
        return $panchang_data;
    }

    private function get_tithi_name($num, $lang) {
        $tithis = [
            1 => 'Prathama', 2 => 'Dwitiya', 3 => 'Tritiya', 4 => 'Chaturthi', 5 => 'Panchami',
            6 => 'Shashti', 7 => 'Saptami', 8 => 'Ashtami', 9 => 'Navami', 10 => 'Dashami',
            11 => 'Ekadashi', 12 => 'Dwadashi', 13 => 'Trayodashi', 14 => 'Chaturdashi', 15 => 'Purnima',
            16 => 'Prathama', 17 => 'Dwitiya', 18 => 'Tritiya', 19 => 'Chaturthi', 20 => 'Panchami',
            21 => 'Shashti', 22 => 'Saptami', 23 => 'Ashtami', 24 => 'Navami', 25 => 'Dashami',
            26 => 'Ekadashi', 27 => 'Dwadashi', 28 => 'Trayodashi', 29 => 'Chaturdashi', 30 => 'Amavasya'
        ];
        $name = $tithis[$num] ?? 'Unknown';
        return $this->translate($name, $lang, 'tithi');
    }

    private function get_nakshatra_name($num, $lang) {
        $nakshatras = [
            1 => 'Ashwini', 2 => 'Bharani', 3 => 'Krittika', 4 => 'Rohini', 5 => 'Mrigashirsha',
            6 => 'Ardra', 7 => 'Punarvasu', 8 => 'Pushya', 9 => 'Ashlesha', 10 => 'Magha',
            11 => 'Purva Phalguni', 12 => 'Uttara Phalguni', 13 => 'Hasta', 14 => 'Chitra', 15 => 'Swati',
            16 => 'Vishakha', 17 => 'Anuradha', 18 => 'Jyeshtha', 19 => 'Mula', 20 => 'Purva Ashadha',
            21 => 'Uttara Ashadha', 22 => 'Shravana', 23 => 'Dhanishta', 24 => 'Shatabhisha', 25 => 'Purva Bhadrapada',
            26 => 'Uttara Bhadrapada', 27 => 'Revati'
        ];
        $name = $nakshatras[$num] ?? 'Unknown';
        return $this->translate($name, $lang, 'nakshatra');
    }

    private function get_yoga_name($num, $lang) {
        $yogas = [
            1 => 'Vishkumbha', 2 => 'Preeti', 3 => 'Ayushman', 4 => 'Saubhagya', 5 => 'Shobhana',
            6 => 'Atiganda', 7 => 'Sukarma', 8 => 'Dhriti', 9 => 'Shula', 10 => 'Ganda',
            11 => 'Vriddhi', 12 => 'Dhruva', 13 => 'Vyaghata', 14 => 'Harshana', 15 => 'Vajra',
            16 => 'Siddhi', 17 => 'Vyatipata', 18 => 'Variyan', 19 => 'Parigha', 20 => 'Shiva',
            21 => 'Siddha', 22 => 'Sadhya', 23 => 'Shubha', 24 => 'Shukla', 25 => 'Brahma',
            26 => 'Indra', 27 => 'Vaidhriti'
        ];
        $name = $yogas[$num] ?? 'Unknown';
        return $this->translate($name, $lang, 'yoga');
    }

    private function get_karana_name($num, $lang) {
        $karanas = [
            1 => 'Bava', 2 => 'Balava', 3 => 'Kaulava', 4 => 'Taitila', 5 => 'Gara',
            6 => 'Vanija', 7 => 'Vishti', 8 => 'Shakuni', 9 => 'Chatushpada', 10 => 'Naga', 11 => 'Kimstughna'
        ];
        $name = $karanas[$num] ?? 'Unknown';
        return $this->translate($name, $lang, 'karana');
    }

    private function translate_planets($planets, $lang) {
        foreach ($planets as &$p) {
            $p['planet_name'] = $this->translate($p['planet'], $lang, 'planet');
            $p['rasi_name'] = $this->get_rasi_name($p['rasi'], $lang);
            $p['nakshatra_name'] = $this->get_nakshatra_name($p['nakshatra'], $lang);
        }
        return $planets;
    }

    private function get_rasi_name($num, $lang) {
        $rasis = [
            1 => 'Mesha', 2 => 'Rishaba', 3 => 'Mithuna', 4 => 'Kataka', 5 => 'Simha', 6 => 'Kanya',
            7 => 'Thula', 8 => 'Vrischika', 9 => 'Dhanus', 10 => 'Makara', 11 => 'Kumbha', 12 => 'Meena'
        ];
        return $this->translate($rasis[$num], $lang, 'rasi');
    }

    private function format_rasi_chart($chart, $lang) {
        $formatted = [];
        for ($i = 1; $i <= 12; $i++) {
            $planets_in_rasi = $chart[strval($i)] ?? [];
            $translated_planets = [];
            foreach ($planets_in_rasi as $p) {
                $translated_planets[] = $this->translate($p, $lang, 'planet_short');
            }
            $formatted[strval($i)] = implode(', ', $translated_planets);
        }
        return $formatted;
    }

    private function get_rahu_kalam($day) {
        $times = [
            'Monday' => '07:30 AM - 09:00 AM',
            'Tuesday' => '03:00 PM - 04:30 PM',
            'Wednesday' => '12:00 PM - 01:30 PM',
            'Thursday' => '01:30 PM - 03:00 PM',
            'Friday' => '10:30 AM - 12:00 PM',
            'Saturday' => '09:00 AM - 10:30 AM',
            'Sunday' => '04:30 PM - 06:00 PM'
        ];
        return $times[$day] ?? '07:30 AM - 09:00 AM';
    }

    private function translate($text, $lang, $context = '') {
        $translations = [
            'ta' => [
                'Sun' => 'சூரியன்', 'Moon' => 'சந்திரன்', 'Mars' => 'செவ்வாய்', 'Mercury' => 'புதன்',
                'Jupiter' => 'குரு', 'Venus' => 'சுக்கிரன்', 'Saturn' => 'சனி', 'Rahu' => 'ராகு', 'Ketu' => 'கேது',
                'Mesha' => 'மேஷம்', 'Rishaba' => 'ரிஷபம்', 'Mithuna' => 'மிதுனம்', 'Kataka' => 'கடகம்',
                'Simha' => 'சிம்மம்', 'Kanya' => 'கன்னி', 'Thula' => 'துலாம்', 'Vrischika' => 'விருச்சிகம்',
                'Dhanus' => 'தனுசு', 'Makara' => 'மகரம்', 'Kumbha' => 'கும்பம்', 'Meena' => 'மீனம்',
                'Ashwini' => 'அசுவினி', 'Bharani' => 'பரணி', 'Krittika' => 'கார்த்திகை', 'Rohini' => 'ரோகிணி',
                // Add more translations as needed...
            ],
            // Add other languages...
        ];
        
        // Planet short names for Rasi Chart
        $short_names = [
            'ta' => [
                'Sun' => 'சூ', 'Moon' => 'சந்', 'Mars' => 'செ', 'Mercury' => 'பு',
                'Jupiter' => 'கு', 'Venus' => 'சு', 'Saturn' => 'ச', 'Rahu' => 'ரா', 'Ketu' => 'கே'
            ],
            'en' => [
                'Sun' => 'Su', 'Moon' => 'Mo', 'Mars' => 'Ma', 'Mercury' => 'Me',
                'Jupiter' => 'Ju', 'Venus' => 'Ve', 'Saturn' => 'Sa', 'Rahu' => 'Ra', 'Ketu' => 'Ke'
            ]
        ];

        if ($context === 'planet_short' && isset($short_names[$lang][$text])) {
            return $short_names[$lang][$text];
        }

        if (isset($translations[$lang][$text])) {
            return $translations[$lang][$text];
        }
        return $text;
    }

    private function get_mock_data($date, $place, $lang) {
        // Simple fallback
        return ['date' => $date, 'place' => $place, 'error' => true];
    }
}
