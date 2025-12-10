# ====== Build Stage ======
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for environment variables (optional override)
ARG VITE_API_URL
ARG VITE_APP_ID

# If build args are provided, create .env file from them
# Otherwise, use .env.production file
RUN if [ -n "$VITE_API_URL" ]; then \
      echo "VITE_API_URL=$VITE_API_URL" > .env.production; \
      echo "VITE_APP_ID=$VITE_APP_ID" >> .env.production; \
    fi

# Build the application (Vite will automatically use .env.production)
RUN pnpm run build


# ====== Runtime Stage (Not needed for S3 deploy) ======
# これはローカル確認用で、S3 deploy なら使わない。
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# 必要なら ViteのSPA用 fallback 設定
RUN sed -i 's#/usr/share/nginx/html;#/usr/share/nginx/html;\n    try_files $uri /index.html;#' /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
