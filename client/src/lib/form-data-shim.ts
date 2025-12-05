// ブラウザ環境ではFormDataがグローバルに存在するため、
// openapi-typescript-codegenが生成するform-dataインポートをこのシムで解決する
export default globalThis.FormData;

