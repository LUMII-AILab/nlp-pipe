package lv.ailab.nlppipe.adapter;

import com.google.gson.*;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GsonUtils {
    public static Gson gson = gson();

    public static JsonElement merge(JsonElement source, JsonElement target) {
        if (target == null || target.isJsonNull()) {
            return source;
        } else if (source == null || source.isJsonNull()) {
            return target;
        } else if (source.isJsonPrimitive()) {
            return source;
        } else if (source.isJsonObject()) {
            for (Map.Entry<String, JsonElement> sourceEntry : source.getAsJsonObject().entrySet()) {
                String sourceKey = sourceEntry.getKey();
                JsonElement sourceValue = sourceEntry.getValue();
                target.getAsJsonObject().add(sourceKey, merge(sourceValue, target.getAsJsonObject().get(sourceKey)));
            }
            return target;
        } else if (source.isJsonArray()) {
            JsonArray arr = new JsonArray();
            for (int i=0; i < source.getAsJsonArray().size(); i++) {
                arr.add(merge(source.getAsJsonArray().get(i), target.getAsJsonArray().get(i)));
            }
            return arr;
        }
        return null;
    }

    public static Gson gson() {
        CustomizedObjectTypeAdapter adapter = new CustomizedObjectTypeAdapter();
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Map.class, adapter)
                .registerTypeAdapter(List.class, adapter)
                .create();
        return gson;
    }

    static class CustomizedObjectTypeAdapter extends TypeAdapter<Object> {

        private final TypeAdapter<Object> delegate = new Gson().getAdapter(Object.class);

        @Override
        public void write(JsonWriter out, Object value) throws IOException {
            delegate.write(out, value);
        }

        @Override
        public Object read(JsonReader in) throws IOException {
            JsonToken token = in.peek();
            switch (token) {
                case BEGIN_ARRAY:
                    List<Object> list = new ArrayList<Object>();
                    in.beginArray();
                    while (in.hasNext()) {
                        list.add(read(in));
                    }
                    in.endArray();
                    return list;

                case BEGIN_OBJECT:
                    Map<String, Object> map = new LinkedTreeMap<String, Object>();
                    in.beginObject();
                    while (in.hasNext()) {
                        map.put(in.nextName(), read(in));
                    }
                    in.endObject();
                    return map;

                case STRING:
                    return in.nextString();

                case NUMBER:
                    //return in.nextDouble();
                    String n = in.nextString();
                    if (n.indexOf('.') != -1) {
                        return Double.parseDouble(n);
                    }
                    return Long.parseLong(n);

                case BOOLEAN:
                    return in.nextBoolean();

                case NULL:
                    in.nextNull();
                    return null;

                default:
                    throw new IllegalStateException();
            }
        }
    };
};
