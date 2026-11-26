/* Édition du presskit
 * Événement : dupliquer une entrée de events, choisir festival, club ou autonomous,
 * Compléter meta_fr et meta_en et indiquer le chemin exact du flyer dans file.
 * Sortie : dupliquer une entrée de releases. isVinyl: true active le filtre vinyle.
 * audioFile et link sont facultatifs. Utiliser un extrait local et un lien de sortie.
 * Artiste : dupliquer une entrée de roster avec sa branche, son rôle et ses deux bios.
 * Les champs influences, albumTitle/albumUrl et setTitle/setUrl peuvent rester vides.
 * Photo : déposer le fichier dans assets/ et renseigner file dans galleryItems.
 * Donner un titre dans chaque langue. L'ordre du tableau est celui du carrousel.
 * Pour chaque image, thumb peut désigner une vignette plus légère que file.
 * Sur une capture, crop contient la largeur, la hauteur et la hauteur visible, en pixels du grand visuel.
 */
const i18nDict = {
  fr: {
    rotondeArchive: "Dans l’atrium de la Rotonde, les projections d’Iluma Visual accompagnaient la carte blanche Void X Series avec Attechtion Please. Sono Design signait l’exposition et le live painting.",
    livePhotos: "Archives sur Instagram ↗",
    booking: "Booking ↗",
    liveSet: "Ramona Yacef à Château Perché ↗",
    archive: "Explorer les dates passées",
    choosePreview: "Choisir un extrait", nextPreview: "Suivant",

    brand: "PARIS // DEPUIS 2017",
    bannerDates: "CLUB / LIVE / OPEN AIR",
    bannerMix: "45 PODCASTS VR & 26 PODCASTS Void X Series",
    bannerReleases: "SORTIES SUR BANDCAMP",
    struct: "Structure",
    cadre: "Cadre",
    grants: "Soutiens",
    phone: "Téléphone",
    pdf: "Portfolio musical · PDF ↓",
    close: "Fermer ✕",

    nav_events: "Dates",
    nav_releases: "Sorties",
    nav_podcasts: "Podcasts",
    nav_roster: "Roster",
    nav_gallery: "Galerie",
    nav_about: "À propos",
    hero_tag: "Label indépendant · Paris, 2017",
    hero_desc: "VOID défend une techno mentale et texturée. Sur Void X Series, le groove se déplace entre minimale, micro-house et électro. Ces deux lignes traversent le catalogue et se croisent derrière les platines.",
    btn_events: "Les dates ↓",
    sec_events_title: "Dates clés",
    manifesto_p1: "Nous invitons à Paris des artistes dont les disques, les labels ou les soirées ont marqué leurs scènes respectives. VR et Void X Series suivent chacune leurs affinités. Dans les deux séries, nos résidents partagent les platines avec des invités venus de différents pays et des artistes qui émergent ici.",
    manifesto_p2: "Une partie de nos dates s’écrit avec les collectifs et les associations de la scène parisienne. Nous choisissons ensemble les invités, proposons des b2b entre résidents et réunissons nos publics sur la même piste.",
    ethos_title: "La programmation",
    ethos_p: "Prenez soin les uns des autres. Tout comportement oppressif ou irrespectueux entraîne une exclusion immédiate et définitive de nos événements.",
    filter_ev_all: "Toutes",
    filter_ev_fest: "FESTIVALS & OPEN AIR",
    filter_ev_club: "CLUB & LIVE",
    filter_ev_vxs: "DAYTIME & AFTERHOURS",
    sec_releases_title: "Sorties",
    filter_rel_all: "Tout",
    filter_rel_vinyl: "Vinyles",
    sec_podcasts_title: "Mixes",
    btn_sc_archive: "71 mixes sur SoundCloud ↗",
    sec_roster_title: "Roster",
    sec_gallery_title: "Archives live",
    sec_about_title: "À propos",
    about_p1: "En 2017, une passion commune pour les musiques électroniques nous réunit à Paris. En parallèle de nos études, nous montons les premières soirées VOID. Au fil des dates et des rencontres, le projet prend son indépendance et le collectif grandit. En 2020, nous lançons le label.",
    about_p2: "Depuis 2017, le collectif a organisé une trentaine de dates, des nuits en club aux cartes blanches en festival. Les open airs gratuits font aussi partie de cette histoire, notamment au belvédère de Belleville pour Kiosque en Fête.",
    projects_intro: "À force de jouer dans des lieux très différents, on a eu envie de construire nous-mêmes le décor de certaines nuits.",
    sceno_1_desc: "Avec <strong>Signal</strong>, nous avons monté quatre soirées en autonomie, du choix des artistes à l’installation du système son. Dès la première édition, nous avons réuni les lives de Kyosei et de MSKD et les sélections de TASSERY dans un espace redessiné par nos projections.",
    sceno_2_desc: "Pour <strong>Rotonde XXL</strong>, l’idée était de faire de l’atrium à la fois une piste de danse et un lieu d’exposition. Iluma Visual composait ses projections à même l’architecture de la Rotonde, en jouant avec l’enceinte du bâtiment et les surfaces disponibles. Sono Design y peignait en direct. La carte blanche de Void X Series avec Attechtion Please nous a donné l’occasion de tenter cette rencontre.",
    meta_struct: "association loi 1901 (fondée en 2017, Paris)",
    meta_license: "licence d'entrepreneur du spectacle & affilié CNM",
    meta_grants: "lauréat Île des Chances (Région IDF x KKBB) · Kiosque en Fête (Ville de Paris, 3 éditions)",
    modal_listen: "Écouter l’extrait",
    modal_fav_album: "ALBUM COUP DE CŒUR",
    card_more_event: "Line-up +",
    card_more_release: "Tracklist +",
    card_open_sc: "Écouter ↗"
  },
  en: {
    rotondeArchive: "In the Rotonde atrium, Iluma Visual projected across the room for the Void X Series takeover with Attechtion Please. Sono Design curated the exhibition and painted live.",
    livePhotos: "Archives on Instagram ↗",
    booking: "Booking ↗",
    liveSet: "Ramona Yacef at Château Perché ↗",
    archive: "Explore past dates",
    choosePreview: "Choose a preview", nextPreview: "Next",

    brand: "PARIS // EST. 2017",
    bannerDates: "CLUB / LIVE / OPEN AIR",
    bannerMix: "45 VR PODCASTS & 26 Void X Series PODCASTS",
    bannerReleases: "RELEASES ON BANDCAMP",
    struct: "Structure",
    cadre: "Registration",
    grants: "Support",
    phone: "Phone",
    pdf: "Music portfolio · PDF ↓",
    close: "Close ✕",

    nav_events: "Events",
    nav_releases: "Releases",
    nav_podcasts: "Podcasts",
    nav_roster: "Roster",
    nav_gallery: "Gallery",
    nav_about: "About",
    hero_tag: "Independent label · Paris, 2017",
    hero_desc: "VOID is rooted in hypnotic, textured techno. Void X Series moves between minimal, micro-house and electro. Both strands run through the catalogue and meet in the booth.",
    btn_events: "Dates ↓",
    sec_events_title: "Key dates",
    manifesto_p1: "We invite artists to Paris whose records, labels or parties have shaped their own scenes. VR and Void X Series each follow their own musical interests. Across both series, our residents share the booth with international guests and artists emerging closer to home.",
    manifesto_p2: "We put on some of our nights with other collectives and associations in Paris. Together we choose the guests, pair residents for back-to-back sets and bring our crowds onto the same dancefloor.",
    ethos_title: "Our programme",
    ethos_p: "Look out for each other. Oppressive or disrespectful behaviour means immediate and permanent exclusion from our events.",
    filter_ev_all: "All selected",
    filter_ev_fest: "FESTIVALS & OPEN AIR",
    filter_ev_club: "CLUB & LIVE",
    filter_ev_vxs: "DAYTIME & AFTERHOURS",
    sec_releases_title: "Releases",
    filter_rel_all: "All releases",
    filter_rel_vinyl: "Vinyl",
    sec_podcasts_title: "Mixes",
    btn_sc_archive: "71 mixes on SoundCloud ↗",
    sec_roster_title: "Roster",
    sec_gallery_title: "Live archives",
    sec_about_title: "About",
    about_p1: "VOID began in Paris in 2017, as a shared passion for electronic music grew alongside our studies. The first parties brought us together. Through the nights we put on and the people we met, the project took on a life of its own and grew into the Paris collective that launched its label in 2020.",
    about_p2: "The collective has organised around thirty events since 2017, from club nights to festival stage takeovers. Free open airs are part of that history too, including a sound system at the Belleville belvedere for Kiosque en Fête.",
    projects_intro: "Playing in such different spaces made us want to shape the setting for some of our nights ourselves.",
    sceno_1_desc: "With <strong>Signal</strong>, we produced four nights ourselves, from booking the artists to installing the sound system. For the first edition, our projections shaped the space around live sets by Kyosei and MSKD and a DJ set by TASSERY.",
    sceno_2_desc: "For <strong>Rotonde XXL</strong>, we wanted the atrium to be both a dancefloor and an exhibition space. Iluma Visual mapped projections onto the Rotonde itself, working with the building’s perimeter and the surfaces available. Sono Design painted live in the atrium. The Void X Series takeover with Attechtion Please gave us a chance to try the idea out.",
    meta_struct: "non-profit organization (founded in 2017, Paris)",
    meta_license: "licensed live event producer & CNM member",
    meta_grants: "Île des Chances laureate (Région IDF x KKBB) · Kiosque en Fête (City of Paris, 3 editions)",
    modal_listen: "Play preview",
    modal_fav_album: "FAVOURITE ALBUM",
    card_more_event: "Line-up +",
    card_more_release: "Tracklist +",
    card_open_sc: "Listen ↗"
  }
};

