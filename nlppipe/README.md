# Setup
- Minimal requirements: 8GB RAM, 4 CPUs
- Install docker, docker-compose
- Change to `nlppipe` directory (all commands should be issued from this directory)
- Start services: `docker-compose up -d`
- API entrypoint: `0.0.0.0:9500` (can be changed in `docker-compose.yml`)
- Monitor usage: `watch 'docker stats --no-stream --format "table {{.Name}}\t{{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | sort -k 3 -h'`

Scalability is limited because of docker networking and waterfall processing. Best performance can be achieved by 
consuming API with >8 threads and scaling up ner and parser containers: 
`docker-compose up -d --scale api=1 --scale morpho=1 --scale parser=2 --scale ner=2`

Better concurrency can be achieved by running multiple instances of docker-compose and using load balancer in front of it.

# Components:
- proxy - load balancer
- api - API with frontend included
- morpho - tokenizer and morphology
- parser - Universal Dependency parser
- ner - named entity recognition

# API
Data is exchanged in JSON format. Header Content-Type: application/json must be specified for all POST requests, POST body data is json.

## POST /api/nlp
Available processing steps: `tokenizer` | `morpho` | `parser` | `ner`

Request object:
```json
{
  "steps": ["<processing step 1>", ...],
  "data": { 
    "text": "<document text>"
  }
}
```

Response fields by processing steps:
| Step | JSON Path | Description |
| -- | -- | -- |
| tokenizer | data.sentences[].tokens[].index | Word index in each new sentence starting at 1 |
| tokenizer | data.sentences[].tokens[].form | Word form |
| morpho | data.sentences[].tokens[].lemma | Lemma of word form |
| morpho | data.sentences[].tokens[].pos | POS tag |
| morpho | data.sentences[].tokens[].tag | Full morphological tag |
| morpho | data.sentences[].tokens[].features | List of morphological features |
| parser | data.sentences[].tokens[].upos | Universal part-of-speech tag |
| parser | data.sentences[].tokens[].ufeats | UD morphological features |
| parser | data.sentences[].tokens[].parent | Head of the current word or zero |
| parser | data.sentences[].tokens[].deprel | UD relation to the HEAD (root iff HEAD = 0) |
| ner | data.sentences[].ner[].label | Named entity label |
| ner | data.sentences[].ner[].text | Named entity text |
| ner | data.sentences[].ner[].start | Index of the first word form in NE |
| ner | data.sentences[].ner[].end | Index of the last word form in NE |

# Example usage
```bash
curl -XPOST http://0.0.0.0:9500/api/nlp -H 'Content-Type: application/json' -d '{"steps": ["morpho", "ner", "parser"], "data": {"text": "Latvijas prezidents Egils Levits."}}'
```

```json
{
  "data": {
    "sentences": [
      {
        "ner": [
          {
            "end": 1,
            "label": "GPE",
            "sentence_idx": 0,
            "start": 0,
            "text": "Latvijas"
          },
          {
            "end": 4,
            "label": "person",
            "sentence_idx": 0,
            "start": 2,
            "text": "Egils Levits"
          }
        ],
        "tokens": [
          {
            "deprel": "nmod",
            "features": "Īpašvārda_veids=Vietvārds|Skaitlis=Vienskaitlis|Vārds=Latvijas|Leksēmas_nr=1102468|Lietvārda_tips=Īpašvārds|Atstarpes_pirms=|Pamatforma=Latvija|Galotnes_nr=76|Avots=wiki|Nobīde_rindkopā=0|Vārdšķira=Lietvārds|Mija=0|Minēšana=Nav|Lielo_burtu_lietojums=Sākas_ar_lielo_burtu|Locījums=Ģenitīvs|Dzimte=Sieviešu|Vārdgrupas_nr=7|Deklinācija=4|",
            "form": "Latvijas",
            "index": 1,
            "lemma": "Latvija",
            "parent": 2,
            "pos": "npfsg_",
            "tag": "npfsg4",
            "ufeats": "Case=Gen|Gender=Fem|Number=Sing",
            "upos": "PROPN"
          },
          {
            "deprel": "nmod",
            "features": "Skaitlis=Vienskaitlis|Šķirkļa_ID=259267|Vārds=prezidents|Šķirkļa_cilvēklasāmais_ID=prezidents:1|Leksēmas_nr=268997|Atstarpes_pirms=_|Pamatforma=prezidents|FreeText=-a,_v.|Galotnes_nr=1|Nobīde_rindkopā=9|Vārdšķira=Lietvārds|Mija=0|Minēšana=Nav|Locījums=Nominatīvs|Dzimte=Vīriešu|Vārdgrupas_nr=1|Deklinācija=1|",
            "form": "prezidents",
            "index": 2,
            "lemma": "prezidents",
            "parent": 3,
            "pos": "ncmsn_",
            "tag": "ncmsn1",
            "ufeats": "Case=Nom|Gender=Masc|Number=Sing",
            "upos": "NOUN"
          },
          {
            "deprel": "root",
            "features": "Īpašvārda_veids=Priekšvārds|Skaitlis=Vienskaitlis|Vārds=Egils|Leksēmas_nr=1033681|Skaits=1643|Lietvārda_tips=Īpašvārds|Atstarpes_pirms=_|Pamatforma=Egils|Galotnes_nr=1|Avots=VVC_paplašinātais_vārdadienu_saraksts_2014-10-31|Nobīde_rindkopā=20|Vārdšķira=Lietvārds|Mija=0|Minēšana=Nav|Lielo_burtu_lietojums=Sākas_ar_lielo_burtu|Locījums=Nominatīvs|Dzimte=Vīriešu|Vārdgrupas_nr=1|Deklinācija=1|",
            "form": "Egils",
            "index": 3,
            "lemma": "Egils",
            "parent": 0,
            "pos": "npmsn_",
            "tag": "npmsn1",
            "ufeats": "Case=Nom|Gender=Masc|Number=Sing",
            "upos": "PROPN"
          },
          {
            "deprel": "flat:name",
            "features": "Skaitlis=Vienskaitlis|Vārds=Levits|Atstarpes_pirms=_|Pamatforma=Levits|Galotnes_nr=1|Avots=minējums_pēc_galotnes|Nobīde_rindkopā=26|Vārdšķira=Lietvārds|Mija=0|Minēšana=Minēšana_pēc_galotnes|Lielo_burtu_lietojums=Sākas_ar_lielo_burtu|Locījums=Nominatīvs|Dzimte=Vīriešu|Vārdgrupas_nr=1|Deklinācija=1|",
            "form": "Levits",
            "index": 4,
            "lemma": "Levits",
            "parent": 3,
            "pos": "npmsn_",
            "tag": "ncmsn1",
            "ufeats": "Case=Nom|Gender=Masc|Number=Sing",
            "upos": "NOUN"
          },
          {
            "deprel": "punct",
            "features": "Galotnes_nr=2092|Vārds=.|Nobīde_rindkopā=32|Vārdšķira=Pieturzīme|Pieturzīmes_tips=Punkts|Mija=0|Minēšana=Nav|Vārdgrupas_nr=37|Leksēmas_nr=1101369|Atstarpes_pirms=|Pamatforma=.|",
            "form": ".",
            "index": 5,
            "lemma": ".",
            "parent": 3,
            "pos": "zs",
            "tag": "zs",
            "ufeats": "_",
            "upos": "PUNCT"
          }
        ]
      }
    ],
    "text": "Latvijas prezidents Egils Levits."
  }
}
```

# Cleanup
- `docker-compose down`
- `docker system prune -a`
