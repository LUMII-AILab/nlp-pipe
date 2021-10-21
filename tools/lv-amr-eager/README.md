## Latvian AMR parser

A proof-of-concept Abstract Meaning Representation (AMR) parser for Latvian, which uses a machine translation based approach. First, the given sentence is translated to English using a state-of-the-art MT system. Second, we use AMREager – an incremental left-to-right AMR parser that works by scanning a sentence, and incrementally creating an AMR graph (Damonte et al., 2017).
