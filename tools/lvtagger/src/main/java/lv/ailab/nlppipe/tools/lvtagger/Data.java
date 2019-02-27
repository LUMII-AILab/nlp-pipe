package lv.ailab.nlppipe.tools.lvtagger;

import lv.ailab.nlppipe.adapter.data.MorphologyToken;

public class Data {

    public static class Token extends MorphologyToken {

    }

    public static class Sentence extends lv.ailab.nlppipe.adapter.data.Sentence<Token> {

    }

    public static class Document extends lv.ailab.nlppipe.adapter.data.Document<Sentence> {
        public Document() {
        }

        public Document(String text) {
            super(text);
        }
    }
}