/* =========================================================================
   2. ÉVÉNEMENTS
   ========================================================================= */
const events = [
  {
    tag: "14.11.26 · BABOUR SAUVAGE",
    caption_fr: "À Chișinău, Minube choisit les sorties de readred. Son Bounce EP est le deuxième vinyle du label.", caption_en: "In Chișinău, Minube curates readred. His Bounce EP is the label’s second vinyl release.",
    category: "autonomous", badge: "SUNRISE SESSION", badgeType: "vxs",
    title: "Void X Series invites Minube",
    artist: "Minube · Any Yugël · Orphée b2b Tabet",
    file: "assets/web/event-babour-shotgun-1400.jpg", thumb: "assets/web/event-babour-shotgun-480.jpg",
    meta_fr: "Venu de Moldavie, Minube rejoint les résidents de Void X Series à bord de la péniche du parc de la Villette. De 6 h à midi, entre minimale, électro et house.<br><br>Visuel : @tristan.chrtr",
    meta_en: "Moldova’s Minube joins the Void X Series residents on a barge in Parc de la Villette. Minimal, electro and house from 6 am to noon.<br><br>Artwork : @tristan.chrtr"
  },
  {
    tag: "25.07.25 · CHÂTEAU PERCHÉ FESTIVAL",
    caption_fr: "Eli Verveine, qui dirige Tardis Records avec Oscar Schubaq, et Ramona Yacef sont les invitées de la scène programmée avec Evolove.", caption_en: "Eli Verveine, who runs Tardis Records with Oscar Schubaq, joins Ramona Yacef on the stage we programmed with Evolove.",
    category: "festival",
    badge: "19H STAGE CURATION",
    badgeType: "void",
    title: "Château Perché - Scène La Grande Muraille", title_en: "Château Perché - La Grande Muraille Stage",
    artist: "19h non-stop · Void Records x Evolove",
    crop: [680, 842, 808],
    file: "assets/web/event-perche-2025-1000.jpg", thumb: "assets/web/event-perche-2025-480.jpg",
    meta_fr: "La Grande Muraille, de 13 h à 8 h le lendemain. Une scène partagée avec Evolove au château de Farcheville.<br><br><strong>LINE-UP :</strong> Eli Verveine · Ramona Yacef · Nori · Sanrei b2b Orphée · Tishka b2b Tabet · Stourm b2b Leo · Ovomaltine.<br><br>Visuel : @tristan.chrtr",
    meta_en: "La Grande Muraille, from 1 pm to 8 am the next morning. A stage shared with Evolove at Château de Farcheville.<br><br><strong>LINE-UP :</strong> Eli Verveine · Ramona Yacef · Nori · Sanrei b2b Orphée · Tishka b2b Tabet · Stourm b2b Leo · Ovomaltine.<br><br>Visual : @tristan.chrtr"
  },
  {
    tag: "19.09.25 · VIRAGE",
    caption_fr: "Tasha a lancé Neighbourhood au Plastic People de Londres avant d’en faire un label en 2016. VOID et Trikar l’invitent aux côtés de Laure Croft et Voiski.", caption_en: "Tasha started Neighbourhood at London’s Plastic People before launching the label in 2016. VOID and Trikar invited her alongside Laure Croft and Voiski.",
    category: "club",
    badge: "CLUB & LIVE",
    badgeType: "void",
    title: "Virage - Void Records x Trikar",
    artist: "Voiski · Laure Croft · Tasha · Gatien Delobel b2b Eniro",
    file: "assets/web/event-virage-2025-shotgun-1000.jpg", thumb: "assets/web/event-virage-2025-shotgun-480.jpg",
    meta_fr: "Plateau techno sous le périphérique parisien mêlant performances live et sélections vinyles.<br><br>Avec Tasha (Neighbourhood), Laure Croft (Sex*recs / Kinky Sundays), Voiski (en remplacement de dernière minute pour .Vril) et nos résidents Gatien Delobel b2b Eniro.<br><br>Direction visuelle & motion : @lvsk_klem · Peinture originale : @pauline.naret",
    meta_en: "Live techno and vinyl sets beneath the Paris ring road.<br><br>Featuring Tasha (Neighbourhood), Laure Croft (Sex*recs / Kinky Sundays), Voiski (last-minute fill-in for .Vril), and residents Gatien Delobel b2b Eniro.<br><br>Visual direction & motion : @lvsk_klem · Painting : @pauline.naret"
  },
  {
    tag: "01.11.25 · FVTVR",
    caption_fr: "Justine Perry et Paula Koski partagent les platines du FVTVR. On retrouve leurs deux écritures sur Paired Works, leur double EP chez Ostgut Ton.", caption_en: "Justine Perry and Paula Koski shared the decks at FVTVR. Their distinct approaches also feature on Paired Works, their double EP for Ostgut Ton.",
    category: "club",
    badge: "CLUB CURATION",
    badgeType: "void",
    title: "FVTVR Invites Void Records",
    artist: "Andy Martin · Justine Perry b2b Paula Koski · Justyn Nell b2b Orphée",
    file: "assets/web/event-fvtvr-andy-shotgun-1000.jpg", thumb: "assets/web/event-fvtvr-andy-shotgun-480.jpg",
    meta_fr: "De minuit à 7 h, un solo et deux b2b.<br><br>Avec Andy Martin, Justine Perry b2b Paula Koski et Justyn Nell b2b Orphée.<br>Visuel : @tristan.chrtr",
    meta_en: "One solo set and two back-to-backs, from midnight to 7 am.<br><br>Featuring Andy Martin, Justine Perry b2b Paula Koski, and Justyn Nell b2b Orphée.<br>Visual : @tristan.chrtr"
  },
  {
    tag: "06.12.25 · PAVILLON PUEBLA",
    caption_fr: "Domi est résidente de HORS-SOL et co-initiatrice de Réinventer la nuit. Au Puebla, Void X Series la programme avec Coleeeette et Jamel Zouch de Canal 22.", caption_en: "Domi is a HORS-SOL resident and helped start Réinventer la nuit. At Puebla, Void X Series booked her alongside Coleeeette and Canal 22’s Jamel Zouch.",
    category: "autonomous",
    badge: "DAYTIME Void X Series",
    badgeType: "vxs",
    title: "Void X Series - Buttes-Chaumont",
    artist: "Domi · Coleeeette · Jamel Zouch · Any Yugël · Matescou b2b Gatien Delobel",
    file: "assets/web/event-puebla-shotgun-1400.jpg", thumb: "assets/web/event-puebla-shotgun-480.jpg",
    meta_fr: "Aux Buttes-Chaumont, Void X Series consacre l’après-midi à la minimale, à la micro-house et à l’électro. De 15 h à 1 h, entrée libre avant 16 h 30.<br><br>Visuel : @tristan.chrtr",
    meta_en: "In the Buttes-Chaumont, Void X Series dedicates the afternoon to minimal, micro-house and electro. From 3 pm to 1 am, with free entry before 4:30 pm.<br><br>Artwork : @tristan.chrtr"
  },
  {
    tag: "06.06.25 · FVTVR",
    caption_fr: "Cartulis a commencé par une fête montée par Unai Trotti dans l’est de Londres en 2009. Pour sa cinquième édition, Beyond l’invite avec Void X Series.", caption_en: "Cartulis began as a party Unai Trotti put on in East London in 2009. Beyond and Void X Series invited him for Beyond’s fifth edition.",
    category: "club",
    badge: "Void X Series CURATION",
    badgeType: "vxs",
    title: "Beyond #5 x Void X Series",
    artist: "Unai Trotti (Cartulis / Fold) · IAMBP · Tabescou · Parea b2b Martin",
    file: "assets/web/event-beyond-2025-shotgun-1000.jpg", thumb: "assets/web/event-beyond-2025-shotgun-480.jpg",
    meta_fr: "Pour sa cinquième édition, Beyond s’associe à Void X Series. Unai Trotti (Cartulis) et IAMBP partagent le plateau avec Tabescou et le duo Parea b2b Martin.",
    meta_en: "For its fifth edition, Beyond joins Void X Series. Unai Trotti (Cartulis) and IAMBP share the bill with Tabescou and a back-to-back set from Parea and Martin."
  },
  {
    tag: "11.05.25 · FAWA",
    caption_fr: "Franco Rossi a sorti son premier vinyle, Corellia, chez VOID. L’invitation de Tarab au Fawa prolonge ce lien entre le producteur et le label.", caption_en: "Franco Rossi released his first vinyl record, Corellia, on VOID. Tarab’s invitation to Fawa brought the producer and label together in the booth.",
    category: "autonomous",
    badge: "10H AFTERHOURS",
    badgeType: "void",
    title: "Tarab Invite Void Records",
    artist: "Franco Rossi · Gatien Delobel b2b M-ZR · Bliss b2b Bystander · Lymsa · Orphita",
    file: "assets/web/event-fawa-2025-shotgun-1000.jpg", thumb: "assets/web/event-fawa-2025-shotgun-480.jpg",
    meta_fr: "Tarab invite VOID de 7 h à 17 h. Franco Rossi joue en solo, Gatien Delobel retrouve M-ZR en b2b et Orphée rejoint Roulita sous le nom d’Orphita.",
    meta_en: "Tarab hosts VOID from 7 am to 5 pm. Franco Rossi plays solo, Gatien Delobel goes back to back with M-ZR, and Orphée joins Roulita as Orphita."
  },
  {
    tag: "04.04.25 · FVTVR",
    caption_fr: "Lady Starlight, également partenaire de live de Surgeon, joue ici en solo sur ses machines. D.Dan tient les platines.", caption_en: "Lady Starlight, also known for her live partnership with Surgeon, plays a solo hardware set here. D.Dan takes the decks.",
    category: "club",
    badge: "CLUB & LIVE",
    badgeType: "void",
    title: "FVTVR Invites Void Records",
    artist: "D.Dan · Lady Starlight (Live) · Rkeat · Gatien Delobel",
    file: "assets/web/event-fvtvr-ddan-shotgun-1000.jpg", thumb: "assets/web/event-fvtvr-ddan-shotgun-480.jpg",
    meta_fr: "Plateau club et live hardware de minuit à 07h00 au Quai d'Austerlitz.<br>Visuel & sound design : @tristan.chrtr · Modèle : Colline @oc.mg",
    meta_en: "Club and live hardware showcase from midnight to 07:00 at Quai d'Austerlitz.<br>Visual & sound design : @tristan.chrtr · Model : Colline @oc.mg"
  },
  {
    tag: "13.09.24 · FVTVR",
    caption_fr: "Nastia aux platines, Stef Mendesidis en live. Son album Decima, paru sur Klockworks, donne un point d’entrée dans le travail du producteur.", caption_en: "Nastia on the decks, Stef Mendesidis live. His album Decima on Klockworks is a way into the producer’s work.",
    category: "club",
    badge: "CLUB & LIVE",
    badgeType: "void",
    title: "FVTVR Invites Void Records",
    artist: "Nastia · Stef Mendesidis (Live) · Orphée · M-ZR",
    file: "assets/web/event-fvtvr-nastia-shotgun-1000.jpg", thumb: "assets/web/event-fvtvr-nastia-shotgun-480.jpg",
    meta_fr: "Session techno et live analogique de minuit à 07h00 au FVTVR.<br>Artwork : @tristan.chrtr · Modèle : @matounrv",
    meta_en: "Techno and analog live session from midnight to 07:00 at FVTVR.<br>Artwork : @tristan.chrtr · Model : @matounrv"
  }
];

