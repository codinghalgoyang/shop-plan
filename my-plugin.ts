import { withAndroidManifest, ConfigPlugin } from "expo/config-plugins";

const withAndroidQueries: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    if (!config.modResults.manifest.queries) {
      config.modResults.manifest.queries = [];
    }

    config.modResults.manifest.queries.push({
      intent: [
        {
          action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
          data: [
            { $: { "android:scheme": "https" } },
            { $: { "android:host": "link.coupang.com/a/cizNQT" } },
          ],
        },
      ],
    });

    return config;
  });
};

export default withAndroidQueries;
