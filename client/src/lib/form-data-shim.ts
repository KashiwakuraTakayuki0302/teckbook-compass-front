// ブラウザ環境ではFormDataがグローバルに存在するため、
// openapi-typescript-codegenが生成するform-dataインポートをこのシムで解決する
class FormDataShim extends globalThis.FormData {
    getHeaders(): Record<string, string> {
        return {};
    }
}
export default FormDataShim;

