# Build Stage
FROM golang:1.19-alpine3.17 AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . ./

RUN go build -o /dist

# Deploy Stage
FROM alpine:latest

WORKDIR /

COPY --from=build /dist /dist

EXPOSE 8080

# USER nonroot:nonroot

ENTRYPOINT ["/dist"]
