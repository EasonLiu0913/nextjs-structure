#!/bin/bash

# 部署腳本
# 用於本地測試部署流程

set -e  # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 檢查必要工具
check_dependencies() {
    log_info "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

# 檢查環境變數
check_environment() {
    log_info "Checking environment variables..."
    
    local required_vars=()
    
    if [ "$ENVIRONMENT" = "production" ]; then
        required_vars=(
            "NEXT_PUBLIC_APP_NAME"
            "NEXT_PUBLIC_APP_URL"
            "NEXTAUTH_SECRET"
            "NEXTAUTH_URL"
        )
    fi
    
    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_warning "Missing environment variables: ${missing_vars[*]}"
        log_info "Continuing with default values..."
    else
        log_success "Environment variables are set"
    fi
}

# 執行測試
run_tests() {
    log_info "Running tests..."
    
    if [ "$SKIP_TESTS" = "true" ]; then
        log_warning "Skipping tests (SKIP_TESTS=true)"
        return 0
    fi
    
    # Lint 檢查
    log_info "Running lint checks..."
    npm run lint || {
        log_error "Lint checks failed"
        exit 1
    }
    
    # 型別檢查
    log_info "Running type checks..."
    npm run type-check || {
        log_error "Type checks failed"
        exit 1
    }
    
    # 單元測試
    log_info "Running unit tests..."
    npm run test:coverage || {
        log_error "Unit tests failed"
        exit 1
    }
    
    log_success "All tests passed"
}

# 建置應用程式
build_application() {
    log_info "Building application..."
    
    # 清理舊的建置
    if [ -d ".next" ]; then
        rm -rf .next
        log_info "Cleaned previous build"
    fi
    
    # 建置
    npm run build || {
        log_error "Build failed"
        exit 1
    }
    
    log_success "Build completed"
}

# 建立部署包
create_deployment_package() {
    log_info "Creating deployment package..."
    
    local deploy_dir="deployment"
    
    # 清理舊的部署目錄
    if [ -d "$deploy_dir" ]; then
        rm -rf "$deploy_dir"
    fi
    
    mkdir -p "$deploy_dir"
    
    # 複製必要檔案
    cp -r .next "$deploy_dir/"
    cp -r public "$deploy_dir/"
    cp package.json "$deploy_dir/"
    cp package-lock.json "$deploy_dir/"
    cp next.config.js "$deploy_dir/" 2>/dev/null || true
    cp web.config "$deploy_dir/" 2>/dev/null || true
    
    # 如果有 standalone 建置
    if [ -d ".next/standalone" ]; then
        log_info "Using standalone build"
        cp -r .next/standalone/* "$deploy_dir/"
        cp -r .next/static "$deploy_dir/.next/"
    fi
    
    # 安裝生產依賴
    cd "$deploy_dir"
    npm ci --only=production --silent
    cd ..
    
    log_success "Deployment package created in $deploy_dir/"
}

# 執行健康檢查
health_check() {
    local url="$1"
    log_info "Running health check for $url"
    
    node scripts/health-check.js "$url" || {
        log_error "Health check failed"
        return 1
    }
    
    log_success "Health check passed"
}

# 部署到本地
deploy_local() {
    log_info "Starting local deployment..."
    
    # 啟動應用程式
    npm start &
    local app_pid=$!
    
    # 等待應用程式啟動
    sleep 10
    
    # 健康檢查
    if health_check "http://localhost:3000/api/health"; then
        log_success "Local deployment successful"
    else
        log_error "Local deployment failed"
        kill $app_pid 2>/dev/null || true
        exit 1
    fi
    
    # 停止應用程式
    kill $app_pid 2>/dev/null || true
}

# 顯示幫助
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Deployment environment (local, staging, production)"
    echo "  -s, --skip-tests        Skip running tests"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  ENVIRONMENT             Deployment environment"
    echo "  SKIP_TESTS              Skip tests (true/false)"
    echo "  NEXT_PUBLIC_APP_NAME    Application name"
    echo "  NEXT_PUBLIC_APP_URL     Application URL"
    echo "  NEXTAUTH_SECRET         NextAuth secret"
    echo "  NEXTAUTH_URL            NextAuth URL"
    echo ""
    echo "Examples:"
    echo "  $0 --environment local"
    echo "  $0 --environment staging --skip-tests"
    echo "  ENVIRONMENT=production $0"
}

# 主函數
main() {
    local environment="local"
    local skip_tests="false"
    
    # 解析命令列參數
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                environment="$2"
                shift 2
                ;;
            -s|--skip-tests)
                skip_tests="true"
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
    
    # 設定環境變數
    export ENVIRONMENT="${ENVIRONMENT:-$environment}"
    export SKIP_TESTS="${SKIP_TESTS:-$skip_tests}"
    
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Skip tests: $SKIP_TESTS"
    
    # 執行部署步驟
    check_dependencies
    check_environment
    
    # 安裝依賴
    log_info "Installing dependencies..."
    npm ci
    
    run_tests
    build_application
    create_deployment_package
    
    case "$ENVIRONMENT" in
        local)
            deploy_local
            ;;
        staging|production)
            log_info "Deployment package ready for $ENVIRONMENT"
            log_info "Use your CI/CD pipeline to deploy the 'deployment' directory"
            ;;
        *)
            log_error "Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    log_success "Deployment process completed!"
}

# 執行主函數
main "$@"