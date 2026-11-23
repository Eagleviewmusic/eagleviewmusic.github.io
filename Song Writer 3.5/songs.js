const PRELOADED_SONGS = {
    'new-song': `[Key of C]
[A]
Start[D1] Here[D1]`,
    /* 2026-11-22 (bug report L30): with their rhythm — as blocks, Notation
       made every note a quarter, so "star" and "are" were not held and
       "How" ended Twinkle's first row. Their old texts are kept in
       library.js RETIRED_DEFAULTS, so an untouched old copy is given these. */
    'twinkle': `[Key of C]
[A]
Twin[D1:q] kle,[D1:q] twin[S1:q] kle,[S1:q] lit[L1:q] tle[L1:q] star[S1:h] How[F1:q] I[F1:q] won[M1:q] der[M1:q] what[R1:q] you[R1:q] are[D1:h]
[B]
Up[S1:q] a-[S1:q] bove[F1:q] the[F1:q] world[M1:q] so[M1:q] high,[R1:h] Like[S1:q] a[S1:q] dia-[F1:q] mond[F1:q] in[M1:q] the[M1:q] sky.[R1:h]
[A]
Twin[D1:q] kle,[D1:q] twin[S1:q] kle,[S1:q] lit[L1:q] tle[L1:q] star,[S1:h] How[F1:q] I[F1:q] won[M1:q] der[M1:q] what[R1:q] you[R1:q] are.[D1:h]`,
    'mary': `[Key of C]
[A]
Ma[M1:q] ry[R1:q] had[D1:q] a[R1:q] lit[M1:q] tle[M1:q] lamb,[M1:h] lit[R1:q] tle[R1:q] lamb,[R1:h] lit[M1:q] tle[S1:q] lamb.[S1:h]
[B]
Ma[M1:q] ry[R1:q] had[D1:q] a[R1:q] lit[M1:q] tle[M1:q] lamb,[M1:q] its[M1:q] fleece[R1:q] was[R1:q] white[M1:q] as[R1:q] snow.[D1:w]`
};

/* A built-in with more than the text format can hold (a Chord Chart and a
   chord track) is its whole score here: the same JSON as `score` in a song
   backup (JSON-FORMAT.md §2). js/library.js defaultRecord() looks here first.
   2026-11-08 the Star Spangled Banner, from the user's own 3.5 copy. */
