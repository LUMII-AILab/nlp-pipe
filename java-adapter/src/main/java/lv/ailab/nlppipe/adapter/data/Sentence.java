package lv.ailab.nlppipe.adapter.data;

import java.util.LinkedList;
import java.util.List;

public class Sentence<Token> {
    protected List<Token> tokens;

    public Sentence() {

    }

    public Sentence(List<Token> tokens) {
        this.tokens = tokens;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }

    public void addToken(Token token) {
        if (this.tokens == null) this.tokens = new LinkedList<>();
        this.tokens.add(token);
    }
}
