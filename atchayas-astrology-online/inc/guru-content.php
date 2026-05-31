<?php
/**
 * Guru & academy default content (bilingual).
 *
 * @package Atchayas_Astrology
 */

defined( 'ABSPATH' ) || exit;

/**
 * Default guru display name.
 *
 * @return string
 */
function atchaya_default_guru_name() {
	return atchaya_t( 'Astrologer Ravichandran', 'ஜோதிடர் ரவிச்சந்திரன்' );
}

/**
 * Default guru title/role.
 *
 * @return string
 */
function atchaya_default_guru_title() {
	return atchaya_t( 'Founder & Lead Instructor', 'நிறுவனர் & முதன்மைப் பயிற்றுவிப்பாளர்' );
}

/**
 * Short bio quote for cards and hero areas.
 *
 * @return string
 */
function atchaya_guru_short_quote() {
	return atchaya_t(
		'Astrology is not mere prediction; it is a guide that steers our life path in the right direction.',
		'ஜோதிடம் என்பது வெறும் கணிப்பு அல்ல; அது நம் வாழ்வின் பாதையை நல்வழியில் நடத்தும் ஒரு வழிகாட்டி.'
	);
}

/**
 * Default short bio (homepage / profile card).
 *
 * @return string
 */
function atchaya_default_guru_bio_short() {
	return atchaya_t(
		'Founder of Atchaya\'s Astrology Online with years of deep Jyotish research and precise predictions. He teaches timeless Vedic methods in clear Tamil and English for beginners and professionals alike.',
		'ஆதிசங்கரரின் கூற்றுப்படி, பிரபஞ்சத்தின் ரகசியங்களையும் கிரகங்களின் நகர்வுகளையும் எளிய முறையில் மக்களிடம் கொண்டு சேர்ப்பதே அகாடமியின் நோக்கம். பல ஆண்டுகால ஆழ்ந்த ஜோதிட ஆராய்ச்சி மற்றும் துல்லியமான கணிப்புகளில் அனுபவம் பெற்ற நிறுவனர். தொன்மையான வேத ஜோதிட முறைகளை நவீன காலத்திற்கு ஏற்ப, எளிய தமிழ் மற்றும் ஆங்கிலத்தில் கற்பிப்பதில் வல்லவர்.'
	);
}

/**
 * Full About page content blocks.
 *
 * @return array<string, array{title_en: string, title_ta: string, body_en: string, body_ta: string}>
 */
