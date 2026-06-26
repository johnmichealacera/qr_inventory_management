/**
 * Borrowable equipment (/inventory, issue/return workflows) is deferred until
 * after thesis defense. QR Scanner remains available for consumable stock moves.
 */
export const BORROWABLE_INVENTORY_ENABLED = false;

export const BORROWABLE_ONLY_ROUTES = ["/inventory"] as const;

export function isBorrowableOnlyRoute(pathname: string) {
  return BORROWABLE_ONLY_ROUTES.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}
