<?php
/**
 * Panchang Calculation Logic
 */

if (!defined(\'ABSPATH\')) {
    exit;
}

class Atchaya_Panchang_Calculator {

    public function get_panchang_data($date = \'\', $place = \'Vellore\', $lang = \'ta\') {
        if (empty($date)) {
            $date = date(\'Y-m-d\');
        }
        
        // Mocking the daily change logic
        // In a real implementation, this would call Swiss Ephemeris or an API
        $day_of_week = date(\'l\', strtotime($date));
        
        return [
            \'date\' => $date,
            \'place\' => $place,
            \'sunrise\' => \'06:15 AM\',
            \'sunset\' => \'06:20 PM\',
            \'tithi\' => [
                \'name\' => $this->translate(\'Shukla Paksha Dashami\', $lang, \'திதி\'),
                \'tamil\' => $this->translate(\'சுக்ல பட்ச தசமி\', $lang, \'திதி\'),
                \'end_time\' => \'10:45 PM\'
            ],
            \'nakshatra\' => [
                \'name\' => $this->translate(\'Rohini\', $lang, \'நட்சத்திரம்\'),
                \'tamil\' => $this->translate(\'ரோகிணி\', $lang, \'நட்சத்திரம்\'),
                \'end_time\' => \'02:30 PM\'
            ],
            \'yoga\' => [
                \'name\' => $this->translate(\'Siddha\', $lang, \'யோகம்\'),
                \'tamil\' => $this->translate(\'சித்த யோகம்\', $lang, \'யோகம்\'),
                \'end_time\' => \'05:00 PM\'
            ],
            \'karana\' => [
                \'name\' => $this->translate(\'Taitila\', $lang, \'கரணம்\'),
                \'tamil\' => $this->translate(\'சைதுளை\', $lang, \'கரணம்\'),
                \'end_time\' => \'11:00 AM\'
            ],
            \'rahu_kalam\' => $this->get_rahu_kalam($day_of_week),
            \'gulika_kalam\' => \'06:00 AM - 07:30 AM\',
            \'yamagandam\' => \'10:30 AM - 12:00 PM\',
            \'gowri_panchangam\' => [
                \'morning\' => $this->translate(\'Amrutha\', $lang, \'கௌரி பஞ்சாங்கம்\'),
                \'evening\' => $this->translate(\'Subha\', $lang, \'கௌரி பஞ்சாங்கம்\')
            ],
            \'rasi_chart\' => [
                \'1\' => $this->translate(\'Mesha\', $lang, \'ராசி\'),
                \'2\' => $this->translate(\'Rishaba (Moon)\' , $lang, \'ராசி\'),
                \'3\' => $this->translate(\'Mithuna\', $lang, \'ராசி\'),
                \'4\' => $this->translate(\'Kataka\', $lang, \'ராசி\'),
                \'5\' => $this->translate(\'Simha\', $lang, \'ராசி\'),
                \'6\' => $this->translate(\'Kanya\', $lang, \'ராசி\'),
                \'7\' => $this->translate(\'Thula\', $lang, \'ராசி\'),
                \'8\' => $this->translate(\'Vrischika\', $lang, \'ராசி\'),
                \'9\' => $this->translate(\'Dhanus\', $lang, \'ராசி\'),
                \'10\' => $this->translate(\'Makara\', $lang, \'ராசி\'),
                \'11\' => $this->translate(\'Kumbha\', $lang, \'ராசி\'),
                \'12\' => $this->translate(\'Meena\', $lang, \'ராசி\')
            ]
        ];
    }

    private function get_rahu_kalam($day) {
        $times = [
            \'Monday\' => \'07:30 AM - 09:00 AM\',
            \'Tuesday\' => \'03:00 PM - 04:30 PM\',
            \'Wednesday\' => \'12:00 PM - 01:30 PM\',
            \'Thursday\' => \'01:30 PM - 03:00 PM\',
            \'Friday\' => \'10:30 AM - 12:00 PM\',
            \'Saturday\' => \'09:00 AM - 10:30 AM\',
            \'Sunday\' => \'04:30 PM - 06:00 PM\'
        ];
        return $times[$day] ?? \'07:30 AM - 09:00 AM\';
    }

    private function translate($text, $lang, $context = \'\') {
        // This is a simplified translation for mock data.
        // In a real scenario, this would use gettext or a proper translation API.
        $translations = [
            \'ta\' => [
                \'Shukla Paksha Dashami\' => \'சுக்ல பட்ச தசமி\',
                \'Rohini\' => \'ரோகிணி\',
                \'Siddha\' => \'சித்த யோகம்\',
                \'Taitila\' => \'சைதுளை\',
                \'Mesha\' => \'மேஷம்\',
                \'Rishaba (Moon)\' => \'ரிஷபம் (சந்திரன்)\' ,
                \'Mithuna\' => \'மிதுனம்\',
                \'Kataka\' => \'கடகம்\',
                \'Simha\' => \'சிம்மம்\',
                \'Kanya\' => \'கன்னி\',
                \'Thula\' => \'துலாம்\',
                \'Vrischika\' => \'விருச்சிகம்\',
                \'Dhanus\' => \'தனுசு\',
                \'Makara\' => \'மகரம்\',
                \'Kumbha\' => \'கும்பம்\',
                \'Meena\' => \'மீனம்\',
                \'Amrutha\' => \'அமிர்த\',
                \'Subha\' => \'சுப\'
            ],
            \'en\' => [
                \'Shukla Paksha Dashami\' => \'Shukla Paksha Dashami\',
                \'Rohini\' => \'Rohini\',
                \'Siddha\' => \'Siddha Yoga\',
                \'Taitila\' => \'Taitila Karana\',
                \'Mesha\' => \'Aries\',
                \'Rishaba (Moon)\' => \'Taurus (Moon)\' ,
                \'Mithuna\' => \'Gemini\',
                \'Kataka\' => \'Cancer\',
                \'Simha\' => \'Leo\',
                \'Kanya\' => \'Virgo\',
                \'Thula\' => \'Libra\',
                \'Vrischika\' => \'Scorpio\',
                \'Dhanus\' => \'Sagittarius\',
                \'Makara\' => \'Capricorn\',
                \'Kumbha\' => \'Aquarius\',
                \'Meena\' => \'Pisces\',
                \'Amrutha\' => \'Amrutha\',
                \'Subha\' => \'Subha\'
            ],
            \'te\' => [
                \'Shukla Paksha Dashami\' => \'శుక్ల పక్ష దశమి\',
                \'Rohini\' => \'రోహిణి\',
                \'Siddha\' => \'సిద్ధ యోగం\',
                \'Taitila\' => \'తైతిల కరణం\',
                \'Mesha\' => \'మేషం\',
                \'Rishaba (Moon)\' => \'వృషభం (చంద్రుడు)\' ,
                \'Mithuna\' => \'మిథునం\',
                \'Kataka\' => \'కర్కాటకం\',
                \'Simha\' => \'సింహం\',
                \'Kanya\' => \'కన్య\',
                \'Thula\' => \'తుల\',
                \'Vrischika\' => \'వృశ్చికం\',
                \'Dhanus\' => \'ధనుస్సు\',
                \'Makara\' => \'మకరం\',
                \'Kumbha\' => \'కుంభం\',
                \'Meena\' => \'మీనం\',
                \'Amrutha\' => \'అమృత\',
                \'Subha\' => \'శుభ\'
            ],
            \'ka\' => [
                \'Shukla Paksha Dashami\' => \'ಶುಕ್ಲ ಪಕ್ಷ ದಶಮಿ\',
                \'Rohini\' => \'ರೋಹಿಣಿ\',
                \'Siddha\' => \'ಸಿದ್ಧ ಯೋಗ\',
                \'Taitila\' => \'ತೈತಿಲ ಕರಣ\',
                \'Mesha\' => \'ಮೇಷ\',
                \'Rishaba (Moon)\' => \'ವೃಷಭ (ಚಂದ್ರ)\' ,
                \'Mithuna\' => \'ಮಿಥುನ\',
                \'Kataka\' => \'ಕರ್ಕಾಟಕ\',
                \'Simha\' => \'ಸಿಂಹ\',
                \'Kanya\' => \'ಕನ್ಯಾ\',
                \'Thula\' => \'ತುಲಾ\',
                \'Vrischika\' => \'ವೃಶ್ಚಿಕ\',
                \'Dhanus\' => \'ಧನುಸ್ಸು\',
                \'Makara\' => \'ಮಕರ\',
                \'Kumbha\' => \'ಕುಂಭ\',
                \'Meena\' => \'ಮೀನ\',
                \'Amrutha\' => \'ಅಮೃತ\',
                \'Subha\' => \'ಶುಭ\'
            ],
            \'hi\' => [
                \'Shukla Paksha Dashami\' => \'शुक्ल पक्ष दशमी\',
                \'Rohini\' => \'रोहिणी\',
                \'Siddha\' => \'सिद्ध योग\',
                \'Taitila\' => \'तैतिल करण\',
                \'Mesha\' => \'मेष\',
                \'Rishaba (Moon)\' => \'वृषभ (चंद्रमा)\' ,
                \'Mithuna\' => \'मिथुन\',
                \'Kataka\' => \'कर्क\',
                \'Simha\' => \'सिंह\',
                \'Kanya\' => \'कन्या\',
                \'Thula\' => \'तुला\',
                \'Vrischika\' => \'वृश्चिक\',
                \'Dhanus\' => \'धनु\',
                \'Makara\' => \'मकर\',
                \'Kumbha\' => \'कुंभ\',
                \'Meena\' => \'मीन\',
                \'Amrutha\' => \'अमृत\',
                \'Subha\' => \'शुभ\'
            ],
            \'ml\' => [
                \'Shukla Paksha Dashami\' => \'ശുക്ല പക്ഷ ദശമി\',
                \'Rohini\' => \'രോഹിണി\',
                \'Siddha\' => \'സിദ്ധ യോഗം\',
                \'Taitila\' => \'തൈതില കരണം\',
                \'Mesha\' => \'മേടം\',
                \'Rishaba (Moon)\' => \'ഇടവം (ചന്ദ്രൻ)\' ,
                \'Mithuna\' => \'മിഥുനം\',
                \'Kataka\' => \'കർക്കിടകം\',
                \'Simha\' => \'ചിങ്ങം\',
                \'Kanya\' => \'കന്നി\',
                \'Thula\' => \'തുലാം\',
                \'Vrischika\' => \'വൃശ്ചികം\',
                \'Dhanus\' => \'ധനു\',
                \'Makara\' => \'മകരം\',
                \'Kumbha\' => \'കുംഭം\',
                \'Meena\' => \'മീനം\',
                \'Amrutha\' => \'അമൃത\',
                \'Subha\' => \'ശുഭ\'
            ]
        ];

        if (isset($translations[$lang][$text])) {
            return $translations[$lang][$text];
        }
        return $text; // Return original text if no translation is found
    }
}
