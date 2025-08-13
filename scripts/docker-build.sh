#!/bin/bash

# Docker 建置腳本

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日誌函數
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 預設值
IMAGE_NAME="nextjs-enterprise-app"
TAG="latest"
DOCKERFILE="Dockerfile"
CONTEXT="."
PLATFORM="linux/amd64"
PUSH=false
REGISTRY=""

# 顯示幫助
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --name NAME         Image name (default: $IMAGE_NAME)"
    echo "  -t, --tag TAG           Image tag (default: $TAG)"
    echo "  -f, --file DOCKERFILE   Dockerfile path (default: $DOCKERFILE)"
    echo "  -c, --context CONTEXT   Build context (default: $CONTEXT)"
    echo "  -p, --platform PLATFORM Target platform (default: $PLATFORM)"
    echo "  --push                  Push image to registry"
    echo "  -r, --registry REGISTRY Registry URL"
    echo "  --dev                   Use development Dockerfile"
    echo "  --multi-arch            Build for multiple architectures"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --name myapp --tag v1.0.0"
    echo "  $0 --dev"
    echo "  $0 --push --registry ghcr.io/username"
    echo "  $0 --multi-arch --push"
}

# 解析命令列參數
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -f|--file)
            DOCKERFILE="$2"
            shift 2
            ;;
        -c|--context)
            CONTEXT="$2"
            shift 2
            ;;
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        --push)
            PUSH=true
            shift
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        --dev)
            DOCKERFILE="Dockerfile.dev"
            TAG="dev"
            shift
            ;;
        --multi-arch)
            PLATFORM="linux/amd64,linux/arm64"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# 建構完整的映像名稱
if [[ -n "$REGISTRY" ]]; then
    FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
else
    FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"
fi

log_info "Starting Docker build process..."
log_info "Image: $FULL_IMAGE_NAME"
log_info "Dockerfile: $DOCKERFILE"
log_info "Context: $CONTEXT"
log_info "Platform: $PLATFORM"

# 檢查 Docker 是否可用
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed or not in PATH"
    exit 1
fi

# 檢查 Dockerfile 是否存在
if [[ ! -f "$DOCKERFILE" ]]; then
    log_error "Dockerfile not found: $DOCKERFILE"
    exit 1
fi

# 建立 buildx builder (如果需要多架構建置)
if [[ "$PLATFORM" == *","* ]]; then
    log_info "Setting up buildx for multi-architecture build..."
    docker buildx create --use --name multiarch-builder 2>/dev/null || true
fi

# 建置映像
log_info "Building Docker image..."

BUILD_ARGS=""
if [[ "$PUSH" == true ]]; then
    BUILD_ARGS="--push"
elif [[ "$PLATFORM" == *","* ]]; then
    BUILD_ARGS="--load"
fi

if [[ "$PLATFORM" == *","* ]]; then
    # 多架構建置
    docker buildx build \
        --platform "$PLATFORM" \
        --file "$DOCKERFILE" \
        --tag "$FULL_IMAGE_NAME" \
        $BUILD_ARGS \
        "$CONTEXT"
else
    # 單一架構建置
    docker build \
        --platform "$PLATFORM" \
        --file "$DOCKERFILE" \
        --tag "$FULL_IMAGE_NAME" \
        "$CONTEXT"
    
    if [[ "$PUSH" == true ]]; then
        log_info "Pushing image to registry..."
        docker push "$FULL_IMAGE_NAME"
    fi
fi

log_success "Docker build completed successfully!"

# 顯示映像資訊
if [[ "$PUSH" != true ]]; then
    log_info "Image information:"
    docker images "$FULL_IMAGE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
fi

# 執行基本測試
if [[ "$DOCKERFILE" != "Dockerfile.dev" && "$PUSH" != true ]]; then
    log_info "Running basic container test..."
    
    # 啟動容器進行測試
    CONTAINER_ID=$(docker run -d \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e NEXT_PUBLIC_APP_NAME="Test App" \
        -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
        -e NEXTAUTH_SECRET="test-secret" \
        -e NEXTAUTH_URL="http://localhost:3000" \
        "$FULL_IMAGE_NAME")
    
    # 等待容器啟動
    sleep 10
    
    # 健康檢查
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        log_success "Container test passed!"
    else
        log_warning "Container test failed - health check endpoint not responding"
    fi
    
    # 清理測試容器
    docker stop "$CONTAINER_ID" >/dev/null 2>&1
    docker rm "$CONTAINER_ID" >/dev/null 2>&1
fi

log_success "Build process completed!"

if [[ "$PUSH" != true ]]; then
    echo ""
    log_info "To run the container:"
    echo "docker run -p 3000:3000 $FULL_IMAGE_NAME"
    echo ""
    log_info "To push the image:"
    echo "$0 --name $IMAGE_NAME --tag $TAG --push --registry YOUR_REGISTRY"
fi