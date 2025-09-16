FROM golang:1.25.1 AS builder

ENV GOTOOLCHAIN=auto

WORKDIR /app


COPY backendGo/go.mod backendGo/go.sum ./


RUN go mod download


COPY backendGo/ .


RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server



#RUN apk --no-cache add ca-certificates # for aplineeee
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
FROM debian:bullseye-slim

WORKDIR /root/


COPY --from=builder /app/main .

EXPOSE 8000


CMD ["./main"]
