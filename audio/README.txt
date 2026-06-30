THUNDER FOCUS — cartella "audio/"
==================================

Il Suono pausa "Musica" legge i brani da un indice: audio/manifest.js (+ manifest.json).
Il browser non può elencare una cartella da solo, quindi l'indice va (ri)generato.

AGGIUNGERE / AGGIORNARE I BRANI
-------------------------------
1. Metti i file .mp3 (royalty-free, uso commerciale) in questa cartella audio/.
   Nomi liberi. Fonte consigliata: https://pixabay.com/music/
2. Rigenera l'indice:
       cd C:\Users\Usuario\PomodoroTimer\audio
       node build-manifest.cjs
   Crea manifest.json + manifest.js leggendo i tag interni (titolo/genere) via ffprobe;
   se i tag mancano (tipico Pixabay), titolo e genere vengono ricavati dal NOME FILE.
3. PWA: commit + push (incluso audio/). App Android: copia gli mp3 + manifest in
   ThunderFocus\www\audio\ e rifai il build dell'AAB.

GENERI
------
Ricavati per parola chiave nel nome: jazz / rock / rap (hip-hop) / lofi (chill/ambient/instrumental) / other.
Per correggere un genere: apri manifest.json, cambia il campo "genre" del brano, poi
copia lo stesso valore anche in manifest.js (oppure ri-lancia build-manifest dopo aver
rinominato il file). I generi mostrati sono solo quelli realmente presenti.

LICENZA (compliance Thunder Trader)
-----------------------------------
SOLO tracce royalty-free per uso commerciale (Pixabay Content License, CC0, ecc.).
Niente brani protetti / da streaming. Conserva fonte e licenza.

NOTE
----
- Loop/shuffle automatici durante la pausa; volume = slider "Volume" del Suono pausa.
- Funziona anche aprendo index.html in locale (file://) grazie a manifest.js.
- Peso: tante tracce full pesano. Per l'app Android conviene comprimerle (~128 kbps).