function atchaya_about_content_blocks() {
	return array(
		'intro' => array(
			'title_en' => 'About the Academy',
			'title_ta' => 'அகாடமி பற்றி',
			'body_en'  => 'In the spirit of Adi Shankara\'s wisdom, Atchaya\'s Astrology Online exists to bring the secrets of the cosmos and the movements of the planets to people in a simple, accessible way. Founder Astrologer Ravichandran brings years of deep Jyotish research and accurate predictions. He excels at teaching traditional Vedic astrology adapted for modern times—in clear Tamil and English.',
			'body_ta'  => 'ஆதிசங்கரரின் கூற்றுப்படி, பிரபஞ்சத்தின் ரகசியங்களையும், கிரகங்களின் நகர்வுகளையும் எளிய முறையில் மக்களிடம் கொண்டு சேர்ப்பதே அட்சயாவின் ஆன்லைன் ஜோதிட அகாடமியின் (Atchaya\'s Astrology Online) நோக்கம். இதன் நிறுவனரான ஜோதிடர் ரவிச்சந்திரன் அவர்கள், பல ஆண்டுகால ஆழ்ந்த ஜோதிட ஆராய்ச்சியிலும், துல்லியமான கணிப்புகளிலும் அனுபவம் பெற்றவர். தொன்மையான வேத ஜோதிட முறைகளை நவீன காலத்திற்கு ஏற்ப, எளிய தமிழ் மற்றும் ஆங்கிலத்தில் கற்பிப்பதில் வல்லவர்.',
		),
		'journey' => array(
			'title_en' => 'My Journey & Mission',
			'title_ta' => 'எனது ஜோதிடப் பயணம் & நோக்கம்',
			'body_en'  => "<ul>\n<li><strong>Tradition & Modernity:</strong> My unique approach is teaching the ancient rules of Jyotish Shastra so today's generation can understand them easily.</li>\n<li><strong>Precise Guidance:</strong> My primary goal is to teach students the scientific truths behind birth charts, transit results, marriage compatibility, and simple remedial methods.</li>\n<li><strong>Academy Goal:</strong> Astrology should not be seen as blind belief, but as an Art of Life that everyone can learn—from beginners to professional astrologers.</li>\n</ul>",
			'body_ta'  => "<ul>\n<li><strong>பாரம்பரியமும் நவீனமும்:</strong> ஜோதிட சாஸ்திரத்தின் பழமையான விதிகளை, இன்றைய தலைமுறையினர் எளிதில் புரிந்து கொள்ளும் வகையில் கற்றுக்கொடுப்பதே எனது தனித்துவம்.</li>\n<li><strong>துல்லியமான வழிகாட்டுதல்:</strong> ஜாதகக் கட்டங்கள், கோச்சார பலன்கள், திருமணப் பொருத்தம் மற்றும் எளிய பரிகார முறைகள் ஆகியவற்றில் உள்ள அறிவியல் உண்மைகளை மாணவர்களுக்குப் பயிற்றுவிப்பதே எனது முதன்மை நோக்கம்.</li>\n<li><strong>அகாடமியின் இலக்கு:</strong> ஜோதிடத்தை ஒரு மூடநம்பிக்கையாகப் பார்க்காமல், வாழ்வை மேம்படுத்தும் ஒரு கலையாக (Art of Life) அனைவரும் கற்க வேண்டும். ஆரம்பநிலை மாணவர்கள் முதல் தொழில்முறை ஜோதிடர்கள் வரை அனைவரும் பயன்பெறும் வகையில் வகுப்புகள் வடிவமைக்கப்பட்டுள்ளன.</li>\n</ul>",
		),
		'promise' => array(
			'title_en' => 'My Promise to Students',
			'title_ta' => 'மாணவர்களுக்கான எனது வாக்குறுதி',
			'body_en'  => 'Every student who learns from me will not merely learn predictions—they will become excellent guides who help resolve the confusions in others\' lives. This is my faith and my promise.',
			'body_ta'  => 'என்னிடம் பயிலும் ஒவ்வொரு மாணவரும், வெறும் கணிப்புகளை மட்டும் கற்றுக்கொள்ளாமல், பிறர் வாழ்வின் குழப்பங்களைத் தீர்க்கும் ஒரு சிறந்த வழிகாட்டியாக (Guide) உருவாவார்கள் என்பதே எனது நம்பிக்கை மற்றும் வாக்குறுதி.',
		),
	);
}

/**
 * Get guru name from customizer or default.
 *
 * @return string
 */
function atchaya_guru_name() {
	$name_en = atchaya_get_option( 'guru_name', 'Astrologer Ravichandran' );
	$name_ta = atchaya_get_option( 'guru_name_ta', 'ஜோதிடர் ரவிச்சந்திரன்' );
	return atchaya_t( $name_en, $name_ta );
}

/**
 * Get guru title from customizer or default.
 *
 * @return string
 */
function atchaya_guru_title() {
	$title_en = atchaya_get_option( 'guru_title', 'Founder & Lead Instructor' );
	$title_ta = atchaya_get_option( 'guru_title_ta', 'நிறுவனர் & முதன்மைப் பயிற்றுவிப்பாளர்' );
	return atchaya_t( $title_en, $title_ta );
}

/**
 * Get guru short bio for cards.
 *
 * @return string
 */
function atchaya_guru_bio_short() {
	$bio_en = atchaya_get_option( 'guru_bio_en' );
	$bio_ta = atchaya_get_option( 'guru_bio_ta' );
	if ( $bio_en || $bio_ta ) {
		return atchaya_t( $bio_en, $bio_ta );
	}
	return atchaya_default_guru_bio_short();
}