const PRELOADED_SCORES = {
  'starspangledbanner': {
    "v": 2,
    "key": "Ab",
    "scale": "major",
    "board": {},
    "meter": "3/4",
    "bpm": 100,
    "lines": [
      {
        "label": "A1",
        "pickup": "q",
        "syllables": [
          {"text":"Oh","cols":[{"notes":[{"n":"so"}],"v":"e."}]},
          {"text":"-","cols":[{"notes":[{"n":"mi"}],"v":"s"}]},
          {"text":"say","cols":[{"notes":[{"n":"do"}],"v":"q"}]},
          {"text":"can","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"you","cols":[{"notes":[{"n":"so"}],"v":"q"}]},
          {"text":"see","cols":[{"notes":[{"n":"do-high"}],"v":"h"}]},
          {"text":"By","cols":[{"notes":[{"n":"mi-high"}],"v":"e."}]},
          {"text":"the","cols":[{"notes":[{"n":"re-high"}],"v":"s"}]},
          {"text":"dawn's","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"ear-","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"-ly","cols":[{"notes":[{"n":"fa","acc":"sharp"}],"v":"q"}]},
          {"text":"light?","cols":[{"notes":[{"n":"so"}],"v":"h"}]},
          {"text":"What","cols":[{"notes":[{"n":"so"}],"v":"e"}]},
          {"text":"so","cols":[{"notes":[{"n":"so"}],"v":"e"}]},
          {"text":"proud-","cols":[{"notes":[{"n":"mi-high"}],"v":"q."}]},
          {"text":"-ly","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"we","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"hailed","cols":[{"notes":[{"n":"ti"}],"v":"h"}]},
          {"text":"At","cols":[{"notes":[{"n":"la"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"ti"}],"v":"e"}]},
          {"text":"twi-","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"lights","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"last","cols":[{"notes":[{"n":"so"}],"v":"q"}]},
          {"text":"gleam-","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"ing","cols":[{"notes":[{"n":"do"}],"v":"q"}]},
          {"text":"Whose","cols":[{"notes":[{"n":"so"}],"v":"e."}]},
          {"text":"broad","cols":[{"notes":[{"n":"mi"}],"v":"s"}]},
          {"text":"stripes","cols":[{"notes":[{"n":"do"}],"v":"q"}]},
          {"text":"and","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"bright","cols":[{"notes":[{"n":"so"}],"v":"q"}]},
          {"text":"stars","cols":[{"notes":[{"n":"do-high"}],"v":"h"}]},
          {"text":"Through","cols":[{"notes":[{"n":"mi-high"}],"v":"e."}]},
          {"text":"the","cols":[{"notes":[{"n":"re-high"}],"v":"s"}]},
          {"text":"pe-","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"-ril-","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"-ous","cols":[{"notes":[{"n":"fa","acc":"sharp"}],"v":"q"}]},
          {"text":"fight","cols":[{"notes":[{"n":"so"}],"v":"h"}]},
          {"text":"O'er","cols":[{"notes":[{"n":"so"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"so"}],"v":"e"}]},
          {"text":"ram-","cols":[{"notes":[{"n":"mi-high"}],"v":"q."}]},
          {"text":"-parts","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"we","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"watched,","cols":[{"notes":[{"n":"ti"}],"v":"h"}]},
          {"text":"Were","cols":[{"notes":[{"n":"la"}],"v":"e"}]},
          {"text":"so","cols":[{"notes":[{"n":"ti"}],"v":"e"}]},
          {"text":"gal-","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"-lant-","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"-ly","cols":[{"notes":[{"n":"so"}],"v":"q"}]},
          {"text":"stream-","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"-ing","cols":[{"notes":[{"n":"do"}],"v":"q"}]},
          {"text":"And","cols":[{"notes":[{"n":"mi-high"}],"v":"e."}]},
          {"text":"the","cols":[{"notes":[{"n":"mi-high"}],"v":"s"}]},
          {"text":"roc-","cols":[{"notes":[{"n":"mi-high"}],"v":"q"}]},
          {"text":"-kets","cols":[{"notes":[{"n":"fa-high"}],"v":"q"}]},
          {"text":"red","cols":[{"notes":[{"n":"so-high"}],"v":"q"}]},
          {"text":"glare","cols":[{"notes":[{"n":"so-high"}],"v":"h"}]},
          {"text":"The","cols":[{"notes":[{"n":"fa-high"}],"v":"e"}]},
          {"text":"bombs","cols":[{"notes":[{"n":"mi-high"}],"v":"e"}]},
          {"text":"burst-","cols":[{"notes":[{"n":"re-high"}],"v":"q"}]},
          {"text":"-ing","cols":[{"notes":[{"n":"mi-high"}],"v":"q"}]},
          {"text":"in","cols":[{"notes":[{"n":"fa-high"}],"v":"q"}]},
          {"text":"air","cols":[{"notes":[{"n":"fa-high"}],"v":"h"}]},
          {"text":"Gave","cols":[{"notes":[{"n":"fa-high"}],"v":"q"}]},
          {"text":"proof","cols":[{"notes":[{"n":"mi-high"}],"v":"q."}]},
          {"text":"through","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"night","cols":[{"notes":[{"n":"ti"}],"v":"h"}]},
          {"text":"That","cols":[{"notes":[{"n":"la"}],"v":"e"}]},
          {"text":"our","cols":[{"notes":[{"n":"ti"}],"v":"e"}]},
          {"text":"flag","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"was","cols":[{"notes":[{"n":"mi"}],"v":"q"}]},
          {"text":"still","cols":[{"notes":[{"n":"fa","acc":"sharp"}],"v":"q"}]},
          {"text":"there","cols":[{"notes":[{"n":"so"}],"v":"h"}]},
          {"text":"Oh,","cols":[{"notes":[{"n":"so"}],"v":"q"}]},
          {"text":"say,","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"does","cols":[{"notes":[{"n":"do-high"}],"v":"q"}]},
          {"text":"that","cols":[{"notes":[{"n":"do-high"}],"v":"e"}]},
          {"text":"-","cols":[{"notes":[{"n":"ti"}],"v":"e"}]},
          {"text":"Star","cols":[{"notes":[{"n":"la"}],"v":"q"}]},
          {"text":"Span-","cols":[{"notes":[{"n":"la"}],"v":"q"}]},
          {"text":"-gled","cols":[{"notes":[{"n":"la"}],"v":"q"}]},
          {"text":"Ban-","cols":[{"notes":[{"n":"re-high"}],"v":"q"}]},
          {"text":"-ner__","cols":[{"notes":[{"n":"fa-high"}],"v":"e"}]},
          {"text":"___","cols":[{"notes":[{"n":"mi-high"}],"v":"e"}]},
          {"text":"yet","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"-","cols":[{"notes":[{"n":"do-high"}],"v":"e"}]},
          {"text":"wave?","cols":[{"notes":[{"n":"do-high"}],"v":"h."}]},
          {"text":"___","cols":[{"notes":[{"n":"ti"}],"v":"h"}]},
          {"text":"O'er","cols":[{"notes":[{"n":"so"}],"v":"e."}]},
          {"text":"the","cols":[{"notes":[{"n":"so"}],"v":"s"}]},
          {"text":"land","cols":[{"notes":[{"n":"do-high"}],"v":"q."}]},
          {"text":"-","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"of","cols":[{"notes":[{"n":"mi-high"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"fa-high"}],"v":"e"}]},
          {"text":"free","cols":[{"notes":[{"n":"so-high"}],"v":"h"}]},
          {"text":"And","cols":[{"notes":[{"n":"do-high"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"re-high"}],"v":"e"}]},
          {"text":"home","cols":[{"notes":[{"n":"mi-high"}],"v":"q."}]},
          {"text":"of","cols":[{"notes":[{"n":"fa-high"}],"v":"e"}]},
          {"text":"the","cols":[{"notes":[{"n":"re-high"}],"v":"q"}]},
          {"text":"brave?","cols":[{"notes":[{"n":"do-high"}],"v":"h"}]}
        ]
      }
    ],
    "chart": [
      {"id":"k1","chord":"I","place":"f","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k2","chord":"vi","place":"a","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k3","chord":"III","place":"q","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k4","chord":"II","place":"e","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k5","chord":"V","place":"d","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k6","chord":"IV","place":"s","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k7","chord":"ii","place":"g","rhythm":"e e e e e e","arp":"alberti","by":"e"},
      {"id":"k8","chord":"iii","place":"r","rhythm":"e e e e e e","arp":"alberti","by":"e"}
    ],
    "track": [
      {
        "from": 1,
        "to": 33,
        "chords": [
          {"chord":"I","place":"f","k":"k1","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"III","place":"q","k":"k3","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"II","place":"e","k":"k4","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"IV","place":"s","k":"k6","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":5,"rhythm":"e e e e e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"III","place":"q","k":"k3","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"II","place":"e","k":"k4","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"IV","place":"s","k":"k6","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":6,"rhythm":"e e e e e e e e e e e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":6,"rhythm":"e e e e e e e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":6,"rhythm":"e e e e e e e e e e e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"II","place":"e","k":"k4","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"ii","place":"g","k":"k7","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"ii","place":"g","k":"k7","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":3,"rhythm":"e e e e e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"vi","place":"a","k":"k2","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"iii","place":"r","k":"k8","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"iii","place":"r","k":"k8","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":2,"rhythm":"e e e e","arp":"alberti"},
          {"chord":"V","place":"d","k":"k5","beats":1,"rhythm":"e e","arp":"alberti"},
          {"chord":"I","place":"f","k":"k1","beats":3,"rhythm":"e e e e e e","arp":"alberti"}
        ]
      }
    ]
  }
};