/* =========================================================================
   3. SORTIES VINYLES & DIGITALES (AJOUT FACILE DE VOS VINYLES VIA isVinyl: true)
   ========================================================================= */
const releases = [
  {
    date: "2026-07-27",
    cat: "VRVA04", type: "void", isVinyl: false, format: "VA · 14 TRACKS",
    title: "Denebola", artist: "Various Artists",
    file: "assets/web/cover-vrva04-1000.jpg", thumb: "assets/web/cover-vrva04-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/denebola-vrva04",
    meta_fr: "Compilation internationale de 14 titres stripped-down & driving techno.<br><br><strong>TRACKLIST :</strong> Adam · Christie · Eniro · Gat SDR · Lly · Lumertz · MRXY · Oppressed Society · Rues · Slany · Slak · Tony MLR · Varju & QV · Yrsen.<br><br>Artwork : @tristan.chrtr",
    meta_en: "14-track international compilation of stripped-down, driving techno.<br><br><strong>TRACKLIST :</strong> Adam · Christie · Eniro · Gat SDR · Lly · Lumertz · MRXY · Oppressed Society · Rues · Slany · Slak · Tony MLR · Varju & QV · Yrsen.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2026-07-02",
    cat: "VOID012", type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Intensity or/and Authenticity ?", artist: "NOXATRA",
    file: "assets/web/cover-void012-1000.jpg", thumb: "assets/web/cover-void012-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/intensity-or-and-authenticity-void012",
    meta_fr: "Trois titres techno, un morceau ambient et un remix.<br><br>Artwork : @tristan.chrtr",
    meta_en: "Three techno cuts, an ambient track and a remix.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2026-04-14",
    cat: "VXS005", audioFile: "assets/vxs005-preview.mp3", spectrum: previewSpectra.vxs005, type: "vxs", isVinyl: false, format: "DIGITAL EP",
    title: "Finding The Way", artist: "Prodot",
    file: "assets/web/cover-vxs005-1000.jpg", thumb: "assets/web/cover-vxs005-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/finding-the-way-vxs005",
    meta_fr: "4 titres du producteur argentin Prodot mêlant racines deep house, textures minimales et phrasé jazz.<br><br>Artwork : @tristan.chrtr",
    meta_en: "4-track EP by Argentinian producer Prodot blending deep house roots, minimal textures, and jazz phrasing.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2026-03-04",
    cat: "VOID011", audioFile: "assets/orbit-preview.mp3", spectrum: previewSpectra.orbit, type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Orbit", artist: "TVNG",
    file: "assets/web/cover-void011-1000.jpg", thumb: "assets/web/cover-void011-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/orbit-void011-2",
    meta_fr: "Cinq titres de TVNG. En écoute ici, un extrait d’Orbit.<br><br><strong>TRACKLIST :</strong> 1. I Know You · 2. Hagen · 3. Orbit · 4. Brik · 5. Semisubtle.<br><br>Artwork : @tristan.chrtr",
    meta_en: "Five tracks by TVNG. Listen to a cut from Orbit here.<br><br><strong>TRACKLIST :</strong> 1. I Know You · 2. Hagen · 3. Orbit · 4. Brik · 5. Semisubtle.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2025-12-26",
    cat: "VXS004", type: "vxs", isVinyl: false, format: "DIGITAL EP",
    title: "ERA", artist: "T!M",
    file: "assets/web/cover-vxs004-1000.jpg", thumb: "assets/web/cover-vxs004-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/era-vxs004",
    meta_fr: "5 titres de minimale sombre, émotionnelle et atmosphérique : Masana, Evidence Tranquille, Screens, Goles, Do You Believe?<br><br>Artwork : @tristan.chrtr",
    meta_en: "5 deeply emotional, dark, and atmospheric minimal tracks: Masana, Evidence Tranquille, Screens, Goles, Do You Believe?<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2025-10-01",
    cat: "VOID010", audioFile: "assets/void010-preview.mp3", spectrum: previewSpectra.void010, type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Discussion Board", artist: "Jiho",
    file: "assets/web/cover-void010-1000.jpg", thumb: "assets/web/cover-void010-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/discussion-board-void010",
    meta_fr: "6 titres signés par le producteur coréen basé à Tokyo Jiho (fondateur de Subhills), incluant un remix de Linear System.<br><br>Artwork : @tristan.chrtr",
    meta_en: "6 tracks by Tokyo-based Korean producer Jiho (founder of Subhills), including a remix by Linear System.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2025-06-25",
    cat: "VOID009", audioFile: "assets/void009-preview.mp3", spectrum: previewSpectra.void009, type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Breath", artist: "Toni BA",
    file: "assets/web/cover-void009-1000.jpg", thumb: "assets/web/cover-void009-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/breath-void009",
    meta_fr: "4 pistes de techno brute et texturée accompagnées des remixes de Franco Rossi et Caniche.<br><br>Artwork : @tristan.chrtr",
    meta_en: "4 tracks of raw, textured hypnotic techno featuring remixes by Franco Rossi and Caniche.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2025-04-14",
    cat: "VOID008", type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Scorpion", artist: "Modēm",
    file: "assets/web/cover-void008-1000.jpg", thumb: "assets/web/cover-void008-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/scorpion-void008",
    meta_fr: "4 titres aux grooves rapides, percussions roulantes et remix signé @ogtrues.<br><br>Artwork : @tristan.chrtr",
    meta_en: "4-tracker featuring fast grooves, rolling drums, and a rework by @ogtrues.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2025-01-29",
    cat: "VXS003", type: "vxs", isVinyl: false, format: "DIGITAL EP",
    title: "Dancing Shoes", artist: "Groove Instant",
    file: "assets/web/cover-vxs003-1000.jpg", thumb: "assets/web/cover-vxs003-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/dancing-shoes-vxs003",
    meta_fr: "7 pistes entre minimalisme subtil, lignes de basse denses et groove rapide.<br><br>Artwork : @tristan.chrtr",
    meta_en: "7 tracks raising subtle minimalism to an energetic groove with dense basslines.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2024-12-18",
    cat: "VOID007", type: "void", isVinyl: false, format: "DIGITAL EP",
    title: "Choices", artist: "E2NMN",
    file: "assets/web/cover-void007-1000.jpg", thumb: "assets/web/cover-void007-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/choices-void007",
    meta_fr: "Tracklist : 1. Melting Every Piece · 2. Turbulencias · 3. Stolen Choices · 4. Senord.<br><br>Artwork : @tristan.chrtr",
    meta_en: "Tracklist : 1. Melting Every Piece · 2. Turbulencias · 3. Stolen Choices · 4. Senord.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2024-08-06",
    cat: "VOID006", type: "void", isVinyl: true, format: "12\" VINYL & DIGITAL",
    title: "Corellia", artist: "Franco Rossi",
    file: "assets/web/cover-void006-full.jpg", thumb: "assets/web/cover-void006-thumb.jpg",
    link: "https://voidrecord.bandcamp.com/album/corellia-void006",
    meta_fr: "Sortie vinyle 12\" et digitale. Techno immersive et mentale incluant un remix de Juri Heidemann.<br><br>Artwork : @tristan.chrtr",
    meta_en: "12\" vinyl and digital release. Immersive, hypnotic techno featuring a remix by Juri Heidemann.<br><br>Artwork : @tristan.chrtr"
  },
  {
    date: "2024-04-29",
    cat: "VRVA03",
    title: "Castula",
    artist: "Various Artists",
    type: "void",
    format: "VA · 9 TRACKS",
    isVinyl: false,
    file: "assets/web/cover-vrva03-1000.jpg",
    thumb: "assets/web/cover-vrva03-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/castula-vrva03",
    meta_fr: "Neuf titres de techno, avec notamment Cheka, Conntex, LLY et West Code.",
    meta_en: "Nine techno tracks featuring Cheka, Conntex, LLY and West Code."
  },
  {
    date: "2024-04-05",
    cat: "",
    title: "Why My Music",
    artist: "Cov’, Matescou & Olo",
    type: "vxs",
    format: "SINGLE",
    isVinyl: false,
    file: "assets/web/cover-why-my-music-1000.jpg",
    thumb: "assets/web/cover-why-my-music-480.jpg",
    link: "https://voidrecord.bandcamp.com/track/why-my-music",
    meta_fr: "Cov’ et Matescou à la production, Olo à la voix.",
    meta_en: "Produced by Cov’ and Matescou, with original vocals by Olo."
  },
  {
    date: "2023-10-09",
    cat: "VXS002", type: "vxs", isVinyl: false, format: "DIGITAL EP",
    title: "Yosuru", artist: "Cov'",
    file: "assets/web/cover-vxs002-full.jpg", thumb: "assets/web/cover-vxs002-thumb.jpg",
    link: "https://voidrecord.bandcamp.com/album/yosuru-vxs002",
    meta_fr: "Cov’ sur Void X Series. Basses profondes et minimale.",
    meta_en: "Cov’ on Void X Series. Deep bass and stripped-back minimal."
  },
  {
    date: "2023-05-17",
    cat: "VXS001", type: "vxs", isVinyl: false, format: "DIGITAL EP",
    title: "Ikigai", artist: "Piero Peviani",
    file: "assets/web/cover-vxs001-full.jpg", thumb: "assets/web/cover-vxs001-thumb.jpg",
    link: "https://voidrecord.bandcamp.com/album/ikigai-vxs001",
    meta_fr: "Piero Peviani signe le premier EP solo de Void X Series.",
    meta_en: "The first solo EP on Void X Series comes from Piero Peviani."
  },
  {
    date: "2023-03-29",
    cat: "VOID005",
    title: "Merging Point",
    artist: "LLY & Ezauf",
    type: "void",
    format: "DIGITAL EP",
    isVinyl: false,
    file: "assets/web/cover-void005-1000.jpg",
    thumb: "assets/web/cover-void005-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/merging-point-void005",
    meta_fr: "Cinq titres signés LLY et Ezauf.",
    meta_en: "Five tracks by LLY and Ezauf."
  },
  {
    date: "2022-04-27",
    cat: "VXSVA01",
    title: "Harajuku",
    artist: "Various Artists",
    type: "vxs",
    format: "VA · 5 TRACKS",
    isVinyl: false,
    file: "assets/web/cover-vxsva01-1000.jpg",
    thumb: "assets/web/cover-vxsva01-480.jpg",
    link: "https://voidrecord.bandcamp.com/album/harajuku-vxsva01",
    meta_fr: "Cinq titres de dltpn_, Ғərqlι, Piero Peviani, Stourm et Flexsa.",
    meta_en: "Five tracks from dltpn_, Ғərqlι, Piero Peviani, Stourm and Flexsa."
  }
].sort((a, b) => b.date.localeCompare(a.date));

