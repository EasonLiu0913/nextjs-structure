#!/usr/bin/env node

/**
 * 健康檢查腳本
 * 用於驗證應用程式是否正常運行
 */

const http = require('http');
const https = require('https');

const DEFAULT_TIMEOUT = 30000; // 30 秒
const DEFAULT_RETRIES = 3;

async function healthCheck(url, options = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    expectedStatus = 200,
    expectedText = null
  } = options;

  const client = url.startsWith('https:') ? https : http;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔍 Health check attempt ${attempt}/${retries} for ${url}`);
      
      const result = await new Promise((resolve, reject) => {
        const req = client.get(url, { timeout }, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              data: data,
              headers: res.headers
            });
          });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });
      
      // 檢查狀態碼
      if (result.statusCode !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${result.statusCode}`);
      }
      
      // 檢查回應內容
      if (expectedText && !result.data.includes(expectedText)) {
        throw new Error(`Expected text "${expectedText}" not found in response`);
      }
      
      console.log(`✅ Health check passed (${result.statusCode})`);
      return {
        success: true,
        statusCode: result.statusCode,
        responseTime: Date.now(),
        attempt
      };
      
    } catch (error) {
      console.log(`❌ Health check failed (attempt ${attempt}): ${error.message}`);
      
      if (attempt === retries) {
        throw error;
      }
      
      // 等待後重試
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const url = args[0] || process.env.HEALTH_CHECK_URL || 'http://localhost:3000/api/health';
  
  const options = {
    timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || DEFAULT_TIMEOUT,
    retries: parseInt(process.env.HEALTH_CHECK_RETRIES) || DEFAULT_RETRIES,
    expectedStatus: parseInt(process.env.HEALTH_CHECK_STATUS) || 200,
    expectedText: process.env.HEALTH_CHECK_TEXT || null
  };
  
  console.log(`🚀 Starting health check for: ${url}`);
  console.log(`⚙️ Options:`, options);
  
  try {
    const result = await healthCheck(url, options);
    console.log(`🎉 Health check completed successfully!`);
    console.log(`📊 Result:`, result);
    process.exit(0);
  } catch (error) {
    console.error(`💥 Health check failed: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { healthCheck };