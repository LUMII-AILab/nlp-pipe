package lv.ailab.nlppipe.adapter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.*;
import java.util.concurrent.TimeoutException;

public class NlpPipeAdapter<InputDoc, OutputDoc> {
    final Logger LOGGER = LoggerFactory.getLogger(NlpPipeAdapter.class);

    protected Type inputType;
    protected Type outputType;
    protected Gson gson;

    protected String queue;
    protected Connection connection;
    protected Channel channel;
    protected Consumer consumer;

    public NlpPipeAdapter(Type inputType, Type outputType) throws Exception {
        this(inputType, outputType, System.getenv("MQ_URL"), System.getenv("QUEUE"), true);
    }

    public NlpPipeAdapter(Type inputType, Type outputType, String connectionUri, String queue, boolean durable)
            throws Exception {
        this.queue = queue;

        this.inputType = inputType;
        this.outputType = outputType;
        this.gson = new GsonBuilder().setPrettyPrinting().create();

        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(connectionUri);

        this.connection = factory.newConnection();
        this.channel = connection.createChannel();
        channel.basicQos(100, false);
        channel.queueDeclare(queue, durable, false, false, null);

        this.consumer = new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
                    throws IOException {
                String inputMessage = new String(body, "UTF-8");
                LOGGER.debug("Process {}", inputMessage);
                LOGGER.debug("Headers {}", new Gson().toJson(properties));

                Map<String, Object> headers = properties.getHeaders();
                String nextStep = null;
                String nextNextSteps = null;
                try {
                    if (headers != null && headers.get("next") != null) {
                        String[] steps = headers.get("next").toString().split("\\|", 2);
                        nextStep = steps[0];
                        if (steps.length > 1) {
                            nextNextSteps = steps[1];
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                if (headers != null) headers.put("next", nextNextSteps);
                AMQP.BasicProperties nextProps = new AMQP.BasicProperties(
                        properties.getContentType(),
                        properties.getContentEncoding(),
                        headers,
                        properties.getDeliveryMode(),
                        properties.getPriority(),
                        properties.getCorrelationId(),
                        properties.getReplyTo(),
                        properties.getExpiration(),
                        properties.getMessageId(),
                        properties.getTimestamp(),
                        properties.getType(),
                        properties.getUserId(),
                        properties.getAppId(),
                        properties.getClusterId()
                );
                LOGGER.info("Next {} {}, props={}", nextStep, nextNextSteps, nextProps);

                try {
                    InputDoc inputDoc = new Gson().fromJson(inputMessage, NlpPipeAdapter.this.inputType);
                    OutputDoc outputDoc = NlpPipeAdapter.this.process(inputDoc);

                    String resultMessage = GsonUtils.merge(GsonUtils.gson.toJsonTree(outputDoc), GsonUtils.gson.toJsonTree(GsonUtils.gson.fromJson(inputMessage, Map.class))).toString();
                    LOGGER.debug("Result: {}", resultMessage);

                    if (nextStep != null) {
                        LOGGER.info("Queue to {}", nextStep);
                        channel.basicPublish("", nextStep, nextProps, resultMessage.getBytes("UTF-8"));
                    } else if (properties.getReplyTo() != null) {
                        LOGGER.info("Reply to {}", properties.getReplyTo());
                        channel.basicPublish("", properties.getReplyTo(), nextProps, resultMessage.getBytes("UTF-8"));
                    }
                    channel.basicAck(envelope.getDeliveryTag(), false);
                } catch (Exception e) {
                    e.printStackTrace();
                    channel.basicNack(envelope.getDeliveryTag(), false, false);
                }

                LOGGER.info("Finished with message");
            }
        };
    }

    public OutputDoc process(InputDoc doc) {
        throw new UnsupportedOperationException();
    }

    public void start() throws IOException {
        LOGGER.info(" [*] Waiting for messages. To exit press CTRL+C");
        channel.basicConsume(queue, false, consumer);
    }

    public void close() throws IOException {
        try {
            channel.close();
        } catch (TimeoutException e) {
            e.printStackTrace();
        }
        connection.close();
    }

}
