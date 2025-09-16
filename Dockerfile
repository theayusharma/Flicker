FROM golang:1.24.3-debain AS builder


WORKDIR /app


COPY backendGo/go.mod backendGo/go.sum ./


RUN go mod download


COPY backendGo/ .


RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server


FROM debian:bullseye-slim


RUN apk --no-cache add ca-certificates

WORKDIR /root/


COPY --from=builder /app/main .

EXPOSE 8000


CMD ["./main"]
