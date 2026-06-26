/**
 * Borrowable equipment (issue/return, QR scanner, /inventory) is deferred until
 * after thesis defense. Set to true to restore full dual-inventory workflows.
 */
export const BORROWABLE_INVENTORY_ENABLED = false;

export const BORROWABLE_ONLY_ROUTES = ["/inventory", "/scan"] as const;

export function isBorrowableOnlyRoute(pathname: string) {
  return BORROWABLE_ONLY_ROUTES.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}