/* =========================================================================
   4. PODCASTS : UNIQUEMENT LES 3 SÉLECTIONS PHARES (1 VR, 1 Void X Series, 1 LIVE CP)
   ========================================================================= */
const featuredPodcasts = [
  {
    tag: "VR PODCAST 041", cardClass: "", title: "Nesa Azadikhah",
    desc_fr: "Le mix de Nesa Azadikhah pour le 41e épisode de la série Void Records.",
    desc_en: "Nesa Azadikhah in the mix for episode 41 of the Void Records series.",
    scUrl: "https://soundcloud.com/voidrecords0/podcast041-nesa-azadikhah?in=voidrecords0/sets/podcasts"
  },
  {
    tag: "Void X Series PODCAST 019 · MINIMAL & ELECTRO",
    cardClass: "vxs-card",
    title: "Any Yugël (Void X Series)",
    desc_fr: "Any Yugël passe de la micro-house à l’électro progressive pour Void X Series.",
    desc_en: "Any Yugël moves from micro-house into progressive electro for Void X Series.",
    scUrl: "https://soundcloud.com/voidrecords0/any-yugel-4-void-x-series-3"
  },
  {
    tag: "Void X Series PODCAST 022 · LIVE FESTIVAL ARCHIVE",
    cardClass: "live-card",
    festivalLive: true,
    title: "Ramona Yacef - Château Perché 2025",
    desc_fr: "Enregistré en direct lors de notre curation de 19 heures sur la scène La Grande Muraille au Festival Château Perché 2025.",
    desc_en: "Recorded live during our 19-hour stage curation on La Grande Muraille at Château Perché Festival 2025.",
    scUrl: "https://soundcloud.com/voidrecords0/vxs-podcast022-ramona-yacef-chateau-perche-festival-2025"
  }
];

