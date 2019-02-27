package lv.ailab.nlppipe.tools.lvtagger;

import edu.stanford.nlp.sequences.LVMorphologyReaderAndWriter;
import lv.ailab.nlppipe.adapter.NlpPipeAdapter;
import lv.semti.morphology.analyzer.Analyzer;
import lv.semti.morphology.analyzer.Splitting;
import lv.semti.morphology.analyzer.Word;
import lv.ailab.nlppipe.tools.lvtagger.Data.*;
import java.util.List;

public class Tokenizer {
    public static Analyzer analyzer;

    public static void init() {
        Tokenizer.analyzer = LVMorphologyReaderAndWriter.getAnalyzer();;
    }

    public static Data.Document tokenize(String text) {
        Document d = new Document();
        d.setText(text);

        List<? extends List<Word>> sentences = Splitting.tokenizeSentences(analyzer, text, 250);

        for (List<Word> sentence : sentences) {
            Sentence s = new Sentence();
            for (Word w : sentence) {
                Token t = new Token();
                t.setText(w.getToken());
                s.addToken(t);
            }
            d.addSentence(s);
        }
        return d;
    }

    public static void main(String[] args) throws Exception {
        Tokenizer.init();

//        System.out.println(Tokenizer.tokenize("jauns 1.d.d."));

        new NlpPipeAdapter<Document, Document>(Document.class, Document.class) {
            @Override
            public Document process(Document d) {
                return Tokenizer.tokenize(d.getText());
            }
        }.start();
    }
}
