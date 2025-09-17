# Vendas service
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY . .
EXPOSE 5003
ENV CLIENTES_URL=http://clientes:5002
ENV PRODUTOS_URL=http://produtos:5001
CMD ["node", "src/server.js"]