/* =========================================================================
   5. ROSTER (ORDRE ET AFFILIATIONS DEMANDÉS, MOWTENG EN DERNIER)
   ========================================================================= */
const roster = [
  {
    name: "Gatien Delobel",
    role: "Co-founder · Resident DJ · Void Records", role_fr: "Cofondateur · DJ résident · Void Records",
    branch: "VOID",
    file: "assets/web/artist-gatien-delobel-1000.jpg", thumb: "assets/web/artist-gatien-delobel-480.jpg",
    bio_fr: "Gatien commence sa collection de disques en 2016, puis cofonde VOID à Paris en 2017. Dans son sac, de la techno organique, de la minimale et de la micro-house. Il a partagé les platines avec Lady Starlight, D.Dan, Tasha, Domi et Olga Korol.",
    bio_en: "Gatien started collecting in 2016 and co-founded VOID in Paris in 2017. His record bag spans organic techno, minimal and micro-house. He’s shared booths with Lady Starlight, D.Dan, Tasha, Domi and Olga Korol.",
    influences: "", albumTitle: "", albumUrl: "", setTitle: "", setUrl: ""
  },
  {
    name: "M-ZR",
    role: "Co-founder · Resident DJ · Void Records", role_fr: "Cofondateur · DJ résident · Void Records",
    branch: "VOID",
    file: "assets/web/artist-m-zr-1000.jpg", thumb: "assets/web/artist-m-zr-480.jpg",
    bio_fr: "DJ parisien et cofondateur de VOID en 2017, M-ZR joue en free party, en warehouse et en club. Ses sets passent de la techno hypnotique au hardgroove, avec un faible pour les rythmes tribaux.",
    bio_en: "Paris DJ and VOID co-founder since 2017. From free parties to warehouses and clubs, M-ZR plays hypnotic techno and hardgroove with a taste for tribal rhythms.",
    influences: "", albumTitle: "", albumUrl: "", setTitle: "", setUrl: ""
  },
  {
    name: "Orphée",
    role: "Resident DJ · Void Records", role_fr: "DJ résident · Void Records",
    branch: "VOID",
    file: "assets/web/artist-orphee-1000.jpg", thumb: "assets/web/artist-orphee-480.jpg",
    bio_fr: "", bio_en: "",
    influences: "", albumTitle: "", albumUrl: "",
    setTitle: "VR Podcast 036 (Vinyl Only)",
    setUrl: "https://soundcloud.com/voidrecords0/podcast036-orphee-vinyl-only"
  },
  {
    name: "Any Yugël",
    role: "Resident DJ · Void X Series", role_fr: "DJ résidente · Void X Series",
    branch: "VXS",
    file: "assets/web/artist-any-yugel-1000.jpg", thumb: "assets/web/artist-any-yugel-480.jpg",
    bio_fr: "Résidente de Void X Series, Any Yugël joue aussi sur La Face B à Montréal et avec le collectif Ryugu. Dans ses sets, la minimale et l’électro croisent la progressive house et la trance. On la retrouve chez Radio Sofa, 39 Records, Gimic et Rinse.",
    bio_en: "A Void X Series resident, Any Yugël also plays on Montreal’s La Face B and with Ryugu. Her sets move between minimal, electro, progressive house and trance. Hear her on Radio Sofa, 39 Records, Gimic and Rinse.",
    influences: "Per Hammar, Luna Ludmila, Sugar Free, Pancratio, Jay Tripwire, DJ Sweet6teen",
    albumTitle: "", albumUrl: "",
    setTitle: "Any Yugël - Void X Series #3",
    setUrl: "https://soundcloud.com/voidrecords0/any-yugel-4-void-x-series-3?in=anyyugel/sets/podcast"
  },
  {
    name: "C.LYYA",
    role: "Resident DJ · Producer · Void X Series", role_fr: "DJ résidente · Production · Void X Series",
    branch: "VXS",
    file: "assets/web/artist-cllya-1000.jpg", thumb: "assets/web/artist-cllya-480.jpg",
    bio_fr: "", bio_en: "",
    influences: "", albumTitle: "", albumUrl: "",
    setTitle: "Void X Series Podcast 008",
    setUrl: ""
  },
  {
    name: "Tabet",
    role: "Resident DJ · Void X Series", role_fr: "DJ résident · Void X Series",
    branch: "VXS",
    file: "assets/web/artist-tabet-1000.jpg", thumb: "assets/web/artist-tabet-480.jpg",
    bio_fr: "", bio_en: "",
    influences: "", albumTitle: "", albumUrl: "", setTitle: "", setUrl: ""
  },
  {
    name: "Mowteng",
    role: "Resident DJ · Void Records", role_fr: "DJ résident · Void Records",
    branch: "VOID",
    file: "assets/web/artist-mowteng-1000.jpg", thumb: "assets/web/artist-mowteng-480.jpg",
    bio_fr: "Mowteng rejoint VOID en 2024. Quinze ans de sélection entre ambient, techno et sons organiques, avec un goût pour les atmosphères inspirées de la nature et de la littérature.",
    bio_en: "Mowteng joined VOID in 2024. Fifteen years of selecting ambient, techno and organic sounds, drawing on landscapes and literature.",
    influences: "DJrum, Donato Dozzy, Feral, Dorisburg, Chewlie, Jane Fitz, Dream Dolphin, Voiski, Carre",
    albumTitle: "Djrum - Portrait With Firewood (Waters Rising)",
    albumUrl: "https://www.youtube.com/watch?v=PzryN33ADCk&list=PLK5_UnXAc9t8mbjwfvWB2wmkZxxurKSfi&index=2",
    setTitle: "CLVBS Podcast - LuriaLeMess",
    setUrl: "https://soundcloud.com/mowteng/clvbs-podcast-lurialemess?in=mowteng/sets/podcast"
  }
];

