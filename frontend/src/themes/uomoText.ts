// Breve storia dell'uomo, scritta apposta per il tema "uomo": ogni "uomo" viene evidenziato in rosso.

export const UOMO_TEXT = [
  "Circa trecentomila anni fa in Africa compare l'Homo sapiens, l'uomo sapiente. Prima di lui l'uomo di Neanderthal abitava l'Europa: era un uomo robusto, seppelliva i morti e usava il fuoco. Per decine di migliaia di anni l'uomo vive di caccia e raccolta, e l'uomo del Paleolitico dipinge bisonti e cavalli nelle grotte di Lascaux e di Altamira.",
  "Con la rivoluzione neolitica, diecimila anni fa nella Mezzaluna Fertile, l'uomo impara a coltivare grano e orzo e ad allevare capre e pecore. L'uomo diventa sedentario: nascono i villaggi, la ceramica, la tessitura. Accanto ai fiumi Tigri ed Eufrate l'uomo fonda le prime città e i Sumeri inventano la scrittura cuneiforme.",
  "In Egitto il faraone era considerato un dio fatto uomo. Lungo il Nilo l'uomo costruisce le piramidi di Giza, e ogni uomo, dal contadino allo scriba, sperava di superare il giudizio di Osiride. A Babilonia il re Hammurabi incide su una stele di basalto il codice che stabilisce i diritti di ogni uomo libero.",
  "Nella Grecia classica il filosofo Protagora afferma che l'uomo è misura di tutte le cose. Ad Atene nasce la democrazia, ma votava soltanto l'uomo adulto con la cittadinanza. Socrate interroga ogni uomo che incontra nell'agorà, e Aristotele definisce l'uomo un animale politico, fatto per vivere nella polis.",
  "Roma passa da monarchia a repubblica e infine a impero. Cesare è l'uomo che attraversa il Rubicone nel 49 avanti Cristo; Augusto è l'uomo che inaugura la pax romana. L'uomo romano costruisce strade, acquedotti e anfiteatri, e il diritto romano regola la vita di ogni uomo dalla Britannia all'Egitto.",
  "Nel Medioevo la società è divisa tra chi prega, chi combatte e chi lavora. Il servo della gleba è un uomo legato alla terra del signore feudale, e ogni uomo d'arme giura fedeltà al proprio sovrano. Nei monasteri benedettini l'uomo copia i codici antichi, salvando i testi degli autori latini.",
  "Con l'Umanesimo l'uomo torna al centro del mondo. Pico della Mirandola scrive l'Orazione sulla dignità dell'uomo, e Leonardo da Vinci disegna l'uomo vitruviano inscritto nel cerchio e nel quadrato. Il Rinascimento celebra l'uomo universale, capace di essere pittore, ingegnere e scienziato insieme.",
  "Nel 1492 Cristoforo Colombo, un uomo di Genova al servizio della Spagna, raggiunge le Americhe. Galileo Galilei, l'uomo che punta il cannocchiale verso il cielo, dimostra che la Terra non è al centro dell'universo, e l'uomo moderno impara a fidarsi dell'esperimento più che dell'autorità.",
  "Nel 1789 l'Assemblea nazionale francese approva la Dichiarazione dei diritti dell'uomo e del cittadino: ogni uomo nasce libero e uguale nei diritti. Napoleone, l'uomo che si incorona imperatore nel 1804, porta il codice civile in mezza Europa. Durante la rivoluzione industriale l'uomo affianca la macchina a vapore al lavoro delle braccia.",
  "Nel Novecento l'uomo vive due guerre mondiali. Nel 1948 le Nazioni Unite proclamano la Dichiarazione universale dei diritti umani, perché nessun uomo sia più privato della propria dignità. Il 20 luglio 1969 Neil Armstrong scende sulla Luna: è un piccolo passo per un uomo, ma un balzo da gigante per l'umanità.",
];

/** Il testo spezzato in pezzi: i pari sono testo normale, i dispari sono le occorrenze di "uomo". */
export function splitUomo(paragraph: string): string[] {
  return paragraph.split(/\b(uomo)\b/i);
}
