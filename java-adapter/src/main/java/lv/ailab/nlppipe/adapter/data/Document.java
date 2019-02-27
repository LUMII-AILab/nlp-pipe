package lv.ailab.nlppipe.adapter.data;

import java.util.LinkedList;
import java.util.List;

public class Document<Sentence> extends TextDocument {
    protected List<Sentence> sentences;

    public Document() {

    }

    public Document(String text) {
        super(text);
    }

    public List<Sentence> getSentences() {
        return sentences;
    }

    public void setSentences(List<Sentence> sentences) {
        this.sentences = sentences;
    }

    public void addSentence(Sentence sentence) {
        if (this.sentences == null) this.sentences = new LinkedList<>();
        this.sentences.add(sentence);
    }
}
