package lv.ailab.nlppipe.adapter.data;

public class MorphologyToken extends Token {
    protected String lemma;
    protected String features;
    protected String pos;
    protected String tag;

    public MorphologyToken() {

    }

    public MorphologyToken(String text) {
        this.text = text;
    }

    public String getLemma() {
        return lemma;
    }

    public void setLemma(String lemma) {
        this.lemma = lemma;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public String getPos() {
        return pos;
    }

    public void setPos(String pos) {
        this.pos = pos;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
