import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// 把沒有語系前綴的路徑（例如 /）導向 /en 或 /zh-TW，依瀏覽器語言判斷
export default createMiddleware(routing)

export const config = {
  // 排除 API、Next.js 內部檔案，以及任何帶副檔名的靜態檔（favicon、svg…）
  matcher: '/((?!api|_next|_vercel|.*\..*).*)',
}