/* =========================================================================
   6. GALERIE CARROUSEL (PRÊTE POUR TES PHOTOS DANS ASSETS/)
   Indiquer le chemin des photos disponibles dans file.
   ========================================================================= */
const galleryItems = [
  { file: "", // assets/gallery-01.jpg
     title_fr: "Château Perché - Scène La Grande Muraille", title_en: "Château Perché - La Grande Muraille Stage", tag: "FESTIVAL CURATION · 19H" },
  { file: "", // assets/gallery-02.jpg
     title_fr: "La Rotonde XXL - Mapping 360° & Scénographie", title_en: "La Rotonde XXL - 360° Mapping & Scenography", tag: "ILUMA VISUAL & SONO DESIGN" },
  { file: "", // assets/gallery-03.jpg
     title_fr: "FVTVR - Void Records Invites", title_en: "FVTVR - Void Records Invites", tag: "CLUB & LIVE SESSION" },
  { file: "", // assets/gallery-04.jpg
     title_fr: "Virage - Sous le périphérique", title_en: "Virage - Ring Road Open Air", tag: "VOID X TRIKAR" },
  { file: "", // assets/gallery-05.jpg
     title_fr: "Format autonome « Signal »", title_en: "Autonomous « Signal » Series", tag: "SOUND SYSTEM & MAPPING" },
  { file: "", // assets/gallery-06.jpg
     title_fr: "Belvédère de Belleville & Pavillon Puebla", title_en: "Belvédère de Belleville & Pavillon Puebla", tag: "DAYTIME & OPEN AIR" }
];

