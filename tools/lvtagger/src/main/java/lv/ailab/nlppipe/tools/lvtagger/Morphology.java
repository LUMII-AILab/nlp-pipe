package lv.ailab.nlppipe.tools.lvtagger;

import com.google.gson.GsonBuilder;
import edu.stanford.nlp.ie.AbstractSequenceClassifier;
import edu.stanford.nlp.ie.ner.CMMClassifier;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.sequences.LVMorphologyReaderAndWriter;
import lv.ailab.nlppipe.adapter.NlpPipeAdapter;
import lv.ailab.nlppipe.tools.lvtagger.Data.Document;
import lv.ailab.nlppipe.tools.lvtagger.Data.Sentence;
import lv.ailab.nlppipe.tools.lvtagger.Data.Token;
import lv.semti.morphology.analyzer.Analyzer;
import lv.semti.morphology.analyzer.Word;
import lv.semti.morphology.analyzer.Wordform;
import lv.semti.morphology.attributes.AttributeNames;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

public class Morphology {
    static Logger LOGGER = LoggerFactory.getLogger(Morphology.class);

    static Analyzer analyzer;
    static AbstractSequenceClassifier<CoreLabel> morphoClassifier;

    public static void init() {
        try {
            analyzer = LVMorphologyReaderAndWriter.getAnalyzer();
            analyzer.describe(new PrintWriter(System.err));
            LVMorphologyReaderAndWriter.setPreloadedAnalyzer(analyzer);
            String morphoClassifierLocation = "models/lv-morpho-model.ser.gz";
            morphoClassifier = CMMClassifier.getClassifier(morphoClassifierLocation);
        } catch (Exception e) {
            LOGGER.error("Unable to initialize MorphoTagger", e);
            System.exit(1);
        }
    }

    private static void addMorphologyInfoToTokens(List<CoreLabel> words, List<Token> tokens) {
        boolean mini_tag = false;

        Iterator<Token> tokenIterator = tokens.iterator();

        for (CoreLabel word : words) {
            String token = word.getString(CoreAnnotations.TextAnnotation.class);
            if (token.contains("<s>")) continue;

            Token t = tokenIterator.next();
            Word analysis = word.get(CoreAnnotations.LVMorphologyAnalysis.class);
            Wordform mainwf = analysis.getMatchingWordform(word.getString(CoreAnnotations.AnswerAnnotation.class), false);
            if (mainwf != null) {
                if (mini_tag) mainwf.removeNonlexicalAttributes();
                t.setTag(mainwf.getTag());
                t.setPos(word.getString(CoreAnnotations.AnswerAnnotation.class));
                t.setLemma(mainwf.getValue(AttributeNames.i_Lemma));
                t.setFeatures(mainwf.pipeDelimitedEntries().toString());
            }
        }
    }

    public static void process(Document d) {
        if (d.getText() != null && (d.getSentences() == null || d.getSentences().isEmpty())) {
            d.setSentences(Tokenizer.tokenize(d.getText()).getSentences());
        }
        for (Sentence s : d.getSentences()) {
            List<Word> words = s.getTokens().stream().map(x -> analyzer.analyze(x.getText())).collect(Collectors.toList());
            List<CoreLabel> morphoTokens = LVMorphologyReaderAndWriter.analyzeSentence2(words);
            morphoTokens = morphoClassifier.classify(morphoTokens);
            addMorphologyInfoToTokens(morphoTokens, s.getTokens());
        }
    }

    public static void main(String[] args) throws Exception {
        Tokenizer.init();
        Morphology.init();

//        Document d = new Document("Arī otra figūra \"Daimler\" lietā ir Bojāra ārštata padomnieks, un sens eksmēra draugs no armijas laikiem – Armands Zeihmanis.");
//        Morphology.process(d);
//        System.err.println(new GsonBuilder().setPrettyPrinting().create().toJson(d));

        new NlpPipeAdapter<Document, Document>(Document.class, Document.class) {
            @Override
            public Document process(Document d) {
                Morphology.process(d);
                return d;
            }
        }.start();
    }
}
