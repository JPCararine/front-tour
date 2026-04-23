# 🏗️ Arquitetura do Sistema

## Visão Geral

Sistema de vendas baseado em arquitetura de microserviços usando Spring Cloud e React.

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                      React + Material-UI                     │
│                     http://localhost:3000                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│                   Spring Cloud Gateway                       │
│                   http://localhost:8080                      │
│                                                              │
│  Routes:                                                     │
│  - /api/products/**  → Product Service                      │
│  - /api/orders/**    → Order Service                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐
│  PRODUCT SERVICE    │       │   ORDER SERVICE     │
│   Port: 8081        │       │   Port: 8082        │
│                     │       │                     │
│  - Products CRUD    │       │  - Orders CRUD      │
│  - Stock Control    │       │  - Status Manager   │
│  - Search           │       │  - Order Items      │
└──────────┬──────────┘       └──────────┬──────────┘
           │                             │
           ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐
│   product_db        │       │    order_db         │
│   (MySQL)           │       │   (MySQL)           │
└─────────────────────┘       └─────────────────────┘

            ▲                             ▲
            └──────────────┬──────────────┘
                           │
                           │ Service Discovery
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE REGISTRY                           │
│                     Eureka Server                            │
│                   http://localhost:8761                      │
│                                                              │
│  Registered Services:                                        │
│  - api-gateway                                              │
│  - product-service                                          │
│  - order-service                                            │
└─────────────────────────────────────────────────────────────┘
```

## Componentes

### 1. Service Registry (Eureka Server)
- **Porta:** 8761
- **Função:** Descoberta de serviços
- **Tecnologias:** Spring Cloud Netflix Eureka
- **Responsabilidades:**
  - Registrar todos os microserviços
  - Health check dos serviços
  - Load balancing dinâmico
  - Service discovery

### 2. API Gateway
- **Porta:** 8080
- **Função:** Ponto único de entrada
- **Tecnologias:** Spring Cloud Gateway
- **Responsabilidades:**
  - Roteamento de requisições
  - CORS configuration
  - Request/Response filtering
  - Load balancing
  - Circuit breaker (futuro)

**Rotas:**
```yaml
/api/products/**  → product-service
/api/orders/**    → order-service
```

### 3. Product Service
- **Porta:** 8081
- **Função:** Gerenciamento de produtos
- **Banco de Dados:** product_db (MySQL)
- **Endpoints principais:**
  - `GET /products` - Lista produtos
  - `POST /products` - Cria produto
  - `PUT /products/{id}` - Atualiza produto
  - `DELETE /products/{id}` - Remove produto (soft delete)
  - `GET /products/search` - Busca produtos

**Modelo de Dados:**
```java
Product {
  id: Long
  name: String
  description: String
  price: BigDecimal
  stock: Integer
  category: String
  imageUrl: String
  active: Boolean
  createdAt: LocalDateTime
  updatedAt: LocalDateTime
}
```

### 4. Order Service
- **Porta:** 8082
- **Função:** Gerenciamento de pedidos
- **Banco de Dados:** order_db (MySQL)
- **Endpoints principais:**
  - `GET /orders` - Lista pedidos
  - `POST /orders` - Cria pedido
  - `PATCH /orders/{id}/status` - Atualiza status
  - `DELETE /orders/{id}` - Cancela pedido
  - `GET /orders/customer/{email}` - Pedidos por cliente

**Modelo de Dados:**
```java
Order {
  id: Long
  customerName: String
  customerEmail: String
  customerPhone: String
  address: String
  totalAmount: BigDecimal
  status: OrderStatus
  items: List<OrderItem>
  createdAt: LocalDateTime
  updatedAt: LocalDateTime
}

OrderItem {
  id: Long
  productId: Long
  productName: String
  quantity: Integer
  price: BigDecimal
  subtotal: BigDecimal
}

OrderStatus {
  PENDING, CONFIRMED, PROCESSING, 
  SHIPPED, DELIVERED, CANCELLED
}
```

### 5. Frontend (React)
- **Porta:** 3000
- **Função:** Interface do usuário
- **Tecnologias:** 
  - React 18
  - Material-UI
  - React Router
  - Axios

**Páginas:**
- Dashboard - Visão geral
- Product List - Lista de produtos
- Product Form - Criar/Editar produto
- Order List - Lista de pedidos
- Order Form - Criar pedido

## Padrões de Arquitetura

### 1. Database per Service
Cada microserviço tem seu próprio banco de dados:
- `product_db` para Product Service
- `order_db` para Order Service

### 2. API Gateway Pattern
Gateway único para todos os serviços, simplificando:
- Autenticação (futuro)
- Rate limiting (futuro)
- Logging centralizado (futuro)

### 3. Service Registry Pattern
Eureka para descoberta dinâmica de serviços:
- Auto-registro de serviços
- Health monitoring
- Load balancing client-side

### 4. Circuit Breaker Pattern (Futuro)
Resilience4j para tolerância a falhas:
- Fallback methods
- Retry logic
- Bulkhead pattern

## Fluxo de Requisição

### Criar Pedido
```
1. User → Frontend: Preenche formulário
2. Frontend → API Gateway: POST /api/orders/orders
3. API Gateway → Eureka: Resolve order-service
4. API Gateway → Order Service: POST /orders
5. Order Service → MySQL: INSERT into orders
6. Order Service → API Gateway: Response 201
7. API Gateway → Frontend: Order created
8. Frontend: Atualiza UI
```

### Listar Produtos
```
1. User → Frontend: Acessa /products
2. Frontend → API Gateway: GET /api/products/products
3. API Gateway → Eureka: Resolve product-service
4. API Gateway → Product Service: GET /products
5. Product Service → MySQL: SELECT * FROM products
6. Product Service → API Gateway: Response 200 + data
7. API Gateway → Frontend: Products list
8. Frontend: Renderiza tabela
```

## Comunicação Entre Serviços

### Síncrona (REST)
- Frontend ↔ API Gateway: HTTP/REST
- API Gateway ↔ Microserviços: HTTP/REST via Feign Client
- Load balancing: Client-side com Ribbon

### Assíncrona (Futuro)
- RabbitMQ/Kafka para eventos
- Event-driven architecture
- SAGA pattern para transações distribuídas

## Segurança

### Atual
- CORS configurado no Gateway
- Validação de dados nos controllers

### Planejado
- JWT Authentication
- OAuth2/Spring Security
- API Keys
- Rate Limiting

## Escalabilidade

### Horizontal Scaling
Cada serviço pode ser escalado independentemente:
```bash
# Product Service - 3 instâncias
java -jar product-service.jar --server.port=8081
java -jar product-service.jar --server.port=8091
java -jar product-service.jar --server.port=8092

# Eureka automaticamente faz load balancing
```

### Vertical Scaling
Ajustar recursos por serviço:
```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
```

## Monitoramento (Futuro)

### Spring Boot Actuator
- Health endpoints
- Metrics
- Info

### ELK Stack
- Elasticsearch: Storage
- Logstash: Processing
- Kibana: Visualization

### Distributed Tracing
- Sleuth + Zipkin
- Request tracing across services

## Deployment

### Local Development
```bash
./scripts/start-all.sh
```

### Docker
```bash
docker-compose up -d
```

### Kubernetes (Futuro)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
spec:
  replicas: 3
  ...
```

## Testes

### Unitários
```bash
mvn test
```

### Integração
```bash
mvn verify
```

### E2E (Futuro)
- Cypress para frontend
- TestContainers para backend

## Performance

### Otimizações Aplicadas
- Connection pooling (HikariCP)
- JPA lazy loading
- Response caching no gateway

### Métricas Esperadas
- Response time: < 200ms
- Throughput: > 1000 req/s
- Availability: 99.9%

## Evolução Futura

### Fase 2
- [ ] User Service (Autenticação)
- [ ] Payment Service
- [ ] Notification Service (Email/SMS)

### Fase 3
- [ ] Event-driven com Kafka
- [ ] CQRS pattern
- [ ] API rate limiting
- [ ] Caching com Redis

### Fase 4
- [ ] Monitoring com Prometheus/Grafana
- [ ] CI/CD com Jenkins/GitLab
- [ ] Deploy em Kubernetes
- [ ] Service Mesh (Istio)