// Fiches Shotgun sans mention d’annulation. Les dates hors billetterie figurent séparément.
const shotgunArchive = [
  ["2026-11-14", "Void X Series invites Minube · Babour Sauvage"],
  ["2026-09-04", "Void X Series invites Sisteuf & Tout Feu Tout Femme"],
  ["2025-12-06", "Void X Series invites Domi, Coleeeette & Jamel Zouch"],
  ["2025-11-01", "VOID · Andy Martin, Justine Perry & Paula Koski"],
  ["2025-10-03", "Au Fil du Son × Void Records × Toilettes Mixtes"],
  ["2025-09-19", "VOID × Trikar · Laure Croft, Voiski & Tasha"],
  ["2025-07-02", "Void X Series · Mowteng, Any Yugël & Gatien Delobel"],
  ["2025-06-06", "Beyond × Void X Series · Unai Trotti, IAMBP, Parea, Martin & Tabescou"],
  ["2025-05-11", "Tarab invites Void Records · Fawa"],
  ["2025-04-04", "VOID · D.Dan, Lady Starlight, Rkeat & Gatien Delobel"],
  ["2024-11-02", "Rotonde XXL · Void X Series invites Attechtion Please"],
  ["2024-09-13", "VOID · Nastia, Stef Mendesidis (live), Orphée & M-ZR"],
  ["2024-08-23", "Wonderland · Club des Cinq, Maxi Open Air"],
  ["2024-05-18", "Rotonde XXL · Olga Korol & friends"],
  ["2024-04-19", "Signal III · Keut & Aérienne"],
  ["2024-04-11", "Void X Series · Jess, Gouzou b2b Mezzer & Mayou Picchu"],
  ["2024-02-16", "Attrape Rave · 3 scènes"],
  ["2023-11-18", "Void X Series · Godsoul Records, Angie & Italoplatines"],
  ["2023-10-28", "Evolove × VOID · Guru"],
  ["2023-10-18", "Void X Series · Vitaline & Soulagru"],
  ["2023-10-13", "Signal II"],
  ["2023-09-14", "Void X Series · Mycelium Shroom Syndicate"],
  ["2023-07-01", "Void X Series · Suteji"],
  ["2023-06-17", "Void X Series · Soupe Machine, Latine & Nipraa"],
  ["2023-05-25", "Void X Series · The Critical Path, Piero Peviani, Daphicha & T!M"],
  ["2023-03-29", "Void X Series · La Fessée Musicale, Any Yugël & Tishka"],
  ["2023-02-24", "Signal · Kyosei (live), TASSERY & MSKD (live)"],
  ["2022-11-26", "Carte blanche · Void Records au 6b"],
  ["2021-07-25", "Carte blanche · Pisica, Nobrac & friends"],
  ["2020-10-03", "Carte blanche · Nobrac, SAAR, HLE & friends"],
  ["2020-06-18", "M-ZR, Valë, Orphée & DELOB · Paris"],
  ["2019-05-31", "Abyssal #2 · Pawlowski & Draugr"],
  ["2019-01-12", "Abyssal · NTBR, Køzløv & Vertuøze"],
];
