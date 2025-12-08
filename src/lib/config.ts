const config = {
  env: {
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    databaseUrl: process.env.DATABASE_URL!,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
      qstashCurrentSignInKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
      qstashNextSignInKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
    },
  },
};

export default config;
