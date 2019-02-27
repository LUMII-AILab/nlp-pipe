package lv.ailab.nlppipe.adapter.data;

public class TextDocument {
    protected String text;

    public TextDocument() {

    }

    public TextDocument(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
